# InsureHub MFE

Local deployment guide for the monorepo.

## Apps

- `container-app` -> host/container app on `http://localhost:4200`
- `policy-mfe` -> Policy micro frontend on `http://localhost:4201`
- `payment-mfe` -> Payment micro frontend on `http://localhost:4202`

## Prerequisites

- Node.js `22.x`
- npm

Check your Node version:

```bash
node -v
```

## Install Dependencies

Install dependencies in each app separately.

```bash
cd container-app && npm install
cd ../policy-mfe && npm install
cd ../payment-mfe && npm install
```

## Run Locally

Open `3` terminals from the repo root and start the apps in this order.

Terminal 1:

```bash
cd policy-mfe
npm start
```

Terminal 2:

```bash
cd payment-mfe
npm start
```

Terminal 3:

```bash
cd container-app
npm start
```

## Local URLs

- Container: `http://localhost:4200`
- Policy MFE standalone: `http://localhost:4201`
- Payment MFE standalone: `http://localhost:4202`

Use the container app for the full integrated flow:

- Home: `http://localhost:4200`
- Policies: `http://localhost:4200/policies`
- Payments: `http://localhost:4200/payments`
- Payment History: `http://localhost:4200/payments/history`

## Notes

- The container app loads remotes from localhost by default:
  - `http://localhost:4201/remoteEntry.js`
  - `http://localhost:4202/remoteEntry.js`
- Demo data is stored in browser `localStorage`.
- Use the in-app `Reset Demo Data` action to reseed the mock state.

## Build Check

To verify production builds locally:

```bash
cd container-app && npm run build
cd ../policy-mfe && npm run build
cd ../payment-mfe && npm run build
```
