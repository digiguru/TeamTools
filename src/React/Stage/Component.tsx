import * as React from "react";
import {  IStageState } from "./Model";

export const Stage = (state: any) => {
    return <svg xmlns="http://www.w3.org/2000/svg" id="stage" width={state.Size.width} height={state.Size.height}>
        {state.InnerBits}
    </svg>;
};
