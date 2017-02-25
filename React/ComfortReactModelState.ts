export enum Focus {
    Off = 0,
    Over = 1,
    Active = 2
}

export class ChaosPickerUserChoiceState {
    User: String;
    Zone: "Chaos" | "Stretch" | "Comfort";
    Distance: number;
}

export class ChaosPickerZoneRangeState {
    Start: number;
    End: number;
}
export interface IUserable {
  user: string;
}
export interface IChaosPickerZoneEventFunction {
  (zone: "Comfort" | "Chaos" | "Stretch"): void;
}
export interface IChaosPickerZoneEvents {
  onZoneMouseDown: (zone: "Comfort" | "Chaos" | "Stretch") => Function;
  onZoneMouseUp: (user: string, zone: "Comfort" | "Chaos" | "Stretch", event: any) => Function;
  onZoneOverFocus: (zone: "Comfort" | "Chaos" | "Stretch") => Function;
  onZoneOffFocus: (zone: "Comfort" | "Chaos" | "Stretch") => Function;
}
export interface IChaosPickerZoneConnector {
    zone: ChaosPickerZoneState;
    user: string;
    events: IChaosPickerZoneEvents;
}

export class ChaosPickerZoneState {
    Name: "Chaos" | "Stretch" | "Comfort";
    Focus: Focus;
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
    UserList: Array<String>;
    Zones: ChaosZoneList;
    ShowUserChoices: Boolean;
    CurrentUser?: String;
    UserChoices: Array<ChaosPickerUserChoiceState>;
}