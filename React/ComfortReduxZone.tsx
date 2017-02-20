import * as React from "react";
import {ChaosPickerZoneState, Focus} from "ComfortReactModelState";

export const ReduxChaosArea = (state, userName) => ( // , onZoneUnfocus, onZoneClick, onZoneActive) => (
    <g>
        <rect id="chaos" className={state.Focus ? (state.Focus === Focus.Over ? "in-focus" : "active") : "not-in-focus"}
            onMouseEnter={() => state.onZoneOverFocus(state.Name)}
            onMouseLeave={() => state.onZoneOffFocus(state.Name)}
            onMouseDown={() => state.onZoneMouseDown(state.Name)}
            onMouseUp={(a) => state.onZoneMouseUp(userName, state.Name, a)}
            width={state.Size.Width.toString()} height={state.Size.Height.toString()}></rect>
        <text className="area-label" id="label-choas" text-anchor="middle" textAnchor="middle" x="50%" y="20">chaos</text>;
    </g >;
    /*
            
    
    onMouseUp={onZoneClick(state.Name)}
            onMouseDown={onZoneActive(state.Name)}
            onMouseEnter={onZoneFocus(state.Name)}
            onMouseLeave={onZoneUnfocus(state.Name)}*/
);