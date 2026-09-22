/**
 * Domain-neutral collaboration primitives shared by TeamTools models.
 *
 * TeamTools currently runs a facilitator-led local session. These types are
 * intentionally transport-agnostic so a future realtime implementation can
 * use the same language without pretending the current app is networked.
 */
export interface Participant {
  id: string;
}

export interface Session {
  id: string;
  name?: string;
  status: "open" | "closed";
  createdAt?: number;
  updatedAt?: number;
}

export interface Contribution<TValue = unknown> {
  participantId: string;
  value: TValue;
  updatedAt?: number;
}

export interface Aggregate<TValue = unknown> {
  value: TValue;
  contributionCount: number;
}

export type HostCredential = string;

export interface ParticipantRepository<TParticipant extends Participant> {
  getParticipants(): PromiseLike<TParticipant[]>;
  saveParticipants(participants: TParticipant[]): PromiseLike<TParticipant[]>;
}
