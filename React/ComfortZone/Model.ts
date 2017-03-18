
import { Point } from "../Models/Point";
import { ISizable } from "../Models/Size";

export class ComfortZoneRangeState {
    Start: number;
    End: number;
}

export interface IComfortZoneEvents {
  onZoneMouseDown: (zone: "Comfort" | "Chaos" | "Stretch") => void;
  onZoneMouseUp: (user: string, zone: "Comfort" | "Chaos" | "Stretch", centerPoint: Point, event: any) => void;
  onZoneOverFocus: (zone: "Comfort" | "Chaos" | "Stretch") => void;
  onZoneOffFocus: (zone: "Comfort" | "Chaos" | "Stretch") => void;
}

export interface IComfortZoneConnector {
    Zone: ComfortZoneState;
    User: string;
    CenterPoint: Point;
}

export interface IComfortZoneEventList {
    Events: IComfortZoneEvents;
}
export interface IComfortZoneConnectorWithEvents {
    Zone: ComfortZoneState;
    User: string;
    Events: IComfortZoneEvents;
    CenterPoint: Point;
}
export class ComfortZoneState {
    Name: "Chaos" | "Stretch" | "Comfort";
    Focus: "in-focus" | "active" | "not-in-focus";
    Range: ComfortZoneRangeState;
    Size: ISizable;
}