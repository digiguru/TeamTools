import * as React from "react";
import { connect } from "react-redux";
import {BouncyAnimation, Events} from "./SVGHelper";
import {ChaosPickerState, ChaosPickerZoneState} from "./ComfortReactModelState";
import { selectUser, chooseZone, toggleChoiceVisibility } from "./Models/ComfortActions";
import {ReduxChaosConnector, ReduxStretchConnector, ReduxComfortConnector} from "./ComfortReactZoneConnector";
import {ReduxUserConnector} from "./UserListConnector";
import {ReduxUserHistoryConnector} from "./UserHistoryConnector";
import { ReduxUserHistory, ReduxUserHistoryArea } from "./ReactUserHistory";
import { StageConnector } from "./ComfortReduxZone";
/*
        <g id="users">
        </g>

        <ReduxUserConnector />
*/
export const ReduxComfortApp = () => (
    <StageConnector>
        <ReduxChaosConnector Name="Chaos" />
        <ReduxStretchConnector Name="Stretch" />
        <ReduxComfortConnector Name="Comfort" />
        <ReduxUserConnector />
        <ReduxUserHistoryConnector />
    </StageConnector>
);
