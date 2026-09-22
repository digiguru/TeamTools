# Shared live-session library extraction notes

This document records evidence from the two current consumers before extracting a standalone shared library.

## Consumers examined

### Wheel of Emotion

Current shape:

- anonymous room URL;
- one browser-scoped anonymous participant identity per room;
- one replaceable current contribution per participant;
- host ownership via browser-held credential;
- HTTP room lifecycle plus WebSocket realtime transport;
- live presence counts;
- in-memory server persistence plus browser-saved aggregate snapshots;
- aggregate is emotion counts;
- participants vote independently and concurrently.

### TeamTools

Current shape:

- one local facilitator workspace;
- facilitator defines named participants;
- participant records are browser-local;
- no host credential because there is no remote host boundary;
- no room/session URL;
- no realtime transport or presence;
- facilitator steps through participants sequentially;
- contributions are model-specific choices containing a zone and distance;
- current choice identity is tied to username in model state;
- Comfort and Tuckman maintain separate contribution collections;
- aggregate/rendering is model-specific SVG state.

## Proven shared concepts

Both applications fit these concepts cleanly:

```text
Session
Participant
Contribution<T>
Aggregate<T>
ParticipantRepository<T>
```

A host credential is useful for hosted sessions but is not universal.

## Differences the final library must model explicitly

### 1. Transport is optional

Wheel needs WebSocket transport and reconnect behavior.

TeamTools currently needs no network transport at all.

Therefore:

```text
Session != RealtimeSession
```

Realtime should be an adapter/capability attached to a session.

### 2. Identity policy varies

Wheel:

```text
anonymous browser-generated participant ID
```

TeamTools:

```text
facilitator-created named User
```

The library should not assume anonymous identity or names. It should require a stable participant ID and let applications attach domain/profile data.

### 3. Host authorization is conditional

Wheel has a meaningful remote authorization boundary and requires a host credential.

TeamTools does not.

The core model should therefore allow:

```ts
authorization?: HostAuthorization
```

rather than requiring host tokens in every session.

### 4. Contribution lifecycle differs

Wheel contributions are mutable:

```text
participant A: emotion X -> emotion Y
```

The latest value replaces the previous current vote.

TeamTools choices are currently append-oriented and sequential: once a participant chooses a zone they are removed from the remaining participant list for that model.

The library needs a contribution policy rather than assuming replacement or append semantics.

Likely policies:

```text
replace-current
append
single-submit
domain-managed
```

### 5. A session can contain multiple exercises

Wheel effectively has one exercise per room.

TeamTools has at least two exercises in one workspace:

```text
Comfort
Tuckman
```

This suggests a reusable hierarchy closer to:

```text
Session
  Exercise / Channel / Activity
    Contributions
    Aggregate
```

This is an important finding: contributions should probably be scoped by an activity key rather than attached directly to the session root.

### 6. Persistence and transport are independent

Wheel currently has:

```text
server memory + browser aggregate recovery
```

TeamTools has:

```text
browser localStorage participant persistence
```

A shared library should define storage interfaces, not pick a database or localStorage:

```ts
SessionStore
ParticipantStore
ContributionStore
```

Implementations can be memory, browser, Postgres/Supabase, etc.

### 7. Aggregation is domain-owned

Emotion counting and TeamTools SVG/model choice rendering are fundamentally different.

The shared layer should provide contribution collections and lifecycle events, but aggregation should be supplied by the application:

```ts
aggregate(contributions) => domainAggregate
```

### 8. Presence is a transport capability

Wheel now distinguishes four realtime presence states:

```text
connected
active
contributed
waiting
```

"Active" means recently interactive or already contributed while still connected. "Waiting" means active but not yet contributed. Presence is deduplicated by participant ID rather than connection/socket.

TeamTools still cannot observe those states at runtime because it has no network transport, but it now carries the same transport-neutral presence calculation in `src/LiveSession/Presence.ts`. This is useful proof that the capability can exist independently of WebSocket implementation details.

Presence therefore belongs with realtime transport rather than the base participant model. The core should expose presence calculations/interfaces, while each transport supplies connection/activity events.

## Proposed library shape after this experiment

A likely shape is:

```text
@digiguru/live-session
  core/
    Session
    Activity
    Participant
    Contribution
    lifecycle policies
  storage/
    interfaces
    memory adapter
    browser adapter
  realtime/
    websocket client
    websocket server
    presence
    reconnect
  host/
    optional authorization
  ui/
    connection/session status primitives
```

Application-owned:

```text
identity presentation
contribution schema
validation
aggregation
result visualisation
domain language
```

## Terminology refinement

The TeamTools comparison introduces one additional candidate term:

**Activity** — a contribution namespace/exercise inside a session.

This is preferable to forcing one contribution schema per session and appears necessary if TeamTools is to fit naturally.

Provisional canonical hierarchy:

```text
Session
Activity
Participant
Contribution
Aggregate
```

Optional capabilities:

```text
HostAuthorization
RealtimeTransport
Presence
Persistence
```

## Next extraction criterion

Do not publish the shared package until both applications can express their behavior without application-specific conditionals inside core.

The strongest test is:

- Wheel configures anonymous identity + realtime + replace-current contributions.
- TeamTools configures named participants + local transport + per-activity sequential/single-submit contributions.

If those can both use the same core interfaces cleanly, the abstraction is ready to extract.


## Testability finding: time is a dependency

The Wheel implementation initially exposed a testing smell: a browser test waited the real 10-second activity timeout.

The reusable presence API now treats time as input:

```ts
participantPresence(connections, contributions, now, timeoutMs)
```

TeamTools tests exercise expiry using synthetic timestamps and short logical windows with no wall-clock sleep.

The eventual shared library should keep this rule:

- production may default to a human-scale timeout such as 10 seconds;
- timeout duration must be configurable;
- core calculations accept/inject time;
- tests should advance logical time or use a short test configuration rather than wait production durations.
