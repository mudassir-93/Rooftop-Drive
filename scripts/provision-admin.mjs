const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const targetEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const missing = [
  ...(!url ? ['SUPABASE_URL'] : []),
  ...(!key ? ['SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY)'] : []),
  ...(!targetEmail ? ['ADMIN_EMAIL'] : [])
];
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const base = url.replace(/\/$/, '');
const headers = { apikey: key, 'Content-Type': 'application/json' };
let target = null;

for (let page = 1; page <= 100; page += 1) {
  const response = await fetch(`${base}/auth/v1/admin/users?page=${page}&per_page=1000`, { headers });
  if (!response.ok) throw new Error(`Unable to list Auth users (${response.status}). Check the server-side project URL and secret key.`);
  const data = await response.json();
  const users = data.users || [];
  target = users.find(user => user.email?.toLowerCase() === targetEmail) || null;
  if (target || users.length < 1000) break;
}

if (!target) throw new Error('No Auth user matches ADMIN_EMAIL. Create the account through the trusted Supabase Auth workflow, confirm its email, then run this script again.');
if (!target.email_confirmed_at) throw new Error('The target Auth account is not email-verified. Verify ownership through Supabase Auth before provisioning.');

const existing = await fetch(`${base}/rest/v1/admin_profiles?select=user_id&user_id=eq.${encodeURIComponent(target.id)}&limit=1`, { headers });
if (!existing.ok) throw new Error(`Unable to check administrator provisioning (${existing.status}). Apply the database migration first.`);
if ((await existing.json()).length) {
  console.log(`Administrator role is already provisioned for ${targetEmail}; no change made.`);
  process.exit(0);
}

const response = await fetch(`${base}/rest/v1/admin_profiles`, {
  method: 'POST',
  headers: { ...headers, Prefer: 'return=minimal' },
  body: JSON.stringify({ user_id: target.id, role: 'admin' })
});
if (!response.ok) throw new Error(`Administrator provisioning failed (${response.status}). No browser-controlled promotion path exists.`);
console.log(`Provisioned verified administrator ${targetEmail}. Enroll TOTP on the first sign-in.`);
