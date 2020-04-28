import {User} from "./User";

export interface IAllRepostiory<T> {
    get(): PromiseLike<T>;
    save(thing: T):  PromiseLike<T>;
}

export interface IAllUserRepostiory {
    getUsers(): PromiseLike<User[]>;
    saveUsers(user: User[]):  PromiseLike<User[]>;
}

export interface IUserRepo {
    getUsers(): PromiseLike<User[]>;
    getUser(id: string): PromiseLike<User>;
    updateUser(user: User): PromiseLike<User[]>;
    setUsers(users: User[]): PromiseLike<User[]>;
    addUser(user: User): PromiseLike<User[]>;
}
