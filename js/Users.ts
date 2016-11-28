import {User} from '../Shared/User';

export class Users {
    users : Array<User>;
    constructor() {
        this.users = [
            new User("Adam Hall","xxx1"), 
            new User("Billie Davey","xxx2"), 
            new User("Laura Rowe","xxx3"),
            new User("Simon Dawson","xxx4")
        ]
    }
    getUsers() : Array<User>  {
        return this.users;
    }
    setUsers(names:Array<string>) {
        this.users = [];
        for (var i=0; i<names.length;i++) {
            this.users.pop(new User(names[i], "user"+i))
        }
            
        });
    }
}