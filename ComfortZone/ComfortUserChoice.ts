import {User} from '../Shared/User';

export class ComfortUserChoice {
    user : User;
    distance : number;
    area : String;
    constructor(user : User, distance : number, area : String) {
        this.user = user;
        this.distance = distance;
        this.area = area;
    }
}