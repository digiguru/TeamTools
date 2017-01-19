
import {User} from "./User";
import {InMemoryUsers} from "./Users";
import {BrowserUsers} from "./BrowserUsers";
import {IAllUserRepostiory, IUserRepo} from "./IUsers";

export class InMemoryBrowserUsers implements IUserRepo  {
    cache: InMemoryUsers;
    repo: IAllUserRepostiory;
    constructor(window: Window) {
        this.cache = new InMemoryUsers();
        this.repo = new BrowserUsers(window);
    }
    updateUser(user: User): Thenable<User[]> {
        const prom = this.cache.updateUser(user);
        prom.then(users => {
            this.repo.saveUsers(users);
        });
        return prom;
    }
    addUser(user: User): Thenable<User[]> {
        const prom = this.cache.addUser(user);
        prom.then(users => {
            this.repo.saveUsers(users);
        });
        return prom;
    }
    getUsers(): Thenable<User[]> {
        const prom = this.repo.getUsers();
        prom.then(users => {
            this.cache.setUsers(users);
        });
        return prom;
    }
    getUser(id: string): Thenable<User> {
        const result = this.cache.getUser(id);
        return Promise.resolve(result);
    }
    setUsers(users: User[]): Thenable<User[]> {

        const promCache = this.cache.setUsers(users);
        const promRepo = this.repo.saveUsers(users);
        return promCache;
    }
}