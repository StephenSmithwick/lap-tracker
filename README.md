# Lap Tracker

To get started:
- Install depedencies: `pnpm install` 
- Run a local dev instance: `pnpm dev`
- Deploy to cloudflare: `pnpm run deploy`

## Database
Postgres neon production db connection string is set in DATABASE_URL. Please review env.example and grab connection Details from the [neon console](https://console.neon.tech/app/projects/green-star-08181756) 

Common tasks:
- generate migration files: `npx drizzle-kit generate`
- migrate database: `npx drizzle-kit migrate`
- view database: `npx drizzle-kit studio`

## Cloudflare
We use cloudflare bindings to store secrets in the cloud.  Use wrangler to put secrets there that match the `.env` file.

- Add a secret - `pnpm exec wrangler secret put DATABASE_URL`
- Generate types - `pnpm exec wrangler types --env-interface CloudflareBindings`
- Deploy - `pnpm run deploy`
