import { IDOMMeasurement } from "../Models/IDomMeasurement";
import { IStage } from "../Stage/Model";
import { IUserList, IUser } from "../User/Model";

export interface ITuckmanModel extends IStage {
    focus       : string;
    events      : any;
    zones       : Array<ITuckmanZone>;
    CurrentUser?: IUser;
    UserList    : IUserList;
    UserChoices : Array<ITuckmanUserChoiceState>;
};
export interface ITuckmanZone {
    focus : string;
    index : number;
    label : "forming" | "storming" | "norming" | "performing";
    events: any;
}
export interface ITuckmanUserChoiceState {
    user    : IUser;
    zone    : "forming" | "storming" | "norming" | "performing";
    distance: number;
}
