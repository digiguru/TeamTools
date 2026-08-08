# TeamTools

TeamTools is a lightweight team-health application for anonymously capturing where people think a team sits in the Tuckman model and showing the combined result immediately.

The project started as a RaphaelJS experiment, moved through D3, and is now a React + TypeScript application rendered with SVG.

## Tech stack

- React 19
- TypeScript 7
- Vite 8
- Redux / React Redux
- RxJS
- Vitest and Testing Library
- Vercel for deployment
- Node.js 24

## Development

Requirements:

- Node.js 24
- npm

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Vite will print the local development URL, normally `http://localhost:5173`.

## Quality checks

Run the full local validation with:

```bash
npm run check
```

Or run each stage independently:

```bash
npm run lint
npm test
npm run build
```

`npm run lint` performs a full TypeScript type-check with `tsc --noEmit`. This is currently a more useful static-analysis gate for this TypeScript-heavy codebase than preserving the obsolete Create React App ESLint configuration that the project previously carried.

## Tests

The Vitest suite covers the core team models and shared behaviours, including:

- Comfort model behaviour
- Tuckman model behaviour
- cache behaviour
- construction and filtering of users

Use watch mode while developing:

```bash
npm run test:watch
```

CI uses:

```bash
npm run test:ci
```

Tests should focus on behaviour rather than implementation details. New reducers, transformations and user-visible flows should normally gain tests in the same change.

## CI/CD

GitHub Actions runs on pull requests and pushes to `main` using Node 24. The validation pipeline runs:

1. `npm ci`
2. TypeScript static analysis
3. the Vitest suite
4. the Vite production build

A successful pull request can then be deployed as a Vercel preview. Pushes to `main` deploy to production when the required Vercel secrets are configured.

Dependabot pull requests can be auto-merged only after the CI pipeline succeeds.

## Project structure

- `src/Entry/` — entry/user onboarding UI
- `src/React/Comfort/` — comfort model state and UI
- `src/React/Tuckman/` — Tuckman model state and UI
- `src/React/*Zone/` — visualisation and interaction areas
- `src/Shared/` — reusable browser, user, cache and geometry utilities
- `src/**/__tests__/` — Vitest suites
- `vite.config.ts` — Vite and test configuration
- `vercel.json` — Vercel deployment configuration

## Deployment

Production assets are generated with:

```bash
npm run build
```

The current deployment target is Vercel. The old Heroku references and `Procfile` are historical leftovers and are not the primary deployment path.

## Contributing

Keep pull requests small where practical. Before opening or merging one, run:

```bash
npm run check
```

Do not weaken tests merely to get CI green; fix the behaviour or update the expectation when the intended behaviour has genuinely changed.

## License

MIT — see `LICENSE`.