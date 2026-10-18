import { allowLoginAttempt, audit, authUser, beginLogin, clearSession, config, db, finishMfa, json, readBody, readPreauth, readSessionToken, requireAdmin, requireSameOrigin, supabaseAuth } from '../_lib/admin.js';

const text = (value, max = 20_000) => typeof value === 'string' && value.length <= max;
const statusValue = value => ['draft', 'published'].includes(value);
const safeSlug = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && !['admin','api','sitemap','robots'].includes(value);
const pathOf = req => new URL(req.url, 'https://local.invalid').pathname.split('/').slice(3).join('/');

async function adminLogin(req, res) {
  requireSameOrigin(req); allowLoginAttempt(req);
  const body = await readBody(req, 5000);
  if (!text(body.email, 254) || !text(body.password, 1024)) return json(res, 400, { error: 'Enter a valid email and password.' });
  const c = config();
  let session, identity;
  try {
    session = await supabaseAuth('token?grant_type=password', { method: 'POST', body: { email: body.email.trim(), password: body.password }, anon: c.anon });
    identity = await authUser(session.access_token);
    if (!identity.user.email_confirmed_at) throw new Error('Sign-in failed.');
    const profile = await db('admin_profiles', `?select=user_id&user_id=eq.${encodeURIComponent(identity.user.id)}&role=eq.admin&limit=1`);
    if (!profile.data?.length) throw new Error('Sign-in failed.');
  } catch { await audit(null, 'admin_authentication_failed', 'admin_sign_in', 'failure', { stage: 'password' }).catch(() => {}); clearSession(res); return json(res, 401, { error: 'Sign-in failed. Check your credentials or administrator access.' }); }
  const factors = await supabaseAuth('factors', { token: session.access_token }).catch(() => ({ factors: [] }));
  const totp = (factors.factors || []).filter(f => f.factor_type === 'totp');
  if (totp.some(f => f.status === 'verified')) { beginLogin(res, session, 'verify'); return json(res, 200, { next: 'verify-2fa', factorId: totp.find(f=>f.status==='verified').id }); }
  beginLogin(res, session, 'enroll');
  return json(res, 200, { next: 'enroll-2fa' });
}

async function enroll(req, res) {
  requireSameOrigin(req); const pre = readPreauth(req);
  if (pre.stage !== 'enroll') return json(res, 409, { error: 'This account is already enrolled. Sign in again.' });
  const identity = await authUser(pre.access_token);
  const factors = await supabaseAuth('factors', { token: pre.access_token });
  if ((factors.factors || []).some(f => f.factor_type === 'totp' && f.status === 'verified')) return json(res, 409, { error: 'A verified authenticator is already configured. Sign in again.' });
  for (const factor of (factors.factors || []).filter(f => f.factor_type === 'totp' && f.status !== 'verified')) await supabaseAuth(`factors/${encodeURIComponent(factor.id)}`, { method: 'DELETE', token: pre.access_token }).catch(() => {});
  const enrolled = await supabaseAuth('factors', { method: 'POST', token: pre.access_token, body: { factor_type: 'totp', friendly_name: 'Rooftop admin authenticator' } });
  return json(res, 200, { factorId: enrolled.id, qrCode: enrolled.totp?.qr_code, uri: enrolled.totp?.uri, email: identity.user.email });
}

async function verifyMfa(req, res) {
  requireSameOrigin(req); allowLoginAttempt(req); const pre = readPreauth(req), body = await readBody(req, 2000);
  if (!/^\d{6}$/.test(body.code || '')) return json(res, 400, { error: 'Enter the six-digit authenticator code.' });
  const identity = await authUser(pre.access_token);
  const factors = await supabaseAuth('factors', { token: pre.access_token });
  const factor = (factors.factors || []).find(f => f.id === body.factorId && f.factor_type === 'totp' && (pre.stage === 'enroll' ? f.status !== 'verified' : f.status === 'verified'));
  if (!factor) return json(res, 400, { error: 'Authenticator enrollment expired. Start again.' });
  let session;
  try { const challenge = await supabaseAuth(`factors/${encodeURIComponent(factor.id)}/challenge`, { method: 'POST', token: pre.access_token, body: {} }); session = await supabaseAuth(`factors/${encodeURIComponent(factor.id)}/verify`, { method: 'POST', token: pre.access_token, body: { challenge_id: challenge.id, code: body.code } }); }
  catch { await audit(null, 'admin_authentication_failed', 'admin_sign_in', 'failure', { stage: 'totp' }).catch(() => {}); return json(res, 401, { error: 'The authenticator code was not accepted. Try the current code from your app.' }); }
  const verified = await authUser(session.access_token);
  if (verified.claims.aal !== 'aal2') return json(res, 403, { error: 'Second-factor verification did not establish an admin session.' });
  const profile = await db('admin_profiles', `?select=user_id&user_id=eq.${encodeURIComponent(identity.user.id)}&role=eq.admin&limit=1`);
  if (!profile.data?.length) { clearSession(res); return json(res, 403, { error: 'Administrator access is not provisioned.' }); }
  finishMfa(res, session);
  await audit(identity.user, pre.stage === 'enroll' ? 'mfa_enrolled' : 'admin_sign_in', 'admin_session');
  return json(res, 200, { ok: true, email: identity.user.email });
}

function validCanonical(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname) && !url.hostname.endsWith('.vercel.app') && url.pathname === '/' && !url.search && !url.hash; } catch { return false; }
}

async function getCount(table, filter = '') {
  const result = await db(table, `?select=id${filter}&limit=1`, { prefer: 'count=exact' });
  const match = result.headers.get('content-range')?.match(/\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

async function publicSitemap() {
  const [seo, pages] = await Promise.all([db('seo_settings', '?select=canonical_base_url&singleton=eq.true'), db('site_content', '?select=slug,updated_at&status=eq.published')]);
  const base = seo.data?.[0]?.canonical_base_url;
  if (!validCanonical(base)) throw Object.assign(new Error('Canonical site URL is not configured.'), { status: 503 });
  const urls = new Map([[base, new Date().toISOString()]]);
  for (const page of pages.data || []) if (safeSlug(page.slug)) urls.set(`${base}${page.slug === 'home' ? '' : `/${page.slug}`}`, page.updated_at);
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...urls].map(([loc, date]) => `<url><loc>${loc.replaceAll('&', '&amp;')}</loc><lastmod>${new Date(date || Date.now()).toISOString()}</lastmod></url>`).join('')}</urlset>`;
}

async function adminOperation(req, res, route) {
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (route === 'login' && req.method === 'POST') return adminLogin(req, res);
  if (route === 'mfa/enroll' && req.method === 'POST') return enroll(req, res);
  if (route === 'mfa/verify' && req.method === 'POST') return verifyMfa(req, res);
  if (route === 'mfa/status' && req.method === 'GET') { const pre=readPreauth(req); const factors=await supabaseAuth('factors',{token:pre.access_token}); return json(res,200,{next:pre.stage==='enroll'?'enroll-2fa':'verify-2fa',factorId:(factors.factors||[]).find(f=>f.factor_type==='totp'&&f.status==='verified')?.id||null}); }
  if (route === 'logout' && req.method === 'POST') { requireSameOrigin(req); const token = readSessionToken(req); const identity = await authUser(token).catch(() => null); await supabaseAuth('logout', { method: 'POST', token }).catch(() => {}); await audit(identity?.user || null, 'admin_logout', 'admin_session', 'success').catch(() => {}); clearSession(res); return json(res, 200, { ok: true }); }
  const user = await requireAdmin(req, res);
  if (route === 'session' && req.method === 'GET') return json(res, 200, { email: user.email, role: user.role, mfa: 'verified', environment: process.env.VERCEL_ENV || 'local', sessionMaxHours: 8, inactivityMinutes: 30 });
  if (route === 'overview' && req.method === 'GET') {
    const [content, drafts, faqs, ads, scripts, logs, latestPublished, sitemap] = await Promise.all([getCount('site_content', '&status=eq.published'), getCount('site_content', '&status=eq.draft'), getCount('faq_items', '&status=eq.published'), getCount('ad_placements'), getCount('script_integrations', '&enabled=eq.true'), db('audit_logs', '?select=event_type,actor_email,target,result,created_at&order=created_at.desc&limit=8'), db('site_content', '?select=slug,title,published_at&status=eq.published&order=published_at.desc&limit=1'), db('site_settings', '?select=value&key=eq.sitemap_last_generated_at&limit=1')]);
    return json(res, 200, { content, drafts, faqs, ads, scripts, recent: logs.data || [], lastPublished: latestPublished.data?.[0] || null, lastSitemap: sitemap.data?.[0]?.value || null, configured: true });
  }
  if (route === 'content' && req.method === 'GET') { const result = await db('site_content', '?select=*&order=updated_at.desc'); return json(res, 200, result.data); }
  if (route === 'content/revisions' && req.method === 'GET') { const result=await db('content_revisions','?select=id,entity_type,snapshot,created_at&entity_type=eq.page&order=created_at.desc&limit=30');return json(res,200,result.data); }
  if (route === 'content/restore' && req.method === 'POST') { requireSameOrigin(req);const b=await readBody(req);const result=await db('content_revisions',`?select=*&id=eq.${encodeURIComponent(b.revisionId)}&entity_type=eq.page&limit=1`);const old=result.data?.[0]?.snapshot;if(!old||!safeSlug(old.slug)||!text(old.title,180)||!text(old.body,30000)||!statusValue(old.status))return json(res,400,{error:'That page revision is invalid or unavailable.'});const current=await db('site_content',`?select=*&id=eq.${encodeURIComponent(old.id)}&limit=1`);if(current.data?.[0])await db('content_revisions','',{method:'POST',body:[{entity_type:'page',entity_id:old.id,snapshot:current.data[0],created_by:user.id}],prefer:'return=minimal'});await db('site_content','?on_conflict=id',{method:'POST',body:[{id:old.id,slug:old.slug,title:old.title,body:old.body,status:old.status,updated_by:user.id,published_at:old.published_at||null}],prefer:'resolution=merge-duplicates,return=minimal'});await audit(user,'content_revision_restored',`page:${old.slug}`);return json(res,200,{ok:true,slug:old.slug}); }
  if (route === 'content' && req.method === 'POST') {
    requireSameOrigin(req); const b = await readBody(req);
    if (!safeSlug(b.slug) || !text(b.title, 180) || !text(b.body, 30_000) || !statusValue(b.status)) return json(res, 400, { error: 'Check the slug, title, content, and publication status.' });
    const old = await db('site_content', `?select=*&${/^[0-9a-f-]{36}$/i.test(b.id||'')?`id=eq.${encodeURIComponent(b.id)}`:`slug=eq.${encodeURIComponent(b.slug)}`}&limit=1`);
    if (old.data?.[0]) await db('content_revisions', '', { method: 'POST', body: [{ entity_type: 'page', entity_id: old.data[0].id, snapshot: old.data[0], created_by: user.id }], prefer: 'return=minimal' });
    const values={ slug: b.slug, title: b.title.trim(), body: b.body, status: b.status, updated_by: user.id, ...(old.data?.[0]?{id:old.data[0].id}:{}), ...(b.status === 'published' ? { published_at: new Date().toISOString() } : {}) };
    const result = await db('site_content', `?on_conflict=${old.data?.[0]?'id':'slug'}`, { method: 'POST', body: [values], prefer: 'resolution=merge-duplicates,return=representation' });
    await audit(user, b.status === 'published' ? 'content_published' : 'content_saved', `page:${b.slug}`);
    return json(res, 200, result.data?.[0] || { ok: true });
  }
  if (route === 'faqs' && req.method === 'GET') { const result = await db('faq_items', '?select=*&order=display_order.asc,created_at.asc'); return json(res, 200, result.data); }
  if (route === 'faqs' && req.method === 'POST') {
    requireSameOrigin(req); const b = await readBody(req);
    if (b.action === 'delete') { if (!/^[0-9a-f-]{36}$/i.test(b.id) || b.confirm !== true) return json(res, 400, { error: 'Confirm deletion and provide a valid FAQ ID.' }); await db('faq_items', `?id=eq.${encodeURIComponent(b.id)}`, { method: 'DELETE' }); await audit(user, 'faq_deleted', `faq:${b.id}`); return json(res, 200, { ok: true }); }
    if (!text(b.question, 500) || !text(b.answer, 8000) || !Number.isInteger(b.display_order) || !statusValue(b.status) || (b.anchor && !safeSlug(b.anchor))) return json(res, 400, { error: 'Check FAQ text, order, anchor, and status.' });
    const values = { question: b.question.trim(), answer: b.answer, category: text(b.category || '', 80) ? b.category || null : null, display_order: b.display_order, status: b.status, anchor: b.anchor || null, updated_by: user.id, ...(b.id ? { id: b.id } : {}) };
    const result = await db('faq_items', '', { method: 'POST', body: [values], prefer: 'resolution=merge-duplicates,return=representation' }); await audit(user, b.status === 'published' ? 'faq_published' : 'faq_saved', `faq:${result.data?.[0]?.id || b.id || 'new'}`); return json(res, 200, result.data?.[0] || { ok: true });
  }
  if (route === 'seo' && req.method === 'GET') { const result = await db('seo_settings', '?select=*&singleton=eq.true'); return json(res, 200, result.data?.[0] || null); }
  if (route === 'seo' && req.method === 'PUT') { requireSameOrigin(req); const b = await readBody(req); if (!text(b.title, 70) || !text(b.description, 180) || !validCanonical(b.canonical_base_url) || !text(b.og_title, 70) || !text(b.og_description, 200) || (b.og_image && !/^https:\/\//i.test(b.og_image))) return json(res, 400, { error: 'SEO fields are invalid. Canonical URLs must use an HTTPS production domain.' }); const values = { singleton: true, title: b.title, description: b.description, canonical_base_url: b.canonical_base_url, og_title: b.og_title, og_description: b.og_description, og_image: b.og_image || null, noindex: b.noindex === true, updated_by: user.id }; await db('seo_settings', '', { method: 'POST', body: [values], prefer: 'resolution=merge-duplicates,return=minimal' }); await audit(user, 'seo_updated', 'seo_settings'); return json(res, 200, { ok: true }); }
  if (route === 'settings' && req.method === 'GET') { const result = await db('site_settings', '?select=key,value,updated_at&order=key.asc'); return json(res, 200, result.data); }
  if (route === 'settings' && req.method === 'PUT') { requireSameOrigin(req); const b = await readBody(req); if (!text(b.key, 60) || !['site_name', 'contact_email', 'footer_text', 'maintenance_notice'].includes(b.key) || !text(b.value, 2000)) return json(res, 400, { error: 'Unsupported site setting.' }); await db('site_settings', '', { method: 'POST', body: [{ key: b.key, value: b.value, updated_by: user.id }], prefer: 'resolution=merge-duplicates,return=minimal' }); await audit(user, 'site_setting_updated', `setting:${b.key}`); return json(res, 200, { ok: true }); }
  if (route === 'ads' && req.method === 'GET') { const [settings, placements] = await Promise.all([db('ad_settings', '?select=*'), db('ad_placements', '?select=*&order=placement.asc')]); return json(res, 200, { settings: settings.data?.[0] || null, placements: placements.data || [] }); }
  if (route === 'ads' && req.method === 'PUT') { requireSameOrigin(req); const b = await readBody(req); if (b.enabled && !/^ca-pub-\d{16}$/.test(b.publisher_id || '')) return json(res, 400, { error: 'Enter a valid AdSense publisher ID before enabling ads.' }); if (!Array.isArray(b.placements) || b.placements.length > 8 || b.placements.some(p => !['above_game', 'below_game', 'between_sections', 'near_footer'].includes(p.placement) || !text(p.name, 80) || (p.slot_id && !/^\d{6,20}$/.test(p.slot_id)))) return json(res, 400, { error: 'An ad placement is invalid.' }); await db('ad_settings', '', { method: 'POST', body: [{ singleton: true, enabled: b.enabled === true, publisher_id: b.publisher_id || null, updated_by: user.id }], prefer: 'resolution=merge-duplicates,return=minimal' }); for (const p of b.placements) await db('ad_placements', '', { method: 'POST', body: [{ placement: p.placement, name: p.name, slot_id: p.slot_id || null, enabled: p.enabled === true, updated_by: user.id }], prefer: 'resolution=merge-duplicates,return=minimal' }); await audit(user, 'ads_updated', 'ad_configuration', 'success', { enabled: b.enabled === true, placements: b.placements.length }); return json(res, 200, { ok: true }); }
  if (route === 'scripts' && req.method === 'GET') { const [result,revisions] = await Promise.all([db('script_integrations', '?select=*&order=created_at.desc'),db('script_revisions','?select=id,integration,created_at&order=created_at.desc&limit=20')]); return json(res, 200, {items:result.data,revisions:revisions.data}); }
  if (route === 'scripts/rollback' && req.method === 'POST') { requireSameOrigin(req); const b=await readBody(req); const revision=await db('script_revisions',`?select=*&id=eq.${encodeURIComponent(b.revisionId)}&limit=1`); const old=revision.data?.[0]; if(!old||!['google_adsense','google_site_verification'].includes(old.integration))return json(res,400,{error:'That integration revision is unavailable.'}); const current=await db('script_integrations',`?select=*&integration=eq.${old.integration}&limit=1`); if(current.data?.[0])await db('script_revisions','',{method:'POST',body:[{integration:old.integration,snapshot:current.data[0],created_by:user.id}],prefer:'return=minimal'}); const s=old.snapshot; await db('script_integrations','?on_conflict=integration',{method:'POST',body:[{integration:old.integration,purpose:s.purpose,placement:s.placement,config:s.config,enabled:s.enabled,environment:s.environment,updated_by:user.id}],prefer:'resolution=merge-duplicates,return=minimal'}); await audit(user,'script_configuration_restored',`integration:${old.integration}`); return json(res,200,{ok:true,integration:old.integration}); }
  if (route === 'scripts' && req.method === 'PUT') { requireSameOrigin(req); const b = await readBody(req); if (!['google_adsense', 'google_site_verification'].includes(b.integration) || b.placement !== 'head') return json(res, 400, { error: 'Only approved integrations in their supported document-head placement are accepted.' }); if (b.integration === 'google_adsense' && !/^ca-pub-\d{16}$/.test(b.config?.publisher_id || '')) return json(res, 400, { error: 'AdSense requires a valid publisher ID.' }); if (b.integration === 'google_site_verification' && !/^[A-Za-z0-9_-]{20,128}$/.test(b.config?.verification_token || '')) return json(res, 400, { error: 'Verification token has an invalid format.' }); if (b.environment === 'production' && b.enabled && b.confirmProduction !== true) return json(res, 400, { error: 'Confirm production activation explicitly.' }); const old = await db('script_integrations', `?select=*&integration=eq.${b.integration}&limit=1`); if (old.data?.[0]) await db('script_revisions', '', { method: 'POST', body: [{ integration: b.integration, snapshot: old.data[0], created_by: user.id }], prefer: 'return=minimal' }); await db('script_integrations', '', { method: 'POST', body: [{ integration: b.integration, purpose: b.integration === 'google_adsense' ? 'Ad serving' : 'Search Console ownership verification', placement: b.placement, config: b.config, enabled: b.enabled === true, environment: ['preview', 'production'].includes(b.environment) ? b.environment : 'preview', updated_by: user.id }], prefer: 'resolution=merge-duplicates,return=minimal' }); await audit(user, 'script_configuration_updated', `integration:${b.integration}`, 'success', { enabled: b.enabled === true, environment: b.environment }); return json(res, 200, { ok: true }); }
  if (route === 'logs' && req.method === 'GET') { const params = new URL(req.url, 'https://local.invalid').searchParams; const limit = Math.max(1, Math.min(100, Number(params.get('limit')) || 50)); const offset = Math.max(0, Math.min(100_000, Number(params.get('offset')) || 0)); let query = `?select=id,event_type,actor_email,target,result,metadata,created_at&order=created_at.desc&limit=${limit}&offset=${offset}`; const type = params.get('event_type') || ''; const resultFilter = params.get('result') || ''; const from = params.get('from') || ''; const to = params.get('to') || ''; if (type && /^[a-z0-9_]{1,100}$/.test(type)) query += `&event_type=eq.${encodeURIComponent(type)}`; if (['success','warning','failure'].includes(resultFilter)) query += `&result=eq.${resultFilter}`; if (from && !Number.isNaN(Date.parse(from))) query += `&created_at=gte.${encodeURIComponent(new Date(from).toISOString())}`; if (to && !Number.isNaN(Date.parse(to))) query += `&created_at=lte.${encodeURIComponent(new Date(to).toISOString())}`; const result = await db('audit_logs', query); return json(res, 200, { items: result.data || [], offset, limit, hasMore: (result.data || []).length === limit }); }
  if (route === 'security' && req.method === 'GET') { const token = readSessionToken(req); const factors = await supabaseAuth('factors', { token }).catch(() => ({ factors: [] })); return json(res, 200, { mfa: 'verified', factors: (factors.factors || []).map(f => ({ type: f.factor_type, status: f.status, friendly_name: f.friendly_name })), sessions: { current: true, expires: '8 hours maximum; 30 minutes idle' } }); }
  if (route === 'maintenance/health' && req.method === 'GET') { const present = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'].filter(name => Boolean(process.env[name])); const [faqCount, contentCount] = await Promise.all([getCount('faq_items'), getCount('site_content')]); return json(res, 200, { status: 'healthy', checked_at: new Date().toISOString(), database: 'connected', environment: { present, missing: ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'].filter(name => !process.env[name]) }, faqCount, contentCount }); }
  if (route === 'maintenance/sitemap' && req.method === 'POST') { requireSameOrigin(req); const xml = await publicSitemap(); await db('site_settings', '', { method: 'POST', body: [{ key: 'sitemap_last_generated_at', value: new Date().toISOString(), updated_by: user.id }], prefer: 'resolution=merge-duplicates,return=minimal' }); await audit(user, 'sitemap_generated', '/sitemap.xml'); return json(res, 200, { ok: true, path: '/sitemap.xml', urls: (xml.match(/<url>/g) || []).length, validated: xml.startsWith('<?xml') && xml.endsWith('</urlset>'), generatedAt: new Date().toISOString() }); }
  if (route === 'maintenance/backup' && req.method === 'GET') { const [content, faqs, seo, settings, ads, placements, scripts] = await Promise.all([db('site_content', '?select=slug,title,body,status,updated_at'), db('faq_items', '?select=question,answer,category,display_order,status,anchor'), db('seo_settings', '?select=singleton,title,description,canonical_base_url,og_title,og_description,og_image,noindex'), db('site_settings', '?select=key,value'), db('ad_settings', '?select=singleton,enabled,publisher_id'), db('ad_placements', '?select=placement,name,slot_id,enabled'), db('script_integrations', '?select=integration,purpose,placement,enabled,environment')]); const backup = { schemaVersion: 1, exportedAt: new Date().toISOString(), content: content.data, faqs: faqs.data, seo: seo.data, settings: settings.data, ads: ads.data, placements: placements.data, scripts: scripts.data }; await audit(user, 'configuration_exported', 'safe_configuration_backup'); res.setHeader('Content-Disposition', 'attachment; filename="rooftop-drive-config-backup.json"'); return json(res, 200, backup); }
  if (route === 'maintenance/validate' && req.method === 'POST') { requireSameOrigin(req); const b = await readBody(req); const result = b.target === 'faqs' ? await db('faq_items', '?select=id,question,answer,status') : b.target === 'metadata' ? await db('seo_settings', '?select=singleton,title,description,canonical_base_url') : null; if (!result) return json(res, 400, { error: 'Choose FAQs or metadata to validate.' }); const issues = b.target === 'faqs' ? result.data.filter(row => !row.question?.trim() || !row.answer?.trim()).length : result.data.filter(row => !validCanonical(row.canonical_base_url) || !row.title || !row.description).length; await audit(user, 'configuration_validated', b.target, issues ? 'warning' : 'success', { issues }); return json(res, 200, { ok: issues === 0, target: b.target, checked: result.data.length, issues, checkedAt: new Date().toISOString() }); }
  return json(res, 404, { error: 'Admin operation not found.' });
}

export default async function handler(req, res) {
  try { await adminOperation(req, res, pathOf(req)); }
  catch (error) { if (error.status === 401 || error.status === 403) clearSession(res); json(res, error.status || 500, { error: error.status ? error.message : 'The admin operation failed safely.' }); }
}
