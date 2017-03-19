import * as React from "react";
import {  IStage } from "./Model";

export const Stage = (state: IStage) => {
    return <svg id="stage" width={state.Size.width} height={state.Size.height}>
        {state.children}
    </svg>;
};