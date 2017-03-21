
import { Point } from "../Models/Point";
import { ISizable } from "../Models/Size";
import { IUser } from "../User/Model";

export class ComfortZoneRangeState {
    Start: number;
    End: number;
}

export interface IComfortZoneEvents {
  onZoneMouseDown: (zone: "Comfort" | "Chaos" | "Stretch") => void;
  onZoneMouseUp  : (username: string, zone: "Comfort" | "Chaos" | "Stretch", centerPoint: Point, maxDistance: number, event: any) => void;
  onZoneOverFocus: (zone: "Comfort" | "Chaos" | "Stretch") => void;
  onZoneOffFocus : (zone: "Comfort" | "Chaos" | "Stretch") => void;
}

export interface IComfortZoneConnector {
    Zone       : ComfortZoneState;
    User       : IUser;
    CenterPoint: Point;
    TotalDistance: number;
}

export interface IComfortZoneEventList {
    Events: IComfortZoneEvents;
}
export interface IComfortZoneConnectorWithEvents extends IComfortZoneConnector {
    Events       : IComfortZoneEvents;
}
export class ComfortZoneState {
    Name : "Chaos" | "Stretch" | "Comfort";
    Focus: "in-focus" | "active" | "not-in-focus";
    Range: ComfortZoneRangeState;
    Size : ISizable;
}
