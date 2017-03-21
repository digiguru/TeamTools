import { Point } from "../Models/Point";
import { Size } from "../Models/Size";
import { ComfortZoneState } from "../ComfortZone/Model";
import { IUserList, IUser } from "../User/Model";

export class ComfortUserChoiceState {
    User: IUser;
    Zone: "Chaos" | "Stretch" | "Comfort";
    Distance: number;
}

export class ComfortZoneList {
    Comfort: ComfortZoneState;
    Stretch: ComfortZoneState;
    Chaos  : ComfortZoneState;
}

export class ComfortAppState {
    Size           : Size;
    CenterPoint    : Point;
    UserList       : IUserList;
    Zones          : ComfortZoneList;
    ShowUserChoices: boolean;
    CurrentUser?   : IUser;
    UserChoices    : Array<ComfortUserChoiceState>;
}
export class ComfortAppStateWithChildren extends ComfortAppState {
    children: any;
}
