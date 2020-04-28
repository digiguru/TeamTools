import {User} from "./User";

export interface IAllRepostiory<T> {
    get(): Thenable<T>;
    save(thing: T):  Thenable<T>;
}

export interface IAllUserRepostiory {
    getUsers(): Thenable<User[]>;
    saveUsers(user: User[]):  Thenable<User[]>;
}

export interface IUserRepo {
    getUsers(): Thenable<User[]>;
    getUser(id: string): Thenable<User>;
    updateUser(user: User): Thenable<User[]>;
    setUsers(users: User[]): Thenable<User[]>;
    addUser(user: User): Thenable<User[]>;
}
