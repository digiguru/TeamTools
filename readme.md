# TeamTools

TeamTools is a lightweight facilitator-led team-health application for capturing where named participants think a team sits across the Comfort and Tuckman models and showing the combined result immediately.

The project started as a RaphaelJS experiment, moved through D3, and is now a React + TypeScript application rendered with SVG.

## Tech stack

- React 19
- TypeScript 6
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

## Internal live-session extraction

TeamTools is the second application being used to prove a reusable collaboration-session model.

The internal shared vocabulary is:

- **session** — the facilitator workspace;
- **participant** — currently represented by TeamTools `User`;
- **contribution** — a Comfort or Tuckman choice;
- **aggregate** — the rendered collection/summary of choices.

Unlike Wheel of Emotion, TeamTools is currently a **local facilitator-led session**, not a realtime multi-browser room. The extraction therefore keeps transport, identity policy and persistence separate from the core session model instead of making WebSockets or anonymous tokens mandatory.

See `src/LiveSession/README.md` for the compatibility mapping and evidence collected for the eventual shared-library extraction.

## Project structure

- `src/LiveSession/` — domain-neutral session, participant, storage and core-control primitives
- `src/Domain/` — adapters between TeamTools choices and generic session contributions
- `src/Entry/` — TeamTools participant-entry UI
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