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
            <text className="area-label" id="label-choas" text-anchor="middle" textAnchor="middle" x="50%" y="20">chaos</text>
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
            <circle 
                onMouseEnter={this._onMouseEnter} 
                onMouseLeave={this._onMouseLeave} 
                className={className} id="stretch" r="0%" cx="50%" cy="50%">
                {this.props.children}
            </circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" textAnchor="middle" x="50%" y="20%">stretch</text>
        </g>;
    }
}
export class BouncyAnimation extends React.Component<any, any> {
     render() {
         const delay = this.props.delay || "0s";
         const duration = this.props.duration || "0.8s";
         const toValue = parseInt(this.props.value || (20), 10);
         const toValueType = this.props.valueType || "%";
         const values = [
            0 + toValueType,
            (toValue + toValue / 4) + toValueType,
            (toValue - toValue / 10) + toValueType,
            (toValue + toValue / 20) + toValueType,
            (toValue) + toValueType,
         ];
         const valuesToString = values.join(";");
         return <animate attributeType="XML" attributeName="r" from="0%" to="20%" 
                    dur={duration} 
                    begin={delay} 
                    values={valuesToString}
                    keyTimes="0; 0.3; 0.6; 0.8; 1"
                    fill="freeze"
                    />;
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
        //const startValue = 0 || this.props.value;
        const value = this.props.value || 20;
        return <g>
            <circle onMouseEnter={this._onMouseEnter}
                onMouseLeave={this._onMouseLeave}
                className={className} id="comfort" r="0%" cx="50%" cy="50%">
                {this.props.children}
            </circle>
            <text className="area-label" id="label-comfort" text-anchor="middle" textAnchor="middle" x="50%" y="50%">comfort</text>
        </g>;
        // keySplines=".42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;" 
    
    }
}
export class Stage extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            width: "800",
            height: "800"
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
                        <StretchArea><BouncyAnimation value="45" /></StretchArea>
                        <ComfortArea><BouncyAnimation value="20" delay="0.5s" /></ComfortArea>
                    </g>
                    <g id="history">
                    </g>
                </Stage>;
                //         <rect id="clickable" width="100%" height="100%" fill-opacity="0.0"></rect>
            
    }

}