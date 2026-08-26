# Crawler Client

TanStack Start frontend for personalized job discovery, CV management,
AI tailoring, and application tracking.

## Local setup

```bash
cp .env.example .env
npm install
npm run dev
```

The development server runs on `http://localhost:3001` and proxies API routes
to `http://localhost:8080`.

## Validation

```bash
npx tsc --noEmit
npm run build
```

The primary authenticated routes are `/dashboard`, `/applications`, `/cvs`,
`/settings`, and `/tailoring/*`.

## Railway deployment

This repository includes `railpack.json` and Nitro's Node server adapter. A
production build is emitted to `.output`, and Railway starts it with
`npm run start`.

1. Create a Railway service from this repository and select the `main` branch.
2. Set `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `VITE_API_URL`.
   `VITE_API_URL` must be the backend's public origin, without a trailing slash.
3. Generate a public domain and set the healthcheck path to `/`.
4. Add that public frontend origin to the backend's `CORS_ORIGINS` value.

Railway supplies `PORT`; Nitro reads it automatically. Do not commit real
credentials.
