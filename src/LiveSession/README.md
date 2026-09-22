# Live Session Core

This folder mirrors the internal live-session extraction being proven in Wheel of Emotion.

It deliberately captures **shared language and seams**, not shared networking code yet.

## Canonical terminology

- **session** — the collaboration/workshop instance
- **participant** — a person taking part
- **contribution** — one participant's domain response
- **aggregate** — the domain-specific summary of contributions
- **host credential** — authorization material when a hosted/realtime implementation needs it

## TeamTools compatibility mapping

| Live-session term | TeamTools today |
| --- | --- |
| session | facilitator workspace |
| participant | `User` |
| contribution | Comfort/Tuckman `UserChoice` |
| aggregate | rendered collection of user choices |
| host credential | none |
| transport | local browser only |

## Important difference from Wheel of Emotion

TeamTools is currently facilitator-led and local. It stores named users in browser localStorage and the same browser records their choices sequentially.

It does **not** currently have:

- anonymous browser-scoped participant IDs;
- room/session URLs;
- host ownership tokens;
- WebSocket presence;
- multi-browser voting;
- server-side session lifecycle;
- shared persistence;
- service health/presence telemetry.

Those are therefore **not** being invented inside this refactor.

## What is extracted now

- domain-neutral session/participant/contribution types;
- generic browser repository storage;
- generic participant persistence;
- a session-status frontend control that distinguishes local from realtime transport;
- an optional presence capability with connected/active/contributed/waiting semantics and injectable timeouts.

Existing TeamTools `User` and repository APIs stay compatible behind adapters.

## Evidence for the eventual shared library

The second consumer shows that the final library should likely separate:

1. **session domain model** — reusable everywhere;
2. **storage adapters** — local browser vs server/shared;
3. **transport adapters** — none/local vs WebSocket/realtime;
4. **identity policy** — named facilitator-managed users vs anonymous browser participants;
5. **contribution policy** — sequential one-time choices vs replaceable live votes;
6. **domain aggregation/rendering** — always app-owned.

This means realtime networking should be an optional capability, not baked into the definition of a session.


## Optional presence capability

`Presence.ts` mirrors the richer presence semantics now proven in Wheel of Emotion without enabling realtime behavior in TeamTools itself.

The generic states are:

- **connected** — at least one live transport connection exists for a participant;
- **active** — connected and either recently interactive or already contributed;
- **contributed** — connected and has a current contribution;
- **waiting** — active but has not contributed.

Connections are deduplicated by `participantId`, so multiple connections for one participant do not inflate counts.

The default activity timeout is 10 seconds, but all presence calculations accept `now` and `timeoutMs` explicitly. Tests therefore use synthetic timestamps rather than sleeping for production-duration timeouts.

TeamTools does not currently feed runtime connections into this capability because it remains a local facilitator-led application. That omission is intentional: presence stays an optional realtime concern rather than becoming fake local UI state.
