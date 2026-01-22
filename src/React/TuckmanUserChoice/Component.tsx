import * as React from "react";
import {ITuckmanUserChoiceState} from "../Tuckman/Model";
import { ITuckmanUserChoice, IUserChoiceState } from "./Model";

export const TuckmanUserHistoryArea = (state: IUserChoiceState) => {
    if (state && state.Choices.length) {
        const  totalPoints = state.Choices.length;
        const  maxWidth    = state.MaxWidth;
        return <g id       = "history">
            {state.Choices.map((userChoice: ITuckmanUserChoiceState, i) =>
                <TuckmanUserHistory key={userChoice.User.Username} Index={i} MaxWidth={maxWidth} MaxHeight={state.MaxHeight} Distance={userChoice.Distance} TotalCount={totalPoints}   />
            )}
        </g>;

    } else {
        return <g id="history"></g>;
    }
};

export const TuckmanUserHistory = (state: ITuckmanUserChoice) => {
    const x = ((state.MaxWidth / 100) * state.Distance);
    const y = (state.MaxHeight / state.TotalCount) * state.Index;

    return <circle cx={x} cy={y} r="10" className="point"></circle>;
};
