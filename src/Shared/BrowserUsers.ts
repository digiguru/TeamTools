import {User} from "./User";
import {BrowserRepo} from "./BrowserRepo";
import {IAllRepostiory, IAllUserRepostiory} from "./IUsers";


export class BrowserUsers implements IAllUserRepostiory {
    repo: IAllRepostiory<User[]>;
    constructor(window: Window) {
        this.repo = new BrowserRepo<User[]>("users", window);
    }

    getUsers(): PromiseLike<User[]> {
        return this.repo.get();
    }

    saveUsers(users: User[]):  PromiseLike<User[]> {
        return this.repo.save(users);
    }
}