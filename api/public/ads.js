import { config, json } from '../_lib/admin.js';

export default async function handler(_req, res) {
  try {
    const c = config(false);
    const [settings, placements, integration] = await Promise.all([
      fetch(`${c.url}/rest/v1/ad_settings?select=enabled,publisher_id&singleton=eq.true&enabled=eq.true&limit=1`, { headers: { apikey: c.anon, Authorization: `Bearer ${c.anon}` } }),
      fetch(`${c.url}/rest/v1/ad_placements?select=placement,name,slot_id,enabled&enabled=eq.true`, { headers: { apikey: c.anon, Authorization: `Bearer ${c.anon}` } }),
      fetch(`${c.url}/rest/v1/script_integrations?select=integration,config&integration=eq.google_adsense&enabled=eq.true&environment=eq.production&limit=1`, { headers: { apikey: c.anon, Authorization: `Bearer ${c.anon}` } })
    ]);
    if (!settings.ok || !placements.ok || !integration.ok) return json(res, 503, { enabled: false, placements: [] });
    const setting = (await settings.json())[0];
    const approvedIntegration = (await integration.json())[0];
    if (!setting || !approvedIntegration || !/^ca-pub-\d{16}$/.test(setting.publisher_id || '') || approvedIntegration.config?.publisher_id !== setting.publisher_id) return json(res, 200, { enabled: false, placements: [] });
    const safePlacements = (await placements.json()).filter(p => /^\d{6,20}$/.test(p.slot_id || '') && ['above_game','below_game','between_sections','near_footer'].includes(p.placement));
    return json(res, 200, { enabled: true, publisherId: setting.publisher_id, placements: safePlacements });
  } catch { return json(res, 503, { enabled: false, placements: [] }); }
}
