import {User} from './User';
import {GenericCache} from './Cache';
import {IUserRepo} from './IUsers';

export class InMemoryUsers implements IUserRepo {
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