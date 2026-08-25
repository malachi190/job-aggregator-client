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
