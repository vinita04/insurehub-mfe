# Vercel Deployment

This project should be deployed as three separate Vercel projects:

1. `policy-mfe`
2. `payment-mfe`
3. `container`

Deploy the two remote MFEs first, then deploy the Container with their published `remoteEntry.js` URLs.

## Recommended Project Names

Use these Vercel project names to keep the URLs predictable:

1. `insurehub-policy-mfe`
2. `insurehub-payment-mfe`
3. `insurehub-container`

Expected default domains:

```text
https://insurehub-policy-mfe.vercel.app/remoteEntry.js
https://insurehub-payment-mfe.vercel.app/remoteEntry.js
https://insurehub-container.vercel.app
```

## Required Node Version

Use Node `22.x` locally and in Vercel.

- Root workspace version hint: [`.nvmrc`](../.nvmrc)
- App runtime pinning: `package.json` `engines.node = 22.x`

## 1. Policy MFE

- Create a new Vercel project
- Set the project root directory to `policy-mfe`
- Deploy with the default settings in [`policy-mfe/vercel.json`](../policy-mfe/vercel.json)

Expected published file:

```text
https://<policy-project-domain>/remoteEntry.js
```

## 2. Payment MFE

- Create a new Vercel project
- Set the project root directory to `payment-mfe`
- Deploy with the default settings in [`payment-mfe/vercel.json`](../payment-mfe/vercel.json)

Expected published file:

```text
https://<payment-project-domain>/remoteEntry.js
```

## 3. Container

- Create a new Vercel project
- Set the project root directory to `container-app`
- Add these environment variables before deploying:

```text
POLICY_MFE_REMOTE_ENTRY=https://<policy-project-domain>/remoteEntry.js
PAYMENT_MFE_REMOTE_ENTRY=https://<payment-project-domain>/remoteEntry.js
```

Recommended values if you use the suggested project names:

```text
POLICY_MFE_REMOTE_ENTRY=https://insurehub-policy-mfe.vercel.app/remoteEntry.js
PAYMENT_MFE_REMOTE_ENTRY=https://insurehub-payment-mfe.vercel.app/remoteEntry.js
```

- Deploy with the default settings in [`container-app/vercel.json`](../container-app/vercel.json)

The Container build generates [`container-app/src/app/remote-config.ts`](../container-app/src/app/remote-config.ts) during `prebuild` from those environment variables.

## Local Development

Local development still uses the default localhost remotes:

```text
POLICY_MFE_REMOTE_ENTRY=http://localhost:4201/remoteEntry.js
PAYMENT_MFE_REMOTE_ENTRY=http://localhost:4202/remoteEntry.js
```

No extra setup is required for local `npm start`.

## Routing

Each deployed app includes a SPA rewrite to `/index.html` through its local `vercel.json`, so deep links such as `/policies/123` and `/payments/history` resolve correctly.

## Dashboard Settings Summary

For each Vercel project:

- Framework Preset: `Other`
- Root Directory:
  - `policy-mfe` for the policy app
  - `payment-mfe` for the payment app
  - `container-app` for the container app
- Build Command: picked up from `vercel.json`
- Output Directory: picked up from `vercel.json`
- Install Command: leave default (`npm install`)

## Optional CLI Flow

If you prefer the Vercel CLI, run these commands from the repo root after logging in:

```bash
vercel --cwd policy-mfe
vercel --cwd payment-mfe
vercel --cwd container-app
```

Before deploying the container from the CLI, make sure these environment variables exist in the Vercel project:

```text
POLICY_MFE_REMOTE_ENTRY
PAYMENT_MFE_REMOTE_ENTRY
```
