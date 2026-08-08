import { Point } from "../Models/Point";
import { IStageState } from "../Stage/Model";
import { IUserList, IUser } from "../User/Model";
import { ITuckmanZone } from "../TuckmanZone/Model";

export interface ITuckmanModel extends IStageState {
    zones?          : ITuckmanZoneList;
    CenterPoint?    : Point;
    CurrentUser?    : IUser;
    UserList?       : IUserList;
    UserChoices?    : Array<ITuckmanUserChoiceState>;
    ShowUserChoices?: boolean;
    visibility      : boolean;
}

export interface ITuckmanZoneList {
    forming   : ITuckmanZone;
    storming  : ITuckmanZone;
    norming   : ITuckmanZone;
    performing: ITuckmanZone;
}

export interface ITuckmanUserChoiceState {
    User    : IUser;
    Zone    : "forming" | "norming" | "performing" | "storming";
    Distance: number;
}
