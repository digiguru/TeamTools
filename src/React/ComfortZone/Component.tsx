import * as React from "react";
import { IComfortZoneConnectorWithEvents } from "./Model";

export const ReduxChaosArea = (state: IComfortZoneConnectorWithEvents) => { // , onZoneUnfocus, onZoneClick, onZoneActive) => (
    const username = state.User && state.User.Username ? state.User.Username : "Adam Hall";
    return <g>
        <rect id="chaos" className={state.Zone.Focus}
            onMouseEnter={() => state.Events.onZoneOverFocus(state.Zone.Name)}
            onMouseLeave={() => state.Events.onZoneOffFocus(state.Zone.Name)}
            onMouseDown={() => state.Events.onZoneMouseDown(state.Zone.Name)}
            onMouseUp={(event) => state.Events.onZoneMouseUp(username, state.Zone.Name, state.CenterPoint, state.TotalDistance, event)}
            width={state.Zone.Size.Width.toString()} height={state.Zone.Size.Height.toString()}></rect>
        <text className="area-label" id="label-chaos" text-anchor="middle" textAnchor="middle" x="50%" y="20">chaos</text>
    </g>;
};

export const ReduxStretchArea = (state: IComfortZoneConnectorWithEvents) => {
    const username = state.User && state.User.Username ? state.User.Username : "Adam Hall";
    return <g>
            <circle
                className={state.Zone.Focus} id="stretch" r="33%" cx="50%" cy="50%"
                    onMouseEnter={() => state.Events.onZoneOverFocus(state.Zone.Name)}
                    onMouseLeave={() => state.Events.onZoneOffFocus(state.Zone.Name)}
                    onMouseDown={() => state.Events.onZoneMouseDown(state.Zone.Name)}
                    onMouseUp={(event) => state.Events.onZoneMouseUp(username, state.Zone.Name, state.CenterPoint, state.TotalDistance, event)}
                    width={state.Zone.Size.Width.toString()} height={state.Zone.Size.Height.toString()}></circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" textAnchor="middle" x="50%" y="20%">stretch</text>
        </g>;
};

export const ReduxComfortArea = (state: IComfortZoneConnectorWithEvents) => {
    const username = state.User && state.User.Username ? state.User.Username : "Adam Hall";
    return <g>
            <circle
                className={state.Zone.Focus} id="stretch" r="15%" cx="50%" cy="50%"
                    onMouseEnter={() => state.Events.onZoneOverFocus(state.Zone.Name)}
                    onMouseLeave={() => state.Events.onZoneOffFocus(state.Zone.Name)}
                    onMouseDown={() => state.Events.onZoneMouseDown(state.Zone.Name)}
                    onMouseUp={(event) => state.Events.onZoneMouseUp(username, state.Zone.Name, state.CenterPoint, state.TotalDistance, event)}
                    width={state.Zone.Size.Width.toString()} height={state.Zone.Size.Height.toString()}></circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" textAnchor="middle" x="50%" y="50%">comfort</text>
        </g>;
};
