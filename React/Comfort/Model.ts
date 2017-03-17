import { IUser, IUserList } from "../User/Connector";
import { Point } from "../Models/Point";
import { Size } from "../Models/Size";
import { ComfortZoneState } from "../ComfortZone/Model";

export class ChaosPickerUserChoiceState {
    User: string;
    Zone: "Chaos" | "Stretch" | "Comfort";
    Distance: number;
}

export class ComfortZoneList {
    Comfort: ComfortZoneState;
    Stretch: ComfortZoneState;
    Chaos: ComfortZoneState;
}

export class ComfortAppState {
    Size: Size;
    CenterPoint: Point;
    UserList: IUserList;
    Zones: ComfortZoneList;
    ShowUserChoices: boolean;
    CurrentUser?: string;
    UserChoices: Array<ChaosPickerUserChoiceState>;
}