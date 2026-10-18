import { config, json } from '../_lib/admin.js';

export default async function handler(req, res) {
  try {
    const slug = new URL(req.url, 'https://local.invalid').searchParams.get('slug') || '';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || ['admin','api','sitemap','robots'].includes(slug)) return json(res, 400, { error: 'Invalid page address.' });
    const c = config(false);
    const response = await fetch(`${c.url}/rest/v1/site_content?select=slug,title,body,updated_at&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`, {
      headers: { apikey: c.anon }
    });
    if (!response.ok) return json(res, 503, { unavailable: true });
    const page = (await response.json())[0];
    if (!page) return json(res, 404, { error: 'Page not found.' });
    return json(res, 200, page);
  } catch { return json(res, 503, { unavailable: true }); }
}
