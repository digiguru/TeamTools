import {User} from "./User";
import {GenericCache} from "./Cache";
import {IUserRepo} from "./IUsers";
import {UserConstructor} from "./UserConstructor";

export class InMemoryUsers implements IUserRepo {
    cache: GenericCache;

    constructor() {
        this.cache = new GenericCache();
        const users = UserConstructor.createUsersByNames([
            "Adam Hall",
            "Billie Davey",
            "Laura Rowe",
            "Simon Dawson"
        ]);
        this.setUsers(users);
    }



    addUser(user: User): Thenable<User[]> {
        return this.cache.add(user);
    }

    addUserByName(name: string): Thenable<User[]> {
        return this.cache.add(UserConstructor.createUser(name, 9));
    }

    updateUser(user: User): Thenable<User[]> {
        return this.cache.update(user);
    }


    getUsers(): Thenable<Array<User>>  {
        return this.cache.get();
    }

    getUser(id: string): Thenable<User> {
        return this.cache.getById(id);
    }

    saveUser(user: User): Thenable<User[]> {
        return this.cache.update(user);
    }

    setUsers(users: User[]): Thenable<User[]> {
        return this.cache.set(users);
    }
}