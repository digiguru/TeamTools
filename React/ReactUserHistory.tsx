import * as React from "react";
import {ChaosPickerUserChoiceState, ChaosPickerState} from "ComfortReactModelState";
import {Point} from "Point";
import {Polar} from "Polar";
import { IUserChoiceState } from "./UserHistoryConnector";

export const ReduxUserHistoryArea = (state: IUserChoiceState) => {
    if (state && state.Choices.length) {
        const totalPoints = state.Choices.length;
        const radian = 6.2831853072; // 360 * Math.PI / 180;
        const polarDivision = radian / totalPoints;
    /*
    .attr("cx", (data: ComfortUserChoice, index) => {
        const angle = polarDivision * index;
        return Point.toCartesian(new Polar(data.distance, angle), new Point(400, 400)).x;
    })
    .attr("cy", (data: ComfortUserChoice, index) => {
        const angle = polarDivision * index;
        return Point.toCartesian(new Polar(data.distance, angle), new Point(400, 400)).y;
    });
    */

        return <g id="history">
            {state.Choices.map((userChoice: ChaosPickerUserChoiceState, i) =>
                <ReduxUserHistory key={userChoice.User} {...userChoice} index={i} polarDivision={polarDivision}  />
            )}
        </g>;

    } else {
        return <p>nothing</p>;
    }
};
export const ReduxUserHistory = (state) => {
    //state.Distance
    //state.User
    //state.Zone
    const angle = state.polarDivision * state.index;
    const point = Point.toCartesian(new Polar(state.Distance, angle), new Point(400, 400));
    return <circle cx={point.x} cy={point.y} r="10" className="point"></circle>;
}