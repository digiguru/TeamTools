import * as React from "react";
import { connect } from "react-redux";
import {BouncyAnimation, Events} from "../SVGHelper";
import {ComfortAppState} from "./Model";
import { selectUser, chooseZone, toggleChoiceVisibility } from "./Actions";
import {ReduxChaosConnector, ReduxStretchConnector, ReduxComfortConnector} from "../ComfortZone/Connector";
import {ReduxUserConnector} from "../User/Connector";
import {ReduxUserHistoryConnector} from "../ComfortUserChoice/Connector";
import { ReduxUserHistory, ReduxUserHistoryArea } from "../ComfortUserChoice/Component";
import { StageConnector } from "../ComfortZone/Component";

export const ComfortApp = () => (
    <StageConnector>
        <ReduxChaosConnector Name="Chaos" />
        <ReduxStretchConnector Name="Stretch" />
        <ReduxComfortConnector Name="Comfort" />
        <ReduxUserConnector />
        <ReduxUserHistoryConnector />
    </StageConnector>
);
