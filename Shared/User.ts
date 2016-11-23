export class User {
    name: string;
    id: string;
    voted: boolean;
    constructor(name:string, id:string) {
        this.name = name;
        this.id = id;
        this.voted = false;
    }
}