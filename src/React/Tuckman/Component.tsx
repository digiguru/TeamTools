import * as React from "react";
import { ITuckmanModel } from "./Model";
import { ReduxUserConnector } from "../User/Connector";
import { ITuckmanZone } from "../TuckmanZone/Model";
import { TuckmanZoneConnector } from "../TuckmanZone/Connector";
import { TuckmanUserHistoryConnector } from "../TuckmanUserChoice/Connector";


export const TuckmanStage = (state: ITuckmanModel) => {
    return <g>
                <g id="zones">
                    <TuckmanZoneConnector label="performing"  />
                    <TuckmanZoneConnector label="norming"     />
                    <TuckmanZoneConnector label="storming"    />
                    <TuckmanZoneConnector label="forming"     />
                </g>
                <ReduxUserConnector />
                <TuckmanUserHistoryConnector />
        <button id="show-tuckman" onMouseUp={state.onShow}>show tuckman</button>
        <button id="hide-tuckman" onMouseUp={state.onHide}>hide tuckman</button>
    </g>;
};
