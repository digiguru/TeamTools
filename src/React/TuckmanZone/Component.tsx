import * as React from "react";

import { ITuckmanZone, ITuckmanZoneEvents } from "./Model";
import { BouncyAnimation } from "../Animation/Component";

export const TuckmanZone = (state: ITuckmanZone) => { // , onZoneUnfocus, onZoneClick, onZoneActive) => (
    const index  = state.index || 0;
    const textID = state.label + "-label";
    const textOffset : string = 12 + (25 * state.index) + "%";
    const delay      : string = (0.2 * state.index) + "s";
    const className  : string = state.focus + " area okay js-area-standard";
    let   offset     : string = (25 * state.index) + "%";
    let   initialX   : string = "0%";


    if (state.visibility === "hiding") {
        initialX = offset;
        offset   = "100%";
    }

    /*return <g>
        <rect className={className} id={state.label}
            onMouseUp={state.events.onMouseUp}
            onMouseDown={state.events.onMouseDown}
            onMouseEnter={state.events.onMouseEnter}
            onMouseLeave={state.events.onMouseLeave}
            x="0" y="0" width="25%" height="100%">
            <BouncyAnimation attributeName="x"  value={offset} delay={delay} />
        </rect>
        <text className="area-label" id={textID} textAnchor="middle" x={textOffset} y="50%">{state.label}</text>;
    </g>;*/
    return <g>
        <rect className={className} id={state.label}
            onMouseEnter={() => state.Events.onZoneOverFocus(state.label)}
            onMouseLeave={() => state.Events.onZoneOffFocus(state.label)}
            onMouseDown={() => state.Events.onZoneMouseDown(state.label)}
            onMouseUp={(event) => state.Events.onZoneMouseUp(state.username, state.label, state.maxWidth, event)}
            x={initialX} y="0" width="25%" height="100%">
            <BouncyAnimation attributeName="x"  value={offset} delay={delay} />
        </rect>
        <text className="area-label" id={textID} textAnchor="middle" x={textOffset} y="50%">{state.label}</text>;
    </g>;
};
