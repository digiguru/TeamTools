
import {ComfortActions} from "ComfortActions";
import {Focus, ChaosPickerZoneState, ChaosPickerState, DOMMeasurement} from "ComfortReactModelState";
import { fromJS, List, Map } from "immutable";

const initialState: ChaosPickerState = {
    UserList : ["Adam Hall", "Caroline Hall"],
    Zones : {
        Comfort: {Name: "Comfort", Focus: Focus.Off, Range: {Start: 0, End: 100}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Stretch: {Name: "Stretch", Focus: Focus.Off, Range: {Start: 100, End: 200}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Chaos: {Name: "Chaos", Focus: Focus.Off, Range: {Start: 200, End: 300}, Size: {Width: new DOMMeasurement("100%"), Height: new DOMMeasurement("100%")}}
    },
    ShowUserChoices: false,
    UserChoices: []
};
export function comfortReactApp(state: ChaosPickerState = initialState, action): ChaosPickerState {
    switch (action.type) {
        case ComfortActions.SET_OVERFOCUS:
            return ComfortZoneAction.setOverFocus(state, (<any>action).area);
        case ComfortActions.SET_OFFFOCUS:
            return ComfortZoneAction.setOffFocus(state, (<any>action).area);
        case ComfortActions.SET_ACTIVEFOCUS:
            return ComfortZoneAction.setActiveFocus(state, (<any>action).area);
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
    static setOverFocus(state: ChaosPickerState, area: "Chaos" | "Stretch" | "Comfort"): ChaosPickerState {
        // Set focus to true on this zone, and all others to false.
        return fromJS(state)
            .setIn(["Zones", "Comfort", "Focus"], area === "Comfort" ? Focus.Over : Focus.Off)
            .setIn(["Zones", "Stretch", "Focus"], area === "Stretch"  ? Focus.Over : Focus.Off)
            .setIn(["Zones", "Chaos", "Focus"], area === "Chaos"  ? Focus.Over : Focus.Off).toJS();
    }
    static setActiveFocus(state: ChaosPickerState, area: "Chaos" | "Stretch" | "Comfort"): ChaosPickerState {
        // Set focus to true on this zone, and all others to false.
        return fromJS(state)
            .setIn(["Zones", "Comfort", "Focus"], area === "Comfort" ? Focus.Active : Focus.Off)
            .setIn(["Zones", "Stretch", "Focus"], area === "Stretch"  ? Focus.Active : Focus.Off)
            .setIn(["Zones", "Chaos", "Focus"], area === "Chaos"  ? Focus.Active : Focus.Off).toJS();
    }
    static setOffFocus(state: ChaosPickerState, area: "Chaos" | "Stretch" | "Comfort"): ChaosPickerState {
        // Set focus to true on this zone, and all others to false.
        if ((area === "Comfort")) {
            return fromJS(state).setIn(["Zones", "Comfort", "Focus"], Focus.Off).toJS();
        } else if ((area === "Stretch")) {
            return fromJS(state).setIn(["Zones", "Stretch", "Focus"], Focus.Off).toJS();
        } else if ((area === "Chaos")) {
            return fromJS(state).setIn(["Zones", "Chaos", "Focus"], Focus.Off).toJS();
        }
        return state;
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
        
        // Add the user choice
        const newUserChoices = fromJS(state.UserChoices).push({
            User: user,
            Zone: area,
            Distance: distance
        });
        // Remove the user from the choice list
        const newUserList = List(state.UserList).filter((item) => item !== user);
        // Show the user list
        const showUserChoice = newUserList.count();
        // Return
        return Map(state)
            .delete("CurrentUser")
            .set("ShowUserChoices", showUserChoice)
            .set("UserChoices", newUserChoices)
            .set("UserList", newUserList).toJS();
    }
    static toggleChoiceVisibility(state: ChaosPickerState, visible: Boolean): ChaosPickerState {
        // Set "showUserChoices" to true
        return Map(state)
            .set("ShowUserChoices", visible).toJS();
    };
}