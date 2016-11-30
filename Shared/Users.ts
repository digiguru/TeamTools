import {User} from './User';

interface IUserRepository {
    getUsers() : Thenable<Array<User>>;
    setUsers(names:Array<string>) : Thenable<Boolean>;
}

export class InMemoryUsers implements IUserRepository {
    users : Array<User>;
    
    constructor() {
        this.setUsers([
            "Adam Hall",
            "Billie Davey",
            "Laura Rowe",
            "Simon Dawson"]);    
    }

    getUsers() : Thenable<Array<User>>  {
        return Promise.resolve(this.users);
    }

    setUsers(names:Array<string>) : Thenable<Boolean> {
        this.users = [];
        for (var i=0; i<names.length;i++) {
            this.users.push(new User(names[i], "user"+i))
        }
        return Promise.resolve(true);
    }
}