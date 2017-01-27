import * as React from "react";

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

export class ChaosArea extends React.Component<any, IResizableInteractiveModelState> {
     constructor(props) {
        super(props);
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
        this.state = {
            focus: "not-in-focus",
            width: props.width || "100%",
            height: props.height || "100%"
        };
    }

    _onMouseEnter() {
        this.setState({focus: "in-focus"});
    }

    _onMouseLeave() {
        this.setState({focus: "not-in-focus"});
    }

    render() {
        const className: string = this.state.focus + " area js-area-standard";
        return <g>
            <rect className={className} onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave} id="chaos" width={this.state.width} height={this.state.height}></rect>
            <text className="area-label" id="label-choas" text-anchor="middle" x="50%" y="50">chaos</text>
        </g>;
    }
}

export class StretchArea extends React.Component<any, IResizableInteractiveModelState> {
    constructor(props) {
        super(props);

        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);

        this.state = {
            focus: "not-in-focus",
            width: props.width || "100%",
            height: props.height || "100%"
        };
    }

    _onMouseEnter() {
        this.setState({focus: "in-focus"});
    }

    _onMouseLeave() {
        this.setState({focus: "not-in-focus"});
    }

    render() {
        const className: string = this.state.focus + " area js-area-standard";
        return <g>
            <circle onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave} className={className} id="stretch" r="33%" cx="50%" cy="50%"></circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" x="50%" y="25%">stretch</text>
        </g>;
    }
}

export class ComfortArea extends React.Component<any, IResizableInteractiveModelState> {
     constructor(props) {
        super(props);

        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);

        this.state = {
            focus: "not-in-focus",
            width: props.width || "100%",
            height: props.height || "100%"
        };
    }

    _onMouseEnter() {
        this.setState({focus: "in-focus"});
    }

    _onMouseLeave() {
        this.setState({focus: "not-in-focus"});
    }

    render() {
        const className: string = this.state.focus + " area js-area-standard";
        return <g>
            <circle onMouseEnter={this._onMouseEnter}
                onMouseLeave={this._onMouseLeave}
                className={className} id="comfort" r="35%" cx="50%" cy="50%"></circle>
            <text className="area-label" id="label-comfort" text-anchor="middle" x="50%" y="50%">comfort</text>
        </g>;
    }
}
export class Stage extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            width: "100%",
            height: "100%"
        };
    }

    render() {
        return <svg id="stage" width={this.state.width} height={this.state.height}>{this.props.children}</svg>;
    }
}
export class ComfortReact extends React.Component<any, any> {

    render() {
        return <Stage>
                    <ChaosArea />
                    <g id="zones">
                        <StretchArea />
                        <ComfortArea />
                    </g>
                    <g id="history">
                    </g>
                    <rect id="clickable" width="100%" height="100%" fill-opacity="0.0"></rect>
                </Stage>;
    }

}