import { createHmac, timingSafeEqual } from 'node:crypto';

const cookieNames = { access: 'rd_admin_access', refresh: 'rd_admin_refresh', started: 'rd_admin_started', idle: 'rd_admin_idle', stage: 'rd_admin_stage' };
const authAttempts = new Map();

export function config(requireService = true) {
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || (requireService && !service)) throw Object.assign(new Error('Admin backend is not configured.'), { status: 503 });
  return { url: url.replace(/\/$/, ''), anon, service };
}

export function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(payload));
}

export function readBody(req, max = 100_000) {
  return new Promise((resolve, reject) => {
    let body = '', size = 0;
    req.on('data', chunk => { size += chunk.length; if (size > max) { reject(Object.assign(new Error('Request is too large.'), { status: 413 })); req.destroy(); return; } body += chunk; });
    req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(Object.assign(new Error('Request body must be valid JSON.'), { status: 400 })); } });
    req.on('error', reject);
  });
}

export function requireSameOrigin(req) {
  const origin = req.headers.origin;
  const configured = process.env.APP_ORIGIN?.trim();
  const production = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  if (production && !configured) throw Object.assign(new Error('Admin origin is not configured.'), { status: 503 });
  const expected = configured ? configured.replace(/\/$/, '') : `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
  if (!origin || origin.replace(/\/$/, '') !== expected) throw Object.assign(new Error('Request origin rejected.'), { status: 403 });
}

function cookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map(v => v.trim()).filter(Boolean).map(v => { const at = v.indexOf('='); let value = v.slice(at + 1); try { value = decodeURIComponent(value); } catch { value = ''; } return [v.slice(0, at), value]; }));
}

function setCookie(res, name, value, maxAge) {
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const item = `${name}=${encodeURIComponent(value)}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
  const existing = res.getHeader('Set-Cookie');
  res.setHeader('Set-Cookie', [...(Array.isArray(existing) ? existing : existing ? [existing] : []), item]);
}

export function clearSession(res) {
  for (const name of Object.values(cookieNames)) setCookie(res, name, '', 0);
}

function tokenClaims(token) {
  try { return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8')); } catch { return {}; }
}

function sessionSigningKey() {
  const key = config().service;
  if (!key) throw Object.assign(new Error('Admin backend is not configured.'), { status: 503 });
  return key;
}

function encodeSessionStart(timestamp) {
  const value = String(timestamp);
  const signature = createHmac('sha256', sessionSigningKey()).update(value).digest('base64url');
  return `${value}.${signature}`;
}

function decodeSessionStart(value) {
  const [timestamp, signature] = String(value || '').split('.');
  if (!/^\d{13}$/.test(timestamp || '') || !signature) return NaN;
  const expected = createHmac('sha256', sessionSigningKey()).update(timestamp).digest();
  let provided;
  try { provided = Buffer.from(signature, 'base64url'); } catch { return NaN; }
  return provided.length === expected.length && timingSafeEqual(provided, expected) ? Number(timestamp) : NaN;
}

async function authRequest(path, { method = 'GET', body, token, anon } = {}) {
  const c = config();
  const response = await fetch(`${c.url}/auth/v1/${path}`, { method, headers: { apikey: anon || c.anon, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.msg || data.message || 'Authentication request failed.'), { status: response.status, authError: true });
  return data;
}

export async function authUser(token) {
  const user = await authRequest('user', { token });
  const claims = tokenClaims(token);
  return { user, claims };
}

async function refreshSession(refreshToken) {
  const c = config();
  const response = await fetch(`${c.url}/auth/v1/token?grant_type=refresh_token`, { method: 'POST', headers: { apikey: c.anon, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: refreshToken }) });
  const session = await response.json().catch(() => ({}));
  return response.ok ? session : null;
}

function setSessionCookies(res, session, stage = 'admin', preserveStarted = false) {
  setCookie(res, cookieNames.access, session.access_token, 1800);
  setCookie(res, cookieNames.refresh, session.refresh_token, 1800);
  setCookie(res, cookieNames.idle, encodeSessionStart(Date.now()), 1800);
  setCookie(res, cookieNames.stage, stage, 1800);
  if (!preserveStarted) setCookie(res, cookieNames.started, encodeSessionStart(Date.now()), 28800);
}

async function dbRequest(table, query = '', { method = 'GET', body, prefer, service = true } = {}) {
  const c = config(), key = service ? c.service : c.anon;
  const response = await fetch(`${c.url}/rest/v1/${table}${query}`, { method, headers: { apikey: key, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}), ...(method !== 'GET' ? { 'Accept-Profile': 'public', 'Content-Profile': 'public' } : {}) }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  const raw = await response.text();
  if (!response.ok) throw Object.assign(new Error(`Database request failed (${response.status}).`), { status: 502, detail: raw.slice(0, 500) });
  return { data: raw ? JSON.parse(raw) : null, headers: response.headers };
}

export async function audit(user, event, target, result = 'success', metadata = {}) {
  const safe = JSON.parse(JSON.stringify(metadata));
  await dbRequest('audit_logs', '', { method: 'POST', body: [{ actor_id: user?.id || null, actor_email: user?.email || null, event_type: event, target, result, metadata: safe }], prefer: 'return=minimal' });
}

export async function requireAdmin(req, res) {
  const c = config(), jar = cookies(req);
  if (jar[cookieNames.stage] !== 'admin' || !jar[cookieNames.access] || !jar[cookieNames.refresh] || !jar[cookieNames.started]) throw Object.assign(new Error('Admin authentication required.'), { status: 401 });
  const now = Date.now();
  const startedAt = decodeSessionStart(jar[cookieNames.started]);
  const lastActivityAt = decodeSessionStart(jar[cookieNames.idle]);
  if (!Number.isFinite(startedAt) || now - startedAt > 8 * 60 * 60 * 1000 || startedAt > now ||
      !Number.isFinite(lastActivityAt) || now - lastActivityAt > 30 * 60 * 1000 || lastActivityAt > now) {
    throw Object.assign(new Error('Admin session expired.'), { status: 401 });
  }
  let session = { access_token: jar[cookieNames.access], refresh_token: jar[cookieNames.refresh] };
  let identity;
  try { identity = await authUser(session.access_token); }
  catch { session = await refreshSession(session.refresh_token); if (!session) throw Object.assign(new Error('Admin session expired.'), { status: 401 }); identity = await authUser(session.access_token); }
  if (identity.claims.aal !== 'aal2' || !identity.user.email_confirmed_at) throw Object.assign(new Error('A verified second factor is required.'), { status: 403 });
  const profile = await dbRequest('admin_profiles', `?select=user_id,role&user_id=eq.${encodeURIComponent(identity.user.id)}&role=eq.admin&limit=1`);
  if (!profile.data?.length) throw Object.assign(new Error('Administrator access is not provisioned.'), { status: 403 });
  setSessionCookies(res, session, 'admin', true);
  setCookie(res, cookieNames.started, jar[cookieNames.started], Math.max(1, 28800 - Math.floor((Date.now() - startedAt) / 1000)));
  return { ...identity.user, role: 'admin' };
}

export function readPreauth(req) {
  const jar = cookies(req);
  if (!['verify', 'enroll'].includes(jar[cookieNames.stage]) || !jar[cookieNames.access] || !jar[cookieNames.refresh]) throw Object.assign(new Error('Sign-in step expired. Please try again.'), { status: 401 });
  return { access_token: jar[cookieNames.access], refresh_token: jar[cookieNames.refresh], stage: jar[cookieNames.stage] };
}

export function readSessionToken(req) {
  const jar = cookies(req);
  if (!['verify', 'enroll', 'admin'].includes(jar[cookieNames.stage]) || !jar[cookieNames.access]) throw Object.assign(new Error('Admin session required.'), { status: 401 });
  return jar[cookieNames.access];
}

export async function supabaseAuth(path, options) { return authRequest(path, options); }
export async function db(table, query, options) { return dbRequest(table, query, options); }

export function allowLoginAttempt(req) {
  const ip = (req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
  const now = Date.now(), current = authAttempts.get(ip) || { count: 0, since: now };
  if (now - current.since > 10 * 60 * 1000) { current.count = 0; current.since = now; }
  current.count += 1; authAttempts.set(ip, current);
  if (authAttempts.size > 10_000) for (const [key, value] of authAttempts) if (now - value.since > 10 * 60 * 1000) authAttempts.delete(key);
  if (current.count > 8) throw Object.assign(new Error('Too many attempts. Wait a few minutes and try again.'), { status: 429 });
}

export function beginLogin(res, session, stage) { setSessionCookies(res, session, stage, false); }
export function finishMfa(res, session) { setSessionCookies(res, session, 'admin', false); }
