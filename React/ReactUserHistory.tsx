import * as React from "react";
import {ChaosPickerUserChoiceState} from "ComfortReactModelState";

export const ReduxUserHistoryArea = (state: Array<ChaosPickerUserChoiceState>) => {
    return <g id="history">
        {state.map((userChoice: ChaosPickerUserChoiceState, i) =>
            <ReduxUserHistory key={userChoice.User} {...userChoice} />
        )}
    </g>;
};
export const ReduxUserHistory = (state:ChaosPickerUserChoiceState) => {
    return <circle cx="647.1639132235935" cy="400" r="10" className="point"></circle>;
}