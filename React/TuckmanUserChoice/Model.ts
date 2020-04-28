import { Point } from "../Models/Point";
import { ITuckmanUserChoiceState } from "../Tuckman/Model";

export interface ITuckmanUserChoice {
    TotalCount: number;
    Index     : number;
    Distance  : number;
    MaxWidth  : number;
    MaxHeight : number;
}

export interface IUserChoiceState {
  Choices? : Array<ITuckmanUserChoiceState>;
  MaxWidth?: number;
  MaxHeight: number;
}
