import { IUser, IUserList } from "UserListConnector";
import { Point } from "./Point";


export class ChaosPickerUserChoiceState {
    User: string;
    Zone: "Chaos" | "Stretch" | "Comfort";
    Distance: number;
}

export class ChaosPickerZoneRangeState {
    Start: number;
    End: number;
}
export interface IUserable {
  User: string;
}

export interface IChaosPickerZoneEvents {
  onZoneMouseDown: (zone: "Comfort" | "Chaos" | "Stretch") => void;
  onZoneMouseUp: (user: string, zone: "Comfort" | "Chaos" | "Stretch", centerPoint: Point, event: any) => void;
  onZoneOverFocus: (zone: "Comfort" | "Chaos" | "Stretch") => void;
  onZoneOffFocus: (zone: "Comfort" | "Chaos" | "Stretch") => void;
}

export interface IChaosPickerZoneConnector {
    Zone: ChaosPickerZoneState;
    User: string;
    CenterPoint: Point;
}

export interface IChaosPickerZoneEventObject {
    Events: IChaosPickerZoneEvents;
}
export interface IChaosPickerZoneConnectorWithEvents {
    Zone: ChaosPickerZoneState;
    User: string;
    Events: IChaosPickerZoneEvents;
    CenterPoint: Point;
}
export class ChaosPickerZoneState {
    Name: "Chaos" | "Stretch" | "Comfort";
    Focus: "in-focus" | "active" | "not-in-focus";
    Range: ChaosPickerZoneRangeState;
    Size: ISizable;
}

export class ChaosZoneList {
    Comfort: ChaosPickerZoneState;
    Stretch: ChaosPickerZoneState;
    Chaos: ChaosPickerZoneState;
}

export class DOMMeasurement implements IDOMMeasurement {
    constructor(input: string) {

        if (input.indexOf("%") !== -1) {
            this.Value = parseInt(input.substr(0, input.indexOf("%")), 10);
            this.Unit = "%";
        } else if (input.indexOf("%") !== -1) {
            this.Value = parseInt(input.substr(0, input.indexOf("px")), 10);
            this.Unit = "px";
        } else {
            this.Value = parseInt(input, 10);
            this.Unit = "px";
        }
    }
    Unit: "px" | "%";
    Value: number;
    toString(): string {
        return "" + this.Value + this.Unit;
    };
}

export interface IDOMMeasurement {
    Unit: "px" | "%";
    Value: number;
}

export interface ISizable {
    Width: IDOMMeasurement;
    Height: IDOMMeasurement;
}

export class ChaosPickerState {
    CenterPoint: Point;
    UserList: IUserList;
    Zones: ChaosZoneList;
    ShowUserChoices: boolean;
    CurrentUser?: string;
    UserChoices: Array<ChaosPickerUserChoiceState>;
}