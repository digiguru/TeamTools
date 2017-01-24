import * as React from "react";

const 
    styleChaos = {
        fill: "rgb(0, 180, 219)"
    },
    styleStretch = {
        fill: "rgb(0, 215, 254);"
    },
    styleComfot = {
        fill: "rgb(0, 215, 254);"
    }

export default class ComfortReact extends React.Component<any,any> {

  render() {
    return <svg id="stage" width="800" height="800">
            <rect className="area js-area-standard" id="chaos" width="800" height="800" style="{styleChaos}"></rect>


            <g id="zones">
                <circle className="area js-area-standard" id="stretch" r="300.12599083141845" cx="400" cy="400"  style="{styleStretch}"></circle>
                <circle className="area js-area-standard" id="comfort" r="97.516770592797" cx="400" cy="400" style="{styleComfort}"></circle>
            </g>
            <g id="history">
            </g>
            <text className="area-label" id="label-choas" text-anchor="middle" x="400" y="50">chaos</text>
            <text className="area-label" id="label-stretch" text-anchor="middle" x="400" y="200">stretch</text>
            <text className="area-label" id="label-comfort" text-anchor="middle" x="400" y="400">comfort</text>
            <rect id="clickable" width="800" height="800" fill-opacity="0.0"></rect>
        </svg>;
  }

}