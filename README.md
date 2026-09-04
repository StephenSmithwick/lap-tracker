# Lap Tracker
This is a simple lap tracking app that consists of 2 tables

This project has been developped using pnpm to get started developing

- Install depedencies: `pnpm install` 
- Run a local dev instance: `pnpm dev`
- Deploy to cloudflare: `pnpm run deploy`

## Database
Postgres neon production db connection string is set in DATABASE_URL.  This string contains secrets do not commit to git.

Details can be fetched from the [neon console](https://console.neon.tech/app/projects/green-star-08181756) 
`DATABASE_URL` can be found by pressing the `Connect` button at the top.

## Cloudflare
We use cloudflare bindings to store secrets in the cloud.  Use wrangler to put secrets there that match the `.env` file.

- Add a secret - `pnpm exec wrangler secret put DATABASE_URL`
- Generate types - `pnpm exec wrangler types --env-interface CloudflareBindings`
- Deploy - `pnpm run deploy`
