import { IDOMMeasurement } from "../Models/IDomMeasurement";
import { IStage } from "../Stage/Model";

export interface ITuckmanModel extends IStage {
    /*focus: "not-in-focus",
    width: props.width || "100%",
    height: props.height || "100%",
    onMouseEnter: Events.mouseEnter.bind(this),
    onMouseLeave: Events.mouseLeave.bind(this),
    onMouseUp: Events.mouseUp.bind(this),
    onMouseDown: Events.mouseDown.bind(this)*/
    focus: string;
    events: any;
};
export interface ITuckmanZone {
    focus: string;
    index: number;
    label: string;
    events: any;
}