import { IDOMMeasurement } from "../Models/IDomMeasurement";
import { IStageState } from "../Stage/Model";
import { IUserList, IUser } from "../User/Model";

export interface ITuckmanModel extends IStageState {
    zones?       : ITuckmanZoneList;
    CurrentUser? : IUser;
    UserList?    : IUserList;
    UserChoices? : Array<ITuckmanUserChoiceState>;
};
export interface ITuckmanZoneList {
    forming   : ITuckmanZone;
    storming  : ITuckmanZone;
    norming   : ITuckmanZone;
    performing: ITuckmanZone;
}
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
