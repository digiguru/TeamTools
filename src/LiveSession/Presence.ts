import type { Contribution } from "./Model";

export interface PresenceConnection {
  participantId: string;
  connected: boolean;
  lastActiveAt?: number;
}

export interface ParticipantPresence {
  participantId: string;
  connected: boolean;
  active: boolean;
  contributed: boolean;
  waiting: boolean;
}

export const DEFAULT_ACTIVITY_TIMEOUT_MS = 10_000;

export function participantPresence<TValue>(
  connections: Iterable<PresenceConnection>,
  contributions: Iterable<Contribution<TValue>>,
  now = Date.now(),
  timeoutMs = DEFAULT_ACTIVITY_TIMEOUT_MS
): ParticipantPresence[] {
  const contributionIds = new Set<string>();
  for (const contribution of contributions) contributionIds.add(contribution.participantId);

  const byParticipant = new Map<string, { connected: boolean; lastActiveAt?: number }>();
  for (const connection of connections) {
    const existing = byParticipant.get(connection.participantId);
    if (!existing) {
      byParticipant.set(connection.participantId, {
        connected: connection.connected,
        lastActiveAt: connection.lastActiveAt
      });
      continue;
    }
    existing.connected ||= connection.connected;
    if (
      Number.isFinite(connection.lastActiveAt) &&
      (!Number.isFinite(existing.lastActiveAt) || connection.lastActiveAt! > existing.lastActiveAt!)
    ) {
      existing.lastActiveAt = connection.lastActiveAt;
    }
  }

  return [...byParticipant.entries()].map(([participantId, connection]) => {
    const contributed = contributionIds.has(participantId);
    const recentlyActive =
      Number.isFinite(connection.lastActiveAt) &&
      now - (connection.lastActiveAt as number) <= timeoutMs;
    const active = connection.connected && (contributed || recentlyActive);

    return {
      participantId,
      connected: connection.connected,
      active,
      contributed: connection.connected && contributed,
      waiting: active && !contributed
    };
  });
}

export function countPresence(states: Iterable<ParticipantPresence>) {
  let connected = 0;
  let active = 0;
  let contributed = 0;
  let waiting = 0;

  for (const state of states) {
    if (state.connected) connected += 1;
    if (state.active) active += 1;
    if (state.contributed) contributed += 1;
    if (state.waiting) waiting += 1;
  }

  return { connected, active, contributed, waiting };
}
