import {IIndexableObject} from "./Cache";
import type { Participant } from "../LiveSession/Model";
export class User implements IIndexableObject, Participant {
    name: string;
    id: string;
    voted: boolean;
    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
        this.voted = false;
    }
}