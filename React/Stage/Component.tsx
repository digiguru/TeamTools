import * as React from "react";
import {  IStage } from "./Model";

export const Stage = (state: IStage) => {
    debugger;
    const innerStuff = state.children;
    return <svg id="stage" width={state.Size.width} height={state.Size.height}>
        <g id="Children">{state.children}</g>
    </svg>;
};
