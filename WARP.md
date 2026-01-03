# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

The app will be available at http://localhost:3000.

### Build for production

```bash
npm run build
```

### Start the production server

```bash
npm run start
```

### Lint

The project uses the Next.js ESLint config (via `eslint.config.mjs`).

Run lint on the whole project:

```bash
npm run lint
```

Run lint on a specific file:

```bash
npx eslint app/page.tsx
```

(Adjust the path as needed.)

### Tests

There is no test setup or test script defined in `package.json` yet. If you add a test runner (e.g. Jest, Vitest, Playwright), also add the common commands here.

## Project structure and architecture

### Tech stack

- **Framework**: Next.js App Router (`app` directory) with TypeScript
- **Styling**: Tailwind CSS v4 (see `app/globals.css`, `tailwindcss` and `@tailwindcss/postcss` in `devDependencies`)
- **UI utilities**: `clsx`, `tailwind-merge`, `class-variance-authority`
- **Icons**: `lucide-react`
- **Database**: MongoDB via `mongoose` with a connection helper in `lib/mongodb.ts`

### Routing and layout

- The app uses the App Router; the root route (`/`) is implemented in `app/page.tsx`.
- Global layout and HTML shell live in `app/layout.tsx`:
  - Imports Google fonts (`Schibsted_Grotesk`, `Martian_Mono`) via `next/font/google` and exposes them as CSS variables.
  - Wraps the page with the `Navbar` component and a full-screen `LightRays` background effect.
  - Applies global styles from `app/globals.css`.

Adding new pages:
- Create `app/<route>/page.tsx` for new routes.
- Use the `@/*` TypeScript path alias for imports (configured in `tsconfig.json`).

### Components

All shared UI components live under `components/`:

- `Navbar.tsx`: top navigation bar rendered for every page via `app/layout.tsx`.
- `LightRays.tsx`: animated background/visual effect used in the root layout.
- `ExploreButton.tsx`: CTA button used on the home page.
- `EventCard.tsx`: presentational card for event data.

Design pattern:
- Components are generally stateless and receive data via props (e.g. `EventCard` gets data from `lib/constants.ts`).
- Use the `cn` helper from `lib/utils.ts` to combine Tailwind class names.

### Data and utilities

- `lib/constants.ts`:
  - Defines the `EventType` TypeScript type.
  - Exports an `events` array that powers the "Featured Events" section on the home page.
  - If you add more static/shared data, prefer placing it here or in additional files under `lib/`.

- `lib/utils.ts`:
  - Exposes a `cn(...classes)` helper that wraps `clsx` + `tailwind-merge`.
  - Use this wherever you need conditional/class-name merging to keep JSX cleaner.

- `lib/mongodb.ts`:
  - Centralizes the MongoDB connection using `mongoose` with a **connection cache** stored on the Node.js `global` object.
  - Reads `process.env.MONGODB_URI` and throws during module evaluation if it is not set.
  - Exports an async `connectDB()` that returns a shared `mongoose` connection across hot reloads.

Usage notes for `connectDB`:
- Always `await connectDB()` before interacting with any Mongoose models.
- Because `MONGODB_URI` is required at import time, make sure `.env.local` (or environment configuration) sets this variable when running `npm run dev` or `npm run start`.

### Configuration

- `package.json`:
  - Scripts:
    - `dev`: `next dev`
    - `build`: `next build`
    - `start`: `next start`
    - `lint`: `eslint`
  - Uses Next.js `16.1.x`, React `19.x`, Tailwind CSS v4, and TypeScript `^5`.

- `tsconfig.json`:
  - Strict TypeScript settings (`strict: true`, `noEmit: true`).
  - Uses the `@/*` path alias mapped to the project root.
  - Includes `**/*.ts`, `**/*.tsx`, and `**/*.mts` files plus Next.js type files.

- `eslint.config.mjs`:
  - Based on `eslint-config-next` (`core-web-vitals` and `typescript` presets).
  - Overrides ignores to exclude build artifacts like `.next/**`, `out/**`, and `build/**`.

### Assets

- Static images and icons live under `public/`:
  - Icons: `public/icons/...`
  - Event images: `public/images/event*.png`
- These are referenced in components via root-relative paths (e.g. `/images/event1.png`).

### Environment

- MongoDB connection string must be available as `MONGODB_URI` (commonly via `.env.local`).
- When adding new environment variables for server components or API routes, follow Next.js conventions (e.g. prefix client-exposed variables with `NEXT_PUBLIC_`).

### README alignment

The `README.md` is the default `create-next-app` template and describes how to run the dev server and access the app. The commands in this `WARP.md` intentionally mirror that behavior but are tailored to npm and this specific project setup.
