import {User} from './User';
import {GenericCache} from './Cache';

export interface IAllUserRepostiory {
    getUsers() : Thenable<User[]>;
    saveUsers(user:User[]) :  Thenable<User[]>;
}

export interface IAllRepostiory<T> {
    get() : Thenable<T>;
    save(thing:T) :  Thenable<T>;
}
export class BrowserRepo<T> implements IAllRepostiory<T> {
    key : string;
    br : Window;
    constructor (key:string, window:Window) {
        this.br = window;
        this.key = key;
    }
    get() : Thenable<T> {
        const text : string = this.br.localStorage.getItem(this.key);
        const json : T = JSON.parse(text);
        return Promise.resolve(json);
    }
    save(thing:T) :  Thenable<T>{
        const text = JSON.stringify(thing);
        this.br.localStorage.setItem(this.key, text);
        return Promise.resolve(thing);
    }

}

export class BrowserUsers implements IAllUserRepostiory {
    repo : IAllRepostiory<User[]>;
    constructor(window:Window) {
        this.repo = new BrowserRepo<User[]>("users", window);
    }

    getUsers() : Thenable<User[]> {
        return this.repo.get();
    }

    saveUsers(users:User[]) :  Thenable<User[]> {
        return this.repo.save(users);
    } 
}

export class InMemoryBrowserUsers  {
    cache:InMemoryUsers;
    repo:IAllUserRepostiory;
    constructor(window:Window) {
        this.cache = new InMemoryUsers();
        this.repo = new BrowserUsers(window);
    }
    updateUser(user:User) : Thenable<User[]> {
        const prom = this.cache.updateUser(user);
        prom.then(users => {
            this.repo.saveUsers(users);
        });
        return prom;
    }
    addUser(name:string) : Thenable<User[]> {
        const prom = this.cache.addUserByName(name);
        prom.then(users => {
            this.repo.saveUsers(users);
        });
        return prom;
    }
    getUsers() : Thenable<User[]> {
        const prom = this.repo.getUsers();
        prom.then(users => {
            this.cache.setUsers(users);
        });
        return prom;
    }
    getUser(id:string) : Thenable<User> {
        const result = this.cache.getUser(id);
        return Promise.resolve(result);
    }
    setUsers(users:User[]) : Thenable<User[]> {
        
        const promCache = this.cache.setUsers(users);
        const promRepo = this.repo.saveUsers(users);
        return promCache;
    }
}

export class InMemoryUsers {
    cache : GenericCache;
    
    constructor() {
        this.cache = new GenericCache();
        this.setUsersByName([
            "Adam Hall",
            "Billie Davey",
            "Laura Rowe",
            "Simon Dawson"
        ]); 
    }

    createUser(name:string, index:number) {
        return new User(name, "user"+index);
    }

    addUser(user:User) : Thenable<User[]> {
        return this.cache.add(user);
    }
    
    addUserByName(name:string) : Thenable<User[]> {//Don't want this?
        return this.cache.add(this.createUser(name, 9));
    }

    updateUser(user:User) : Thenable<User[]> {
        return this.cache.update(user);
    }
    

    getUsers() : Thenable<Array<User>>  {
        return this.cache.get();
    }

    getUser(id:string) : Thenable<User> {
        return this.cache.getById(id);
    }

    saveUser(user:User) : Thenable<User[]> {
        return this.cache.update(user);
    }

    setUsers(users:User[]) : Thenable<User[]> {
        return this.cache.set(users);
    }

    setUsersByName(names:Array<string>) : Thenable<User[]> {
        const users = names.map((v, i) => {
            return this.createUser(v,i);
        });
        return this.cache.set(users); 
    }
}