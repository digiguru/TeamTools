
import {ComfortActions} from "./ComfortActions";
import {ChaosPickerZoneState, ChaosPickerState, DOMMeasurement} from "./ComfortReactModelState";
import { fromJS, List, Map } from "../3rdParty/immutable.min";
import { Point } from "./Point";

const initialState: ChaosPickerState = {
    CenterPoint: new Point(400, 400),
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
export function comfortReactApp(state: ChaosPickerState = initialState, action): ChaosPickerState {
    console.log(action.type, action);
    switch (action.type) {
        case ComfortActions.SET_USERFOCUS:
            return ComfortZoneAction.setUserFocus(state, (<any>action).user, (<any>action).focus);
        case ComfortActions.SET_ZONEFOCUS:
            return ComfortZoneAction.setZoneFocus(state, (<any>action).area, (<any>action).focus);
        case ComfortActions.SELECT_USER:
            return ComfortZoneAction.selectUser(state, (<any>action).user);
        case ComfortActions.CHOOSE_ZONE:
            return ComfortZoneAction.chooseZone(state, (<any>action).user, (<any>action).area, (<any>action).distance, (<any>action).centerPoint);
        case ComfortActions.TOGGLE_CHOICES:
            return ComfortZoneAction.toggleChoiceVisibility(state, (<any>action).visible);
        default:
            return state;
    }
}
class ComfortZoneAction {
    static setZoneFocus(state: ChaosPickerState, area: "Chaos" | "Stretch" | "Comfort", focus: "in-focus" | "active" | "not-in-focus"): ChaosPickerState {
        return fromJS(state)
            .setIn(["Zones", "Comfort", "Focus"], area === "Comfort" ? focus : "not-in-focus")
            .setIn(["Zones", "Stretch", "Focus"], area === "Stretch"  ? focus : "not-in-focus")
            .setIn(["Zones", "Chaos", "Focus"], area === "Chaos"  ? focus : "not-in-focus").toJS();
    }
    static setUserFocus(state: ChaosPickerState, user: string, focus: "in-focus" | "active" | "not-in-focus"): ChaosPickerState {
        const originalList = List(state.UserList.Users);
        const newUserList = originalList.update(
            originalList.findIndex(item => item.Username === user),
            (item) => fromJS(item).set("Focus", focus)).toJS();
        return fromJS(state)
            .setIn(["UserList", "Users"], newUserList).toJS();
    }
    static selectUser(state: ChaosPickerState, user: String): ChaosPickerState {
        // Sets currentUser, and therefor hides the user choice menu
        /*return Object.assign({}, state, {
            CurrentUser: user,
            ShowUserChoices: false
        });*/
        const data = fromJS(state)
            .set("CurrentUser", user)
            .set("ShowUserChoices", false)
            .setIn(["UserList", "ShowUsers"], false);

        return data.toJS();
    }

    static chooseZone(state: ChaosPickerState, user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number, centerPoint: Point): ChaosPickerState {

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
            .set("CenterPoint", centerPoint)
            .set("ShowUserChoices", showUserChoice)
            .set("UserChoices", newUserChoices)
            .setIn(["UserList", "Users"], newUserList)
            .setIn(["UserList", "ShowUsers"], showUserChoice).toJS();
    }
    static toggleChoiceVisibility(state: ChaosPickerState, visible: boolean): ChaosPickerState {
        // Set "showUserChoices" to true
        return Map(state)
            .set("ShowUserChoices", visible).toJS();
    };
}