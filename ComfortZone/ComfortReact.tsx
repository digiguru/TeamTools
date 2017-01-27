import * as React from "react";

export interface iComfortState {
    style: React.CSSProperties;
    focus: string;
    width: string;
    height: string;
}

export class ChaosArea extends React.Component<any, iComfortState> {
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
        debugger;
        const style: string = this.state.focus + " area js-area-standard";
        return <g>
            <rect className={style} onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave} id="chaos" width={this.state.width} height={this.state.height}></rect>
            <text className="area-label" id="label-choas" text-anchor="middle" x="50%" y="50">chaos</text>
        </g>;
    }
}

export class StretchArea extends React.Component<any, iComfortState> {
    constructor(props) {
        super(props);

        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);

        this.state = {focus: "not-in-focus"};
    }

    _onMouseEnter() {
        this.setState({focus: "in-focus"});
    }

    _onMouseLeave() {
        this.setState({focus: "not-in-focus"});
    }

    render() {
        return <g>
            <circle onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave} className="area js-area-standard" id="stretch" r="33%" cx="50%" cy="50%"  style={this.state.style}></circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" x="50%" y="25%">stretch</text>
        </g>;
    }
}

export class ComfortArea extends React.Component<any, iComfortState> {
     constructor(props) {
        super(props);

        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);

        this.state = {focus: "not-in-focus"};
    }

    _onMouseEnter() {
        this.setState({focus: "in-focus"});
    }

    _onMouseLeave() {
        this.setState({focus: "not-in-focus"});
    }

    render() {
        return <g>
            <circle className="area js-area-standard" id="comfort" r="35%" cx="50%" cy="50%" style={this.state.style}></circle>
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

    constructor(props) {
        super(props);
        this.state = {focus: "not-in-focus"};
    }

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