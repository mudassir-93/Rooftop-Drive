import { config, json } from '../_lib/admin.js';

export default async function handler(_req, res) {
  try {
    const c = config(false);
    const response = await fetch(`${c.url}/rest/v1/faq_items?select=id,question,answer,category,display_order,anchor&status=eq.published&order=display_order.asc`, { headers: { apikey: c.anon } });
    if (!response.ok) return json(res, 503, { unavailable: true, items: [] });
    return json(res, 200, { items: await response.json() });
  } catch { return json(res, 503, { unavailable: true, items: [] }); }
}
