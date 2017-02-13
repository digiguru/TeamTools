import * as React from "react";
import {Stage, BouncyAnimation, Events} from "./SVGHelper";
import {ChaosPickerState} from "ComfortReactModelState";


export interface IResizableModel {
    width: string;
    height: string;
}
export interface IInteractiveModelState {
    focus: string;
}
export interface IResizableInteractiveModelState extends IInteractiveModelState  {
    focus: string;
    width: string;
    height: string;
}
export interface IMouseEvents {
    onMouseEnter: any;
    onMouseLeave: any;
    onMouseUp: any;
    onMouseDown: any;
}
export interface IResizableMouseEvents extends IResizableModel, IMouseEvents {

}

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
            <text className="area-label" id="label-choas" text-anchor="middle" textAnchor="middle" x="50%" y="20">chaos</text>
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
}

export class ComfortReact extends React.Component<any, ChaosPickerState> {

    render() {
        return <Stage>
                    <ChaosArea />
                    <g id="zones">
                        <StretchArea><BouncyAnimation attributeName="r" value="45" /></StretchArea>
                        <ComfortArea><BouncyAnimation attributeName="r" value="20" delay="0.5s" /></ComfortArea>
                    </g>
                    <g id="history" display={this.props.ShowUserChoices}>
                    </g>
                </Stage>;
                //         <rect id="clickable" width="100%" height="100%" fill-opacity="0.0"></rect>
    }

}