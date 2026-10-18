import { config } from './_lib/admin.js';

export default async function handler(_req, res) {
  const lines = ['User-agent: *', 'Disallow: /admin', 'Disallow: /api/'];
  try {
    const c = config(false);
    const response = await fetch(`${c.url}/rest/v1/seo_settings?select=canonical_base_url,noindex&singleton=eq.true`, { headers: { apikey: c.anon } });
    if (response.ok) {
      const settings = (await response.json())[0];
      if (settings && !settings.noindex && /^https:\/\//.test(settings.canonical_base_url || '')) lines.push(`Sitemap: ${settings.canonical_base_url}sitemap.xml`);
    }
  } catch {}
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  return res.end(`${lines.join('\n')}\n`);
}
