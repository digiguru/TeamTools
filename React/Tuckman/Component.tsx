import * as React from "react";
import { Stage } from "../Stage/Component";
import { BouncyAnimation } from "../Animation/Component";
import { ITuckmanModel, ITuckmanZone } from "./Model";
import { StageConnector } from "../Stage/Connector";
/*state = focus: "not-in-focus",
            width: props.width || "100%",
            height: props.height || "100%",
            onMouseEnter: Events.mouseEnter.bind(this),
            onMouseLeave: Events.mouseLeave.bind(this),
            onMouseUp: Events.mouseUp.bind(this),
            onMouseDown: Events.mouseDown.bind(this) */
export const TuckmanApp = () => {
    return <StageConnector>
        <TuckmanStage />
    </StageConnector>;
};

export const TuckmanStage = (state: ITuckmanModel) => {
    const mod: ITuckmanModel = state;
    const perf: ITuckmanZone = mod.zones.performing;
    return <g id="zones">
                <TuckmanZone label="performing" index={3} {...mod.zones.performing} />
                <TuckmanZone label="norming"    index={2} {...mod.zones.norming} />
                <TuckmanZone label="storming"   index={1} {...mod.zones.storming} />
                <TuckmanZone label="forming"    index={0} {...mod.zones.forming} />
            </g>;
};

export const TuckmanZone = (state: ITuckmanZone) => { // , onZoneUnfocus, onZoneClick, onZoneActive) => (
    const index  = state.index || 0;
    const textID = state.label + "-label";

    const offset    : string = (25 * state.index) + "%";
    const textOffset: string = 12 + (25 * state.index) + "%";
    const delay     : string = (0.2 * state.index) + "s";
    const className : string = state.focus + " area okay js-area-standard";

    /*return <g>
        <rect className={className} id={state.label}
            onMouseUp={state.events.onMouseUp}
            onMouseDown={state.events.onMouseDown}
            onMouseEnter={state.events.onMouseEnter}
            onMouseLeave={state.events.onMouseLeave}
            x="0" y="0" width="25%" height="100%">
            <BouncyAnimation attributeName="x"  value={offset} delay={delay} />
        </rect>
        <text className="area-label" id={textID} textAnchor="middle" text-anchor="middle" x={textOffset} y="50%">{state.label}</text>;
    </g>;*/

    return <g>
        <rect className={className} id={state.label}
            x="0" y="0" width="25%" height="100%">
            <BouncyAnimation attributeName="x"  value={offset} delay={delay} />
        </rect>
        <text className="area-label" id={textID} textAnchor="middle" text-anchor="middle" x={textOffset} y="50%">{state.label}</text>;
    </g>;
};

/*
<svg id="stage" width="800" height="800">
            <g id="assets" fill-opacity="0.0">
                <path id="asset-tick" stroke-miterlimit="4" stroke-width="0" stroke="#007f00" fill="#007f00" d="m216.77742,285.47641l89.687332,115.132935c45.697845,-103.041046 101.639099,-197.834396 191.554749,-287.832077c-67.294983,42.004333 -141.475403,121.768204 -204.841431,220.466995l-76.40065,-47.767853z"></path>
            </g>



            <g id="zones">
                <rect class="area js-area-standard" id="storming" x="200" y="0" width="200" height="800"></rect>
                <rect class="area js-area-standard" id="norming" x="400" y="0" width="200" height="800"></rect>
                <rect class="area js-area-standard" id="performing" x="600" y="0" width="200" height="800"></rect>
            </g>
            <g id="history">
            </g>
            <text class="area-label" id="label-storming" text-anchor="middle" x="300" y="400">storming</text>
            <text class="area-label" id="label-norming" text-anchor="middle" x="500" y="400">norming</text>
            <text class="area-label" id="label-performing" text-anchor="middle" x="700" y="400">performing</text>

            <rect id="clickable" width="800" height="800" fill-opacity="0.0"></rect>
            <g id="users" transform="">

            <g id="user0" class="user-group"><rect y="60" x="0" width="800" height="90" data-name="asdsa" data-id="user0"></rect><text class="username" y="120" x="60" data-name="asdsa" style="font-size: 60px; font-family: &quot;Share Tech Mono&quot;; fill: rgb(128, 128, 128);">asdsa</text></g><g id="user1" class="user-group"><rect y="150" x="0" width="800" height="90" data-name="asd" data-id="user1"></rect><text class="username" y="210" x="60" data-name="asd" style="font-size: 60px; font-family: &quot;Share Tech Mono&quot;; fill: rgb(128, 128, 128);">asd</text></g><g id="user2" class="user-group"><rect y="240" x="0" width="800" height="90" data-name="sadasd" data-id="user2"></rect><text class="username" y="300" x="60" data-name="sadasd" style="font-size: 60px; font-family: &quot;Share Tech Mono&quot;; fill: rgb(128, 128, 128);">sadasd</text></g></g>
        </svg>
        */
