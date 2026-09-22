import { BrowserRepository } from "./BrowserRepository";
import type { Participant, ParticipantRepository } from "./Model";

export class BrowserParticipantRepository<TParticipant extends Participant>
  implements ParticipantRepository<TParticipant> {
  private readonly repository: BrowserRepository<TParticipant[]>;

  constructor(browserWindow: Window, storageKey = "users") {
    this.repository = new BrowserRepository<TParticipant[]>(storageKey, browserWindow);
  }

  getParticipants(): PromiseLike<TParticipant[]> {
    return this.repository.get().then((participants) => participants ?? []);
  }

  saveParticipants(participants: TParticipant[]): PromiseLike<TParticipant[]> {
    return this.repository.save(participants);
  }
}
