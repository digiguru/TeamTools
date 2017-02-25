import * as React from "react";
import {ChaosPickerZoneState, Focus, IChoasPickerZoneConnector} from "ComfortReactModelState";

export const ReduxChaosArea = (state: IChoasPickerZoneConnector) => {; // , onZoneUnfocus, onZoneClick, onZoneActive) => (
    return <g>
        <rect id="chaos" className={state.zone.Focus ? (state.zone.Focus === Focus.Over ? "in-focus" : "active") : "not-in-focus"}
            onMouseEnter={() => state.events.onZoneOverFocus(state.zone.Name)}
            onMouseLeave={() => state.events.onZoneOffFocus(state.zone.Name)}
            onMouseDown={() => state.events.onZoneMouseDown(state.zone.Name)}
            onMouseUp={(a) => state.events.onZoneMouseUp(state.user, state.zone.Name, a)}
            width={state.zone.Size.Width.toString()} height={state.zone.Size.Height.toString()}></rect>
        <text className="area-label" id="label-choas" text-anchor="middle" textAnchor="middle" x="50%" y="20" data-name={state.user}>chaos</text>;
    </g >;
};
 /*
            
    
    onMouseUp={onZoneClick(state.Name)}
            onMouseDown={onZoneActive(state.Name)}
            onMouseEnter={onZoneFocus(state.Name)}
            onMouseLeave={onZoneUnfocus(state.Name)}*/