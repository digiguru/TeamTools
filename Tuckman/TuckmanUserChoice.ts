import {User} from "../Shared/User";

export class TuckmanUserChoice {
    user : User;
    distance : number;
    area : String;
    constructor(user : User, distance : number, area : String) {
        this.user = user;
        this.distance = distance;
        this.area = area;
    }
}