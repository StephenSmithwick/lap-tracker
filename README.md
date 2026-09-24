# Lap Tracker
Allows a team of users to manage a race where each racer has a QR code scanned each lap.

## App Interface

The app will have several common components which will be reused in the pages below:

Pages:
1. **Scan/Create Race** - If no race is selected (e.g. first login) you're directed here to scan a race QR code or create a race. The page is primarily a large camera display for scanning a Race QR Code and a solid select or create race dropdown (see Show Race QR Code). If a race QR code is scanned it's added to the user's associated races and becomes their selected race.
2. **Show Race QR Code** - If you have access to a race you can display its QR code for others to scan. This is the primary permission model for letting others scan racers into your race.  This page consists primarily of a large QR code with a select or create race dropdown.
3. **Scan Racer QR Code** - The default page. Shows a large camera view. Includes a select box to choose or create another race, and a button to navigate to the Show Race QR Code page. Scanning a racer's QR code shows a popup with the racer and their calculated lap count, and adds them to the race.
4. **Race Summary** - Shows every racer in the race, how many laps we think they've completed, and when. Lap timestamps can be compared against a minimum lap time (a column not yet added to the db, likely configurable from this page) to flag duplicate scans. Also allows kicking off a CSV download of the raw lap details for the selected race.


## Development

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

(see `example.env` for all secrets used by the app)

### Updating Cloudflare Bindings types
To re-generate typescript types for cloudflare bindings:

```txt
pnpm run cf-typegen
```

## Auth

We authenticate via google auth
Locally, authentication will not run by default.  To use google authenticator please set the`GOOGLE_ID` and `GOOGLE_SECRET` from the [google auth console](https://console.cloud.google.com/auth/clients?authuser=2&orgonly=true&project=laps-509419)
