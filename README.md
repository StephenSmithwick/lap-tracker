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
- [public](https://laps.victorpass.dev)
- [workers](https://laps.victorpass.workers.dev)
- [all deployments](https://dash.cloudflare.com/0c855cdf521de8fed5ad5d3ac1c22763/workers/services/view/laps/production/deployments)

- Deploy - `pnpm run deploy`

### Cloudflare Bindings Secrets

We use cloudflare bindings to store secrets in the cloud.  Use wrangler to put secrets there that match the `.env` file. For a new cloudflare worker environment you must add the necesary secrets.

To upload them in bulk the easiest way is to add them all from the .env file:
`npx wrangler secret bulk .env`

To add a single new secret: `npx wrangler secret put ENV_VARIABLE`

(see `.dev.vars.example` for all secrets used by the app)

### Updating Cloudflare Bindings types
To re-generate typescript types for cloudflare bindings:

```txt
pnpm run cf-typegen
```

## Auth

We authenticate via google auth
Locally, authentication will not run by default.  To use google authenticator please set the`GOOGLE_ID` and `GOOGLE_SECRET` from the [google auth console](https://console.cloud.google.com/auth/clients?authuser=2&orgonly=true&project=laps-509419)
