import { Point } from "../Models/Point";
import { ComfortUserChoiceState } from "../Comfort/Model";

export interface IComfortUserChoice {
    PolarDivision: number;
    Index        : number;
    CenterPoint  : Point;
    Distance     : number;
    MaxDistance  : number;
}

export interface IUserChoiceState {
  Choices?    : Array<ComfortUserChoiceState>;
  CenterPoint?: Point;
  MaxDistance?: number;
}
