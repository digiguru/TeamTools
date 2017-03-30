import { IDOMMeasurement } from "../Models/IDomMeasurement";
import { IStageState } from "../Stage/Model";
import { IUserList, IUser } from "../User/Model";
import { ITuckmanZone } from "../TuckmanZone/Model";

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
export interface ITuckmanUserChoiceState {
    User    : IUser;
    zone    : "forming" | "storming" | "norming" | "performing";
    Distance: number;
}
