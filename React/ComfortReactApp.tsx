import * as React from "react";
import { connect } from "react-redux";
import {Stage, BouncyAnimation, Events} from "./SVGHelper";
import {ChaosPickerState, ChaosPickerZoneState} from "ComfortReactModelState";
import { selectUser, chooseZone, toggleChoiceVisibility } from "ComfortActions";
import {ReduxChaosConnector, ReduxStretchConnector, ReduxComfortConnector} from "ComfortReactZoneConnector";
import {ReduxUserConnector} from "UserListConnector";

/*
        <g id="users">
        </g>

        <ReduxUserConnector />
*/
export const ReduxComfortApp = () => (
    <Stage>
        <ReduxChaosConnector Name="Chaos" />
        <ReduxStretchConnector Name="Stretch" />
        <ReduxComfortConnector Name="Comfort" />
        <ReduxUserConnector />
    </Stage>
);

/*
export class ChaosArea extends React.Component<any, IResizableInteractiveModelState> {
     constructor(props: IResizableMouseEvents) {
        super(props);
        this.props.onMouseEnter = Events.mouseEnter.bind(this);
        this.props.onMouseLeave = Events.mouseLeave.bind(this);
        this.props.onMouseUp = Events.mouseUp.bind(this);
        this.props.onMouseDown = Events.mouseDown.bind(this);
        this.state = {
            focus: "not-in-focus",
            width: props.width || "100%",
            height: props.height || "100%",
        };
    }
    render() {
        const className: string = this.state.focus + " area js-area-standard";
        return <g>
            <rect id="chaos" className={className}
                onMouseUp={this.props.onMouseUp}
                onMouseDown={this.props.onMouseDown}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                width={this.state.width} height={this.state.height}></rect>
            <text className="area-label" id="label-chaos" text-anchor="middle" textAnchor="middle" x="50%" y="20">chaos</text>
        </g>;
    }
}

export class StretchArea extends React.Component<any, IResizableInteractiveModelState> {
    constructor(props: IResizableMouseEvents) {
        super(props);

        this.props.onMouseEnter = Events.mouseEnter.bind(this);
        this.props.onMouseLeave = Events.mouseLeave.bind(this);
        this.props.onMouseUp = Events.mouseUp.bind(this);
        this.props.onMouseDown = Events.mouseDown.bind(this);

        this.state = {
            focus: "not-in-focus",
            width: props.width || "100%",
            height: props.height || "100%"
        };
    }

    render() {
        const className: string = this.state.focus + " area js-area-standard";
        return <g>
            <circle
                onMouseUp={this.props.onMouseUp}
                onMouseDown={this.props.onMouseDown}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                className={className} id="stretch" r="0%" cx="50%" cy="50%">
                {this.props.children}
            </circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" textAnchor="middle" x="50%" y="20%">stretch</text>
        </g>;
    }
}

export class ComfortArea extends React.Component<any, IResizableInteractiveModelState> {
     constructor(props: IResizableMouseEvents) {
        super(props);

        this.props.onMouseEnter = Events.mouseEnter.bind(this);
        this.props.onMouseLeave = Events.mouseLeave.bind(this);
        this.props.onMouseUp = Events.mouseUp.bind(this);
        this.props.onMouseDown = Events.mouseDown.bind(this);
        this.state = {
            focus: "not-in-focus",
            width: props.width || "100%",
            height: props.height || "100%"
        };
    }

    render() {
        const className: string = this.state.focus + " area js-area-standard";
        // const startValue = 0 || this.props.value;
        const value = this.props.value || 20;
        return <g>
            <circle
                onMouseUp={this.props.onMouseUp}
                onMouseDown={this.props.onMouseDown}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                className={className} id="comfort" r="0%" cx="50%" cy="50%">
                {this.props.children}
            </circle>
            <text className="area-label" id="label-comfort" text-anchor="middle" textAnchor="middle" x="50%" y="50%">comfort</text>
        </g>;
        // keySplines=".42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;" 
    }
}*/

