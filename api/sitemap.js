import { config } from './_lib/admin.js';

const validBase = value => { try { const u = new URL(value); return u.protocol === 'https:' && !u.hostname.endsWith('.vercel.app') && u.pathname === '/' && !u.search && !u.hash; } catch { return false; } };

export default async function handler(_req, res) {
  try {
    const c = config(false);
    const [seoRes, contentRes] = await Promise.all([
      fetch(`${c.url}/rest/v1/seo_settings?select=canonical_base_url,noindex&singleton=eq.true`, { headers: { apikey: c.anon, Authorization: `Bearer ${c.anon}` } }),
      fetch(`${c.url}/rest/v1/site_content?select=slug,updated_at&status=eq.published`, { headers: { apikey: c.anon, Authorization: `Bearer ${c.anon}` } })
    ]);
    if (!seoRes.ok || !contentRes.ok) throw new Error('Sitemap source data is unavailable.');
    const seo = (await seoRes.json())[0], pages = await contentRes.json();
    if (seo?.noindex || !validBase(seo?.canonical_base_url)) throw new Error('Production canonical URL is not configured.');
    const base = seo.canonical_base_url, urls = new Map([[base, new Date().toISOString()]]);
    for (const page of pages) if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug)) urls.set(`${base}${page.slug === 'home' ? '' : `/${page.slug}`}`, page.updated_at);
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...urls].map(([loc, date]) => `<url><loc>${loc.replaceAll('&', '&amp;')}</loc><lastmod>${new Date(date || Date.now()).toISOString()}</lastmod></url>`).join('')}</urlset>`;
    res.statusCode = 200; res.setHeader('Content-Type', 'application/xml; charset=utf-8'); res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300'); return res.end(xml);
  } catch { res.statusCode = 503; res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); return res.end('Sitemap is temporarily unavailable until production SEO settings are configured.'); }
}
