import * as React from "react";
import {  ComfortAppStateWithChildren } from "../Comfort/Model";

export const Stage = (state: ComfortAppStateWithChildren) => {
    return <svg id="stage" width={state.Size.width} height={state.Size.height}>
        {state.children}
    </svg>;
};