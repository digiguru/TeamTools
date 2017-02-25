import * as React from "react";
import {ChaosPickerZoneState, Focus, IChaosPickerZoneConnector} from "ComfortReactModelState";

export const ReduxChaosArea = (state: IChaosPickerZoneConnector) => { // , onZoneUnfocus, onZoneClick, onZoneActive) => (
    return <g>
        <rect id="chaos" className={state.zone.Focus ? (state.zone.Focus === Focus.Over ? "in-focus" : "active") : "not-in-focus"}
            onMouseEnter={() => state.events.onZoneOverFocus(state.zone.Name)}
            onMouseLeave={() => state.events.onZoneOffFocus(state.zone.Name)}
            onMouseDown={() => state.events.onZoneMouseDown(state.zone.Name)}
            onMouseUp={(event) => state.events.onZoneMouseUp(state.user, state.zone.Name, event)}
            width={state.zone.Size.Width.toString()} height={state.zone.Size.Height.toString()}></rect>
        <text className="area-label" id="label-chaos" text-anchor="middle" textAnchor="middle" x="50%" y="20">chaos</text>;
    </g >;
};

export const ReduxStretchArea = (state: IChaosPickerZoneConnector) => {
    return <g>
            <circle
                className={state.zone.Focus ? (state.zone.Focus === Focus.Over ? "in-focus" : "active") : "not-in-focus"} id="stretch" r="33%" cx="50%" cy="50%"
                    onMouseEnter={() => state.events.onZoneOverFocus(state.zone.Name)}
                    onMouseLeave={() => state.events.onZoneOffFocus(state.zone.Name)}
                    onMouseDown={() => state.events.onZoneMouseDown(state.zone.Name)}
                    onMouseUp={(event) => state.events.onZoneMouseUp(state.user, state.zone.Name, event)}
                    width={state.zone.Size.Width.toString()} height={state.zone.Size.Height.toString()}></circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" textAnchor="middle" x="50%" y="20%">stretch</text>
        </g>;
};

export const ReduxComfortArea = (state: IChaosPickerZoneConnector) => {
    return <g>
            <circle
                className={state.zone.Focus ? (state.zone.Focus === Focus.Over ? "in-focus" : "active") : "not-in-focus"} id="stretch" r="15%" cx="50%" cy="50%"
                    onMouseEnter={() => state.events.onZoneOverFocus(state.zone.Name)}
                    onMouseLeave={() => state.events.onZoneOffFocus(state.zone.Name)}
                    onMouseDown={() => state.events.onZoneMouseDown(state.zone.Name)}
                    onMouseUp={(event) => state.events.onZoneMouseUp(state.user, state.zone.Name, event)}
                    width={state.zone.Size.Width.toString()} height={state.zone.Size.Height.toString()}></circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" textAnchor="middle" x="50%" y="50%">comfort</text>
        </g>;
};
 /*
            
    
    onMouseUp={onZoneClick(state.Name)}
            onMouseDown={onZoneActive(state.Name)}
            onMouseEnter={onZoneFocus(state.Name)}
            onMouseLeave={onZoneUnfocus(state.Name)}*/