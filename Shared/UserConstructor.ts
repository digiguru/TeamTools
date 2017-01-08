import {User} from './User';

export class UserConstructor {
    static notEmpty(input) {
        return (input !== "");
    }
    static createUsersByNames(names:Array<string>) : User[] {
        const filtered = names.filter(UserConstructor.notEmpty);
        const users = filtered.map((v, i) => {
            return this.createUser(v,i);
        });
        return users; 
    }
    static createUser(name:string, index:number) {
        return new User(name, "user"+index);
    }
}