import * as React from "react";
import {ReduxChaosConnector, ReduxStretchConnector, ReduxComfortConnector} from "../ComfortZone/Connector";
import {ReduxUserConnector} from "../User/Connector";
import {ReduxUserHistoryConnector} from "../ComfortUserChoice/Connector";
import { StageConnector } from "../Stage/Connector";

export const ComfortStage = (state) => (
   <g>
        <g>
            <ReduxChaosConnector   Name="Chaos" />
            <ReduxStretchConnector Name="Stretch" />
            <ReduxComfortConnector Name="Comfort" />
            <ReduxUserConnector />
            <ReduxUserHistoryConnector />
        </g>,
        <button id="show-tuckman" onMouseUp={state.onShow}>show tuckman</button>,
        <button id="hide-tuckman" onMouseUp={state.onHide}>hide tuckman</button>
    </g>
);
