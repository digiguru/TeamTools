import { IDOMMeasurement } from "../Models/IDomMeasurement";
import { IStage } from "../Stage/Model";
import { IUserList, IUser } from "../User/Model";

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
    zones: Array<ITuckmanZone>;
    CurrentUser?: IUser;
    UserList: IUserList;
    UserChoices: Array<ITuckmanUserChoiceState>;
};
export interface ITuckmanZone {
    focus: string;
    index: number;
    label: "forming" | "storming" | "norming" | "performing";
    events: any;
}
export interface ITuckmanUserChoiceState {
    user: IUser;
    zone: "forming" | "storming" | "norming" | "performing";
    distance: number;
}