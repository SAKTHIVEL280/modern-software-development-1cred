# Todo Atelier

Todo Atelier is a React + TypeScript task board focused on speed, clarity, and reliable local persistence.

## Features

- Create, complete, filter, and remove tasks.
- Clear completed tasks in one action.
- Local persistence via validated `localStorage` reads and writes.
- Keyboard-friendly controls with visible focus states and skip link support.
- Error boundary fallback for unexpected runtime failures.

## Tech Stack

- React 19
- TypeScript 5
- Vite 8
- Vitest + Testing Library
- ESLint 9

## Quick Start

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

## Scripts

- `npm run dev`: Start development server.
- `npm run build`: Type-check and build production assets.
- `npm run preview`: Preview production build locally.
- `npm run lint`: Run ESLint checks.
- `npm run test`: Run the full test suite once.
- `npm run test:watch`: Run tests in watch mode.
- `npm run check`: Run lint + test + build quality gate.
- `npm run analyze`: Build with bundle report output at `stats.html`.

## Environment Variables

Copy `.env.example` to `.env.local` and edit values as needed.

- `VITE_APP_NAME`: UI app title (default: `Todo Atelier`).
- `VITE_APP_VERSION`: Optional version label shown in footer.

## Production Readiness Included

- CI-friendly quality gate via `npm run check`.
- Unit and component tests covering storage and user flows.
- Pre-commit checks with Husky + lint-staged.
- Vercel deployment config with:
  - SPA rewrite fallback.
  - Security headers including CSP.
  - Long-lived immutable cache headers for built assets.

## Deploy to Vercel

1. Import this repository in Vercel.
2. Keep framework preset as `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy.

`vercel.json` is already configured for routing, security headers, and static asset caching.
