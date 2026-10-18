# Project status

## Initial inspection

The repository contained only `prompt.md`; there was no application framework, source code, package manifest, test setup, deployment configuration, or existing project documentation. Node.js 24 and npm 12 are available.

## Architecture decisions

- Vite serves a small browser application using Three.js directly. This avoids adding a UI framework to an empty repository and keeps the game loop easy to inspect.
- The scene, player vehicle, road, skyline, obstacles, and energy pickups are generated from local geometry. No remote 3D assets or game backend are required.
- The arcade loop tracks forward distance and speed, moves reusable road and entity objects, supports continuous lane steering and a short speed boost, detects obstacle/energy collisions, and persists the personal best in local storage.
- Menus, pause, restart, keyboard controls, and pointer-based mobile controls are HTML/CSS around the WebGL scene.

## Implemented

- Original dark rooftop night-run interface and procedural 3D environment.
- Three-lane steering, continuously advancing road, road barriers, energy pickups, boost, collision/game over, score and best score, pause/resume/restart/menu transitions.
- Current iteration adds a spendable boost battery, refill from energy pickups, a jump arc, jumpable roof gaps with a clearance bonus, and matching keyboard/touch controls.
- Keyboard and touch controls, mute toggle with pickup chime, responsive layout, reduced-motion CSS, metadata and accessible control descriptions.
- Vercel static deployment configuration and local run/build/deploy guide.

## Secure admin/CMS extension

- Preserved the public driving game and added a separate responsive `/admin/*` control center with login, mandatory TOTP enrollment/verification, server-checked admin role, overview, content, FAQs, ads, approved integrations, SEO/sitemap, settings, maintenance, security, and audit screens.
- Added Vercel server functions with HTTP-only cookie sessions, origin-checked writes, explicit admin role checks, generic credential errors, provider Auth MFA assurance checks, input validation, and audit events. Admin service-role access is server-only; public routes use anon/publishable access and RLS.
- Added the Supabase migration `supabase/migrations/20261018223030_admin_cms.sql` for admin roles, page CMS and revisions, FAQs, site/SEO/ad settings, approved script integrations and revisions, and private audit logs. Public RLS policies expose only published FAQ/pages and safe enabled production settings.
- Added public CMS page rendering with text-only output, published FAQ display, robots/sitemap routes, ad consent opt-in, and a script registry limited to AdSense and Search Console verification. Arbitrary JavaScript execution is intentionally unsupported.
- Added one-time verified-admin provisioning at `scripts/provision-admin.mjs`, environment template `.env.example`, and setup guidance in `docs/ADMIN_SETUP.md`.
- External Supabase project credentials are not present in this workspace. Migration deployment, account provisioning, real login/MFA/RLS tests, and Vercel end-to-end verification remain pending until a project is connected. Vite alone does not run Vercel functions. The in-memory extra login throttle is best-effort on serverless; production should also use provider/firewall limits.
- Public metadata is injected client-side because this is a Vite SPA; crawlers that do not execute JavaScript may not see page-specific CMS metadata. Use prerendering or SSR if per-page search indexing becomes a firm requirement.
- Verification for this extension: `npm run build` succeeds; `node --check` succeeds for the frontend/API/provisioning JavaScript files; focused API smoke checks confirm a missing admin session is denied, cross-origin/missing-origin login is rejected, and invalid public slugs are rejected. Browser inspection confirms `/admin` fails closed when Vite is serving without Vercel functions and that the existing public game shell still loads. No Supabase database/Auth integration or deployment test could run because there is no connected project or credential set.
- The Supabase CLI is not installed and npm registry access failed with an operating-system `EACCES` network error in this environment. The migration file was generated through the CLI earlier in the work session, but it has not been applied or tested against Postgres. Docker is installed; no local Supabase stack was created.

## Gameplay and scoring

Distance increases at 0.63 points per in-game meter of travel; each energy cell adds 250 points and restores 35% battery. Clearing a gap with a jump adds 150 points. Speed rises with distance up to the normal cap; holding Shift or the touch boost button spends battery for more speed. Barriers end a run on contact. Use arrows/A-D to steer, Space/Up/W to jump, and Escape/P to pause.

## Verification status

- `npm install` completed and generated `package-lock.json`.
- `npm run build` completed successfully with Vite 7.3.7.
- Started the Vite development server and opened the app in the browser. Verified the Three.js scene, Start, sustained right steering, Escape pause, resume, pause-menu restart, automatic barrier collision/game over, restart/menu controls, score reset, and a saved personal best visible after reload.
- In the updated build, verified the battery meter drops while holding boost and Space triggers a visible jump. The game builds cleanly after these changes.
- A WebGL-unavailable Canvas gameplay fallback is not implemented; the game displays a rendering-unavailable message instead. Browser coverage here was a desktop browser, not physical mobile hardware. No deployment was performed.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) and [ADMIN_SETUP.md](ADMIN_SETUP.md) for local/Vercel, Supabase, administrator provisioning, and configuration instructions. No live project credentials or publisher identifiers are committed.
