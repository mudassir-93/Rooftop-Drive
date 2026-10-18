# Run and deploy

## Local development

1. Install Node.js 20.19+ or 22.12+.
2. Run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite. This serves the game and admin UI shell; Vite does not run the Vercel API functions.
4. Run `npm run build` to create the production bundle in `dist/`.
5. Run `npm run preview` to inspect that bundle locally.

For local admin API integration testing, configure a dedicated Supabase test project and use `npx vercel dev` with local environment variables. See [ADMIN_SETUP.md](ADMIN_SETUP.md) for migration, Auth, admin provisioning, security, CMS, advertising, and environment setup.

## Vercel

Import the project into Vercel using the Vite preset, `npm run build`, and `dist`. The root `api/` directory is served as Vercel Functions. Configure `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, and `APP_ORIGIN` as server-side environment variables for Preview and Production separately. The server accepts the legacy `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` names as a migration fallback. Never use `VITE_*` for the secret key. Deploy a preview first and verify the game and API flows against a separate test database before enabling production access.
