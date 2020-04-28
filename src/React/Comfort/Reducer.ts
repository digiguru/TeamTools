
import {ComfortActions} from "./Actions";
import {ComfortAppState} from "./Model";
import { Point } from "../Models/Point";
import { Size } from "../Models/Size";
import { DOMMeasurement } from "../Models/IDomMeasurement";
import { IUser, IUserList } from "../User/Model";

const { fromJS, List, Map } = require('immutable');

const initialSize: Size = new Size(800, 800);
const initialState: ComfortAppState = {
    Size       : initialSize,
    CenterPoint: new Point(initialSize.width / 2, initialSize.height / 2),
    UserList   : {
    ShowUsers  : true,
    Users      : [
            {Username: "Adam Hall", Focus: "not-in-focus", Y: 0 },
            {Username: "Caroline Hall", Focus: "not-in-focus", Y: 0 }
        ]
    },
    Zones      : {
        Comfort: {Name: "Comfort", Focus: "not-in-focus", Range: {Start: 0, End: 33}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Stretch: {Name: "Stretch", Focus: "not-in-focus", Range: {Start: 34, End: 66}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Chaos  : {Name: "Chaos", Focus: "not-in-focus", Range: {Start: 67, End: 100}, Size: {Width: new DOMMeasurement("100%"), Height: new DOMMeasurement("100%")}}
    },
    ShowUserChoices: false,
    UserChoices    : []
};
export function comfortReducer(state: ComfortAppState = initialState, action): ComfortAppState {
    switch (action.type) {
        case ComfortActions.SET_USERLIST:
            return ComfortZoneAction.setUsers(state, (<any>action).userList);
        case ComfortActions.SET_STAGEVISIBILITY:
            return ComfortZoneAction.setVisibility(state, (<any> action).visibility);
        case ComfortActions.SET_STAGESIZE:
            return ComfortZoneAction.setStageSize(state, (<any>action).width, (<any>action).height);
        case ComfortActions.SET_USERFOCUS:
            return ComfortZoneAction.setUserFocus(state, (<any>action).user, (<any>action).focus);
        case ComfortActions.SET_ZONEFOCUS:
            return ComfortZoneAction.setZoneFocus(state, (<any>action).area, (<any>action).focus);
        case ComfortActions.SELECT_USER:
            return ComfortZoneAction.selectUser(state, (<any>action).user);
        case ComfortActions.CHOOSE_ZONE:
            return ComfortZoneAction.chooseZone(state, (<any>action).user, (<any>action).area, (<any>action).distance);
        case ComfortActions.TOGGLE_CHOICES:
            return ComfortZoneAction.toggleChoiceVisibility(state, (<any>action).visible);
        default:
            return state;
    }
}
class ComfortZoneAction {
    static setStageSize(state: ComfortAppState, width: number, height: number) {
        const newCenter = new Point(width / 2, height / 2);
        return fromJS(state)
            .set("Size", new Size(width, height))
            .set("CenterPoint", newCenter)
            .toJS();
    }
    static setVisibility(state: ComfortAppState, visibility: "hiding" | "appearing") {
        return fromJS(state)
            .setIn(["Zones", "Comfort", "visibility"], visibility)
            .setIn(["Zones", "Stretch", "visibility"], visibility)
            .setIn(["Zones", "Chaos", "visibility"], visibility).toJS();
        //  state.Zones.Chaos.visibility
    }

    static setZoneFocus(state: ComfortAppState, area: "Chaos" | "Stretch" | "Comfort", focus: "in-focus" | "active" | "not-in-focus"): ComfortAppState {
        return fromJS(state)
            .setIn(["Zones", "Comfort", "Focus"], area === "Comfort" ? focus : "not-in-focus")
            .setIn(["Zones", "Stretch", "Focus"], area === "Stretch"  ? focus : "not-in-focus")
            .setIn(["Zones", "Chaos", "Focus"], area === "Chaos"  ? focus : "not-in-focus").toJS();
    }

    static setUserFocus(state: ComfortAppState, user: string, focus: "in-focus" | "active" | "not-in-focus"): ComfortAppState {
        const originalList = List(state.UserList.Users);
        const newUserList = originalList.update(
            originalList.findIndex(item => item.Username === user),
            (item) => fromJS(item).set("Focus", focus)).toJS();
        return fromJS(state)
            .setIn(["UserList", "Users"], newUserList).toJS();
    }
    static selectUser(state: ComfortAppState, user: String): ComfortAppState {
        const originalList = List(state.UserList.Users);
        const item: IUser = originalList.find(item => item.Username === user);
        // Sets currentUser, and therefor hides the user choice menu
        const data = fromJS(state)
            .set("CurrentUser", item)
            .set("ShowUserChoices", false)
            .setIn(["UserList", "ShowUsers"], false);

        return data.toJS();
    }

    static setUsers(state: ComfortAppState, userList: IUserList): ComfortAppState {
        console.log("Input", state.UserList);
        console.log("Update", userList);

        const data = fromJS(state)
            .set("UserList", userList).toJS();
        console.log("Output", data.UserList);
        return data;
    }

    static chooseZone(
        state: ComfortAppState, user: string, area: "Chaos" | "Stretch" | "Comfort",
        distance: number): ComfortAppState {

        // Add the user choice
        const newUserChoices = List(state.UserChoices).push({
            User: {Username: user},
            Zone: area,
            Distance: distance
        }).toJS();
        // Remove the user from the choice list
        const newUserList = List(state.UserList.Users).filter((item) => item.Username !== user).toArray();
        // Show the user list
        const showUserChoice = !!(newUserList.length);
        // Return
        return fromJS(state)
            .delete("CurrentUser")
            .set("ShowUserChoices", showUserChoice)
            .set("UserChoices", newUserChoices)
            .setIn(["UserList", "Users"], newUserList)
            .setIn(["UserList", "ShowUsers"], showUserChoice).toJS();
    }
    static toggleChoiceVisibility(state: ComfortAppState, visible: boolean): ComfortAppState {
        // Set "showUserChoices" to true
        return Map(state)
            .set("ShowUserChoices", visible).toJS();
    }
}
