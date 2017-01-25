import * as React from "react";

const 
    styleStandard: React.CSSProperties = {
        fill: "rgb(0, 215, 254);"
    },
    styleHighlight: React.CSSProperties = {
        fill: "rgb(0, 180, 219);"
    };

export interface iComfortState {
    style: React.CSSProperties;
}

export class ChaosArea extends React.Component<any, iComfortState> {
     constructor(props) {
        super(props);       
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);

        this.state = {style: styleStandard};
    }

    _onMouseEnter() {
        this.setState({style: styleHighlight});
    }

    _onMouseLeave() {
        this.setState({style: styleStandard});
    }

    render() {
        return <g>
            <rect className="area js-area-standard" id="chaos" width="800" height="800" style="{this.state.style}"></rect>
            <text className="area-label" id="label-choas" text-anchor="middle" x="400" y="50">chaos</text>
        </g>;
    }
}

export class StretchArea extends React.Component<any, iComfortState> {
    constructor(props) {
        super(props);       
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);

        this.state = {style: styleStandard};
    }

    _onMouseEnter() {
        this.setState({style: styleHighlight});
    }

    _onMouseLeave() {
        this.setState({style: styleStandard});
    }

    render() {
        return <g>
            <circle className="area js-area-standard" id="stretch" r="300.12599083141845" cx="400" cy="400"  style="{this.state.style}"></circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" x="400" y="200">stretch</text>
        </g>;
    }
}

export class ComfortArea extends React.Component<any, iComfortState> {
     constructor(props) {
        super(props);

        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);

        this.state = {style: styleStandard};
    }

    _onMouseEnter() {
        this.setState({style: styleHighlight});
    }

    _onMouseLeave() {
        this.setState({style: styleStandard});
    }

    render() {
        return <g>
            <circle className="area js-area-standard" id="comfort" r="97.516770592797" cx="400" cy="400" style="{this.state.style}"></circle>
            <text className="area-label" id="label-comfort" text-anchor="middle" x="400" y="400">comfort</text>
        </g>;
    }
}
export class Stage extends React.Component<any, any> {
    render() {
        return <svg id="stage" width="800" height="800">{this.props.children}</svg>;
    }
    public static  full(props) {
        return <svg id="stage" width="800" height="800">{props.children}</svg>;
    }
}
export class ComfortReact extends React.Component<any, iComfortState> {

    constructor(props) {
        super(props);
        this.state = {style: styleStandard};
    }

    _onMouseEnter() {
        this.setState({style: styleHighlight});
    }

    _onMouseLeave() {
        this.setState({style: styleStandard});
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
                    <rect id="clickable" width="800" height="800" fill-opacity="0.0"></rect>
                </Stage>;
    }

}