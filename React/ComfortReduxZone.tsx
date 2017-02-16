import * as React from "react";
import {ChaosPickerZoneState} from "ComfortReactModelState";

export const ReduxChaosArea = (state) => ( // , onZoneUnfocus, onZoneClick, onZoneActive) => (
    <g>
        <rect id="chaos" className={state.Focus ? "in-focus" : "not-in-focus"}
            onMouseEnter={() => state.onZoneFocus(state.Name)}
            onMouseLeave={() => state.onZoneUnfocus(state.Name)}
            width={state.Size.Width.toString()} height={state.Size.Height.toString()}></rect>
        <text className="area-label" id="label-choas" text-anchor="middle" textAnchor="middle" x="50%" y="20">chaos</text>
    </g>
    /*
            
    
    onMouseUp={onZoneClick(state.Name)}
            onMouseDown={onZoneActive(state.Name)}
            onMouseEnter={onZoneFocus(state.Name)}
            onMouseLeave={onZoneUnfocus(state.Name)}*/
);