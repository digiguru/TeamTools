import * as React from "react";
import {  IStageState } from "./Model";

export const Stage = (state: any) => {
    debugger;
    console.log("STAGY",state);
    return <svg id="stage" width={state.Size.width} height={state.Size.height}>
        {state.InnerBits}
    </svg>;
};
