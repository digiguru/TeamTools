import * as React from "react";

export class BouncyAnimation extends React.Component<any, any> {
     render() {
         const delay       = this.props.delay || "0s";
         const duration    = this.props.duration || "0.8s";
         const toValue     = parseInt(this.props.value || (20), 10);
         const toValueType = this.props.valueType || "%";
         const values      = [
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
