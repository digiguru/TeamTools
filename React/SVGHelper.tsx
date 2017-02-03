
import * as React from "react";
import {Point} from "Point";
/*require(["../Coords/Polar"], (u) => {
    console.log(new u.Polar(1,20));
});*/
//const r = new Polar(1,20);

export class SVGEvents {
    public static getDistnace(x: number, y: number, target: SVGElement) {
        return Point.distance(new Point(x, y), SVGEvents.getCenter(target));
    }
    public static getCenter(target: SVGElement) {
        const rect = target.getBoundingClientRect();
        return new Point(
            rect.left + (rect.width / 2),
            rect.top + (rect.height / 2)
        )
        /*
        return {
            x:rect.left + (rect.width / 2),
            y:rect.top + (rect.height / 2)
        }
        */
    }
}

export class Events {

    public static mouseEnter() {
        this.setState({focus: "in-focus"});
    }

    public static mouseDown() {
        this.setState({focus: "active"});
    }

    public static mouseUp(a) {
        console.log(SVGEvents.getCenter(a.target));
        this.setState({focus: "not-in-focus"});
    }

    public static mouseLeave() {
        this.setState({focus: "not-in-focus"});
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
        return <svg id="stage" width={this.state.width} height={this.state.height}>
            {this.props.children}
        </svg>;
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
         return <animate attributeType="XML" attributeName={this.props.attributeName} from="0%" to="20%"
                    dur={duration}
                    begin={delay}
                    values={valuesToString}
                    keyTimes="0; 0.3; 0.6; 0.8; 1"
                    fill="freeze"
                    />;
     }
}
