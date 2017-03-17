
import {ComfortActions} from "./Actions";
import {ComfortAppState} from "./Model";
import { fromJS, List, Map } from "immutable";
import { Point } from "../Models/Point";
import { Size } from "../Models/Size";
import { DOMMeasurement } from "../Models/IDomMeasurement";


const initialSize: Size = new Size(800, 800);
const initialState: ComfortAppState = {
    Size: initialSize,
    CenterPoint: new Point(initialSize.width / 2, initialSize.height / 2),
    UserList : {
        ShowUsers: true,
        Users: [
            {Username: "Adam Hall", Focus: "not-in-focus", Y: 0 },
            {Username: "Caroline Hall", Focus: "not-in-focus", Y: 0 }
        ]
    },
    Zones : {
        Comfort: {Name: "Comfort", Focus: "not-in-focus", Range: {Start: 0, End: 100}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Stretch: {Name: "Stretch", Focus: "not-in-focus", Range: {Start: 100, End: 200}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Chaos: {Name: "Chaos", Focus: "not-in-focus", Range: {Start: 200, End: 300}, Size: {Width: new DOMMeasurement("100%"), Height: new DOMMeasurement("100%")}}
    },
    ShowUserChoices: false,
    UserChoices: []
};
export function comfortReactApp(state: ComfortAppState = initialState, action): ComfortAppState {
    console.log(action.type, action);
    switch (action.type) {
        case ComfortActions.SET_STAGESIZE:
            return ComfortZoneAction.setStageSize(state, (<any>action).width, (<any>action).height);
        case ComfortActions.SET_USERFOCUS:
            return ComfortZoneAction.setUserFocus(state, (<any>action).user, (<any>action).focus);
        case ComfortActions.SET_ZONEFOCUS:
            return ComfortZoneAction.setZoneFocus(state, (<any>action).area, (<any>action).focus);
        case ComfortActions.SELECT_USER:
            return ComfortZoneAction.selectUser(state, (<any>action).user);
        case ComfortActions.CHOOSE_ZONE:
            return ComfortZoneAction.chooseZone(state, (<any>action).user, (<any>action).area, (<any>action).distance, (<any>action).x, (<any>action).y);
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
        // Sets currentUser, and therefor hides the user choice menu
        const data = fromJS(state)
            .set("CurrentUser", user)
            .set("ShowUserChoices", false)
            .setIn(["UserList", "ShowUsers"], false);

        return data.toJS();
    }

    static chooseZone(state: ComfortAppState, user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number, x: number, y:number): ComfortAppState {

        // Add the user choice
        const newUserChoices = List(state.UserChoices).push({
            User: user,
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
            .set("CenterPoint", new Point(x,y))
            .set("ShowUserChoices", showUserChoice)
            .set("UserChoices", newUserChoices)
            .setIn(["UserList", "Users"], newUserList)
            .setIn(["UserList", "ShowUsers"], showUserChoice).toJS();
    }
    static toggleChoiceVisibility(state: ComfortAppState, visible: boolean): ComfortAppState {
        // Set "showUserChoices" to true
        return Map(state)
            .set("ShowUserChoices", visible).toJS();
    };
}