import {User} from './User';

export interface IUserRepository {
    //users : Array<User>; //always?
    updateUser(user:User) : Thenable<User[]>;
    addUser(name:string) : Thenable<User[]>;
    getUsers() : Thenable<User[]>;
    getUser(id:string) : Thenable<User>;
    setUsers(names:Array<string>) : Thenable<User[]>;
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

    createUser(name:string) {
        return new User(name, "user"+this.users.length);
    }

    addUser(name:string) : Thenable<User[]> {
        this.users.push(this.createUser(name));
        return Promise.resolve(this.users);
    }

    updateUser(user:User) : Thenable<User[]> {
        for (var i = 0; i < this.users.length; i++) {
            if (user.id === this.users[i].id) {
                this.users[i] = user;
            }
        }
        return Promise.resolve(this.users);
    }
    

    getUsers() : Thenable<Array<User>>  {
        return Promise.resolve(this.users);
    }

    getUser(id:string) : Thenable<User> {
        const users = this.users.filter(function(x) {
            return x.id === id;
        });
        if(users.length) {
            return Promise.resolve(users[0]);
        }
        throw Error("Cannot find user " + id);
    }

    saveUser(user:User) : Thenable<User[]> {
        for(var i = 0; i<this.users.length; i++) {
            if(user.id === this.users[i].id) {
                this.users[i] = user;
                return Promise.resolve(this.users);
            }
        }
        return Promise.reject(this.users);
    }
    setUsers(names:Array<string>) : Thenable<User[]> {
        this.users = [];
        for (var i=0; i<names.length;i++) {
            this.addUser(names[i]);
        }
        return Promise.resolve(this.users);;
    }
}