import {IIndexableObject} from './Cache';
export class User implements IIndexableObject {
    name: string;
    id: string;
    voted: boolean;
    constructor(name:string, id:string) {
        this.name = name;
        this.id = id;
        this.voted = false;
    }
}