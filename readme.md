# TeamTools

TeamTools is an anonymous real-time workshop tool for making team dynamics visible without attaching names to individual responses.

A host creates a room, chooses either the **Comfort / Stretch / Chaos** model or the **Tuckman** team-development model, shares a friendly room link, and watches participation counts update live. Attendees place one anonymous point on the model and can move it while voting is open. The host then reveals the room, which freezes voting and shows every point at once.

## Current room flow

1. Open the landing page and choose a model.
2. Optionally name the room.
3. Create the host room.
4. Share the generated `/room/<slug>` attendee link.
5. Attendees vote anonymously on their own devices.
6. Everyone can see how many attendees have joined and how many have voted.
7. The host reveals the room.
8. Every attendee sees the anonymous distribution with their own point highlighted.

The host facilitates rather than voting, so host connections are not included in attendee or vote counts.

## Models

### Comfort / Stretch / Chaos

A quick pulse on how demanding the current work feels. Comfort can signal safety and familiarity, stretch can support useful growth, and chaos can signal overload.

### Tuckman

Places the team across **forming**, **storming**, **norming**, and **performing** to surface differences in how people perceive the team's current stage.

These models are conversation starters, not scorecards.

## Privacy and identity

TeamTools does not ask attendees for names, accounts, email addresses, or profiles.

Each browser gets a random room-scoped voter ID stored in local storage. The host browser separately stores a random host credential. The host credential is never added to the shared room URL, and host privileges are checked by the server.

One browser has one current vote per room. Multiple tabs from the same browser reuse the same voter identity.

## Reveal behaviour

Votes remain private while the room is open. Attendees can see only their own point plus the room's joined/voted counts.

When the host selects **Reveal**, the round is frozen. The server then sends the full anonymous set of points to every connected browser. Each attendee's own point is marked as **you**.

Freezing the round prevents people from repositioning themselves after seeing the group distribution.

## Room lifetime

Live room state is currently held in server memory, matching the lightweight approach used by Wheel of Emotion.

A server restart or redeployment clears active rooms and votes. The browser-scoped host/voter identities remain local, but room data itself is not durable. Add shared persistence before using TeamTools for sessions that must survive deployments or process restarts.

## Tech stack

- React 19
- TypeScript 6
- Vite 8
- Node.js 24
- `ws` WebSockets
- Redux / React Redux for the retained legacy model code
- RxJS
- Vitest and Testing Library
- Vercel for deployment

## Development

Requirements:

- Node.js 24
- npm

Install dependencies and start the combined Node + Vite development service:

```bash
npm ci
npm run dev
```

The development server listens on `http://localhost:3000` by default.

Build the frontend and run the production-style Node service with:

```bash
npm run build
npm start
```

## Quality checks

Run the full validation suite with:

```bash
npm run check
```

Or run the stages separately:

```bash
npm run audit
npm run lint
npm run typecheck
npm test
npm run build
npm run check:server
```

## Tests

The Vitest suite covers the retained Comfort/Tuckman domain behaviours plus the live-room primitives and attendee experience, including room URL parsing, point placement, presence semantics, and the highlighted personal vote after reveal.

Use watch mode while developing:

```bash
npm run test:watch
```

CI uses:

```bash
npm run test:ci
```

## CI/CD and branches

The repository uses:

- `preview` as the stable preview branch;
- `main` for production;
- feature branches targeting `preview`.

GitHub Actions validates pull requests with Node 24. Vercel reports preview deployment status against the PR.

## Project structure

- `server.mjs` — room API, WebSocket transport, host authorization, live counts, voting and reveal
- `src/LiveSession/RoomApp.tsx` — landing/room routing
- `src/LiveSession/LandingPage.tsx` — host setup and model selection
- `src/LiveSession/RoomPage.tsx` — host and attendee live-room experience
- `src/LiveSession/ModelVisual.tsx` — interactive bouncy SVG visualisations
- `src/LiveSession/realtime.ts` — browser identity and realtime client helpers
- `src/LiveSession/Presence.ts` — reusable presence semantics
- `src/React/Comfort/` and `src/React/Tuckman/` — retained model/domain implementation
- `src/Shared/` — styling and reusable utilities
- `src/**/__tests__/` — Vitest suites

## License

MIT — see `LICENSE`.


## Analytics and privacy

Team Tools uses two deliberately separate analytics layers:

- **Vercel Web Analytics** provides aggregate page and feature usage without analytics cookies. It remains independently switchable from the in-app **Analytics & privacy** control.
- **Google Analytics 4** is available only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured **and** the visitor explicitly chooses **Allow analytics cookies**. The Google tag is not loaded before consent.

The privacy boundary is strict. Room URLs are normalised from `/room/<room-id>` to `/room/:room`; query strings and fragments are removed; custom events contain only coarse product taxonomy such as model, role, status, changed/revealed flags. Room names, room IDs, vote positions, voter IDs, host tokens and saved-room history are never sent.

Google Analytics runs with automatic pageviews disabled, manual sanitised pageviews, empty referrers, Google Signals disabled, ad personalisation disabled, and all advertising consent categories denied. Revoking Google Analytics consent disables collection and removes reachable `_ga` cookies. Browser Global Privacy Control / Do Not Track disables both providers. Local development hosts do not load either provider.

The analytics notice does not repeatedly interrupt people who have dismissed it. Closing the notice fills only missing choices with the defaults (Vercel aggregate analytics on, Google Analytics cookies off), preserves explicit opt-outs, and suppresses automatic prompts thereafter. Choosing **No analytics cookies** dismisses the notice for the current browser session only, so the consent choice can be offered again in a later session. The persistent **Analytics & privacy** button remains available for manual changes.

Production configuration:

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-V6EEZJPGET
```

Keep this variable scoped to the production Vercel environment so Preview and Development builds remain free of GA telemetry.

## Next.js runtime

TeamTools now runs on Next.js App Router on Vercel.

- `/` is the host setup page.
- `/room/[roomId]` is the host/attendee room experience.
- `/api/live` creates rooms and upgrades live WebSocket connections.
- Vercel Analytics is mounted from the root Next.js layout.
- The previous Vite + custom `server.mjs` deployment path has been removed.

Room state is still process-memory backed for this migration baseline. The follow-up durability work remains tracked separately so it can move to shared storage without reintroducing custom-server deployment plumbing.


## Shared libraries

TeamTools consumes two shared npm packages directly through Next.js:

- `@digiguru/live-session` — shared session/participant/contribution types, browser identity helpers, presence semantics and reconnecting WebSocket lifecycle.
- `@digiguru/spacial-stage` — layout-aware motion primitives for spatial UI transitions.

TeamTools keeps its domain-specific room model, vote geometry, local saved-room snapshots and model rendering in this repository. The shared packages provide infrastructure and vocabulary rather than dictating the workshop experience.
