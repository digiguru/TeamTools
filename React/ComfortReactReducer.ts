
import {ComfortActions} from "ComfortActions";
import {ChaosPickerZoneState, ChaosPickerState, DOMMeasurement} from "ComfortReactModelState";
import { fromJS, List, Map } from "immutable";


const initialState: ChaosPickerState = {
    UserList : [],
    Zones : {
        Comfort: {Name: "Comfort", Focus: false, Range: {Start: 0, End: 100}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Stretch: {Name: "Stretch", Focus: false, Range: {Start: 100, End: 200}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Chaos: {Name: "Chaos", Focus: false, Range: {Start: 200, End: 300}, Size: {Width: new DOMMeasurement("100%"), Height: new DOMMeasurement("100%")}}
    },
    ShowUserChoices: false,
    UserChoices: []
};
export function comfortReactApp(state: ChaosPickerState = initialState, action): ChaosPickerState {
    switch (action.type) {
        case ComfortActions.SET_FOCUS:
            return ComfortZoneAction.setFocus(state, (<any>action).area);
        case ComfortActions.SET_UNFOCUS:
            return ComfortZoneAction.setUnfocus(state, (<any>action).area);
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
    static setFocus(state: ChaosPickerState, area: "Chaos" | "Stretch" | "Comfort"): ChaosPickerState {
        // Set focus to true on this zone, and all others to false.
        return fromJS(state)
            .setIn(["Zones", "Comfort", "Focus"], (area === "Comfort"))
            .setIn(["Zones", "Stretch", "Focus"], (area === "Stretch"))
            .setIn(["Zones", "Chaos", "Focus"], (area === "Chaos")).toJS();
    }
    static setUnfocus(state: ChaosPickerState, area: "Chaos" | "Stretch" | "Comfort"): ChaosPickerState {
        // Set focus to true on this zone, and all others to false.
        if ((area === "Comfort")) {
            return fromJS(state).setIn(["Zones", "Comfort", "Focus"], false).toJS();
        } else if ((area === "Stretch")) {
            return fromJS(state).setIn(["Zones", "Stretch", "Focus"], false).toJS();
        } else if ((area === "Chaos")) {
            return fromJS(state).setIn(["Zones", "Chaos", "Focus"], false).toJS();
        }
    }
    static selectUser(state: ChaosPickerState, user: String): ChaosPickerState {
        // Sets currentUser, and therefor hides the user choice menu
        /*return Object.assign({}, state, {
            CurrentUser: user,
            ShowUserChoices: false
        });*/
        const data = Map(state)
            .set("CurrentUser", user)
            .set("ShowUserChoices", false);
        return data.toJS();
    }

    static chooseZone(state: ChaosPickerState, user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number): ChaosPickerState {
         // Adds to UserChoices, and sets currentUser to empty
        const data = state.UserChoices.push({
                User: user,
                Zone: area,
                Distance: distance
            });
        return Map(state)
            .delete("CurrentUser")
            .set("UserChoices", data).toJS();
    }
    static toggleChoiceVisibility(state: ChaosPickerState, visible: Boolean): ChaosPickerState {
        // Set "showUserChoices" to true
        return Map(state)
            .set("ShowUserChoices", visible).toJS();
    };
}