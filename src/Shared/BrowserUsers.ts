import { User } from "./User";
import { BrowserParticipantRepository } from "../LiveSession/BrowserParticipantRepository";
import { IAllUserRepostiory } from "./IUsers";

export class BrowserUsers implements IAllUserRepostiory {
    private readonly participants: BrowserParticipantRepository<User>;

    constructor(window: Window) {
        this.participants = new BrowserParticipantRepository<User>(window, "users");
    }

    getUsers(): PromiseLike<User[]> {
        return this.participants.getParticipants();
    }

    saveUsers(users: User[]): PromiseLike<User[]> {
        return this.participants.saveParticipants(users);
    }
}
