import * as React from "react";
import {ComfortUserChoiceState} from "../Comfort/Model";
import {Point} from "../Models/Point";
import {Polar} from "../Models/Polar";
import { IComfortUserChoice, IUserChoiceState } from "./Model";

export const ReduxUserHistoryArea = (state: IUserChoiceState) => {
    if (state && state.Choices.length) {
        const totalPoints   = state.Choices.length;
        const radian        = 6.2831853072;          // 360 * Math.PI / 180;
        const polarDivision = radian / totalPoints;
        const maxDistance   = state.MaxDistance;
        return <g id="history">
            {state.Choices.map((userChoice: ComfortUserChoiceState, i) =>
                <ReduxUserHistory CenterPoint={state.CenterPoint} key={userChoice.User.Username} {...userChoice} Index={i} PolarDivision={polarDivision} MaxDistance={maxDistance}  />
            )}
        </g>;

    } else {
        return <g id="history"></g>;
    }
};

export const ReduxUserHistory = (state: IComfortUserChoice) => {
    const angle            = state.PolarDivision * state.Index;
    const distanceAsPixels = ((state.Distance / 100) * state.MaxDistance);
    const point            = Point.toCartesian(new Polar(distanceAsPixels, angle), state.CenterPoint);

    return <circle cx={point.x} cy={point.y} r="10" className="point"></circle>;
};
