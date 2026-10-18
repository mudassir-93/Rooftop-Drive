import { config, json } from '../_lib/admin.js';

export default async function handler(_req, res) {
  try {
    const c = config(false);
    const [response, scripts] = await Promise.all([
      fetch(`${c.url}/rest/v1/seo_settings?select=title,description,canonical_base_url,og_title,og_description,og_image,noindex&singleton=eq.true`, { headers: { apikey: c.anon } }),
      fetch(`${c.url}/rest/v1/script_integrations?select=integration,config&integration=eq.google_site_verification&enabled=eq.true&environment=eq.production&limit=1`, { headers: { apikey: c.anon } })
    ]);
    if (!response.ok) return json(res, 503, { unavailable: true });
    const settings = (await response.json())[0] || null;
    const verification = scripts.ok ? (await scripts.json())[0]?.config?.verification_token : null;
    return json(res, 200, { settings, verificationToken: /^[A-Za-z0-9_-]{20,128}$/.test(verification||'') ? verification : null });
  } catch { return json(res, 503, { unavailable: true }); }
}
