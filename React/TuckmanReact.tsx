import * as React from "react";
import {Stage, BouncyAnimation} from "./SVGHelper";

export class ChartArea extends React.Component<any, any> {

    render() {
        const index = parseInt(this.props.index || 0, 10);
        const label = this.props.label || 0;
        const   textID = label + "-label";
        const width:number = parseInt(this.props.width, 10);
        const  offset:string = (25 * index) + "%";
        const  textOffset:string = 12 + (25 * index) + "%";
        const delay:string = (0.2 * index) + "s";
        return <g>
            <rect className="not-in-focus area js-area-standard" id={label} x="0" y="0" width="25%" height="100%">
                <BouncyAnimation attributeName="x"  value={offset} delay={delay} />
            </rect>
            <text className="area-label" id={textID} textAnchor="middle" text-anchor="middle" x={textOffset} y="50%">{label}</text>;
        </g>;
    }

}

export class TuckmanComponent extends React.Component<any, any> {

    render() {
        return <Stage>
                    <g id="zones">
                        <ChartArea label="forming"  index="0" />
                        <ChartArea label="storming" index="1" />
                        <ChartArea label="norming"   index="2" />
                        <ChartArea label="performing" index="3" />
                    </g>
                </Stage>;
                //         <rect id="clickable" width="100%" height="100%" fill-opacity="0.0"></rect>
    }

}
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
