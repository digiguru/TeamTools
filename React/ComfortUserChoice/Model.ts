import { Point } from "../Models/Point";
import { ChaosPickerUserChoiceState } from "../Comfort/Model";

export interface IComfortUserChoice {
    PolarDivision: number;
    Index: number;
    CenterPoint: Point;
    Distance: number;
}

export interface IUserChoiceState {
  Choices: Array<ChaosPickerUserChoiceState>;
  CenterPoint: Point;
}