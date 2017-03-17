import * as React from "react";
import { connect } from "react-redux";
import {  ComfortAppState } from "../Comfort/Model";
import { Point } from "../Models/Point";
import { IComfortZoneConnectorWithEvents } from "./Model";


export const Stage = (state: ComfortAppState) => {
    const children = (state as any).children;
    return <svg id="stage" width={state.Size.width} height={state.Size.height}>
        {children}
    </svg>;
};

export const StageConnector = connect(
  (state) => {
    return state;
  }
)(Stage);


export const ReduxChaosArea = (state: IComfortZoneConnectorWithEvents) => { // , onZoneUnfocus, onZoneClick, onZoneActive) => (
    return <g>
        <rect id="chaos" className={state.Zone.Focus}
            onMouseEnter={() => state.Events.onZoneOverFocus(state.Zone.Name)}
            onMouseLeave={() => state.Events.onZoneOffFocus(state.Zone.Name)}
            onMouseDown={() => state.Events.onZoneMouseDown(state.Zone.Name)}
            onMouseUp={(event) => state.Events.onZoneMouseUp(state.User, state.Zone.Name, state.CenterPoint, event)}
            width={state.Zone.Size.Width.toString()} height={state.Zone.Size.Height.toString()}></rect>
        <text className="area-label" id="label-chaos" text-anchor="middle" textAnchor="middle" x="50%" y="20">chaos</text>
    </g>;
};

export const ReduxStretchArea = (state: IComfortZoneConnectorWithEvents) => {
    return <g>
            <circle
                className={state.Zone.Focus} id="stretch" r="33%" cx="50%" cy="50%"
                    onMouseEnter={() => state.Events.onZoneOverFocus(state.Zone.Name)}
                    onMouseLeave={() => state.Events.onZoneOffFocus(state.Zone.Name)}
                    onMouseDown={() => state.Events.onZoneMouseDown(state.Zone.Name)}
                    onMouseUp={(event) => state.Events.onZoneMouseUp(state.User, state.Zone.Name, state.CenterPoint, event)}
                    width={state.Zone.Size.Width.toString()} height={state.Zone.Size.Height.toString()}></circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" textAnchor="middle" x="50%" y="20%">stretch</text>
        </g>;
};

export const ReduxComfortArea = (state: IComfortZoneConnectorWithEvents) => {
    return <g>
            <circle
                className={state.Zone.Focus} id="stretch" r="15%" cx="50%" cy="50%"
                    onMouseEnter={() => state.Events.onZoneOverFocus(state.Zone.Name)}
                    onMouseLeave={() => state.Events.onZoneOffFocus(state.Zone.Name)}
                    onMouseDown={() => state.Events.onZoneMouseDown(state.Zone.Name)}
                    onMouseUp={(event) => state.Events.onZoneMouseUp(state.User, state.Zone.Name, state.CenterPoint, event)}
                    width={state.Zone.Size.Width.toString()} height={state.Zone.Size.Height.toString()}></circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" textAnchor="middle" x="50%" y="50%">comfort</text>
        </g>;
};
