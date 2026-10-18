# Rooftop Drive

Rooftop Drive is an endless rooftop driving game built with Three.js and Vite. Steer through a procedural night city, collect energy, jump roof gaps, and use stored charge to boost. The repository also includes a separate admin/CMS interface and Vercel API functions.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Build the static frontend with `npm run build` and inspect it with `npm run preview`. The game runs without a backend. Vite serves the admin interface shell, but it does not run the Vercel API functions.

## Admin backend setup

The CMS backend requires a connected Supabase project. Before it can work, configure the server-side environment variables, apply the migration in `supabase/migrations/`, configure Supabase Auth and MFA, and provision a verified administrator. The service-role key must remain server-only and must never use a `VITE_` variable. Follow [Admin setup](docs/ADMIN_SETUP.md) and [Deployment](docs/DEPLOYMENT.md).

Real authentication, database/RLS behavior, and Vercel deployment have not been verified in this workspace. Do not treat the admin backend as configured until those external setup steps and test-project checks are complete.

## Project status

See [Project status](docs/PROJECT_STATUS.md) for implemented gameplay, architecture, verification history, and known limitations. GitHub Actions builds the frontend and checks JavaScript syntax on pushes and pull requests.
