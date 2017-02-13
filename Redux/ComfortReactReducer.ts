
import {ComfortActions} from "ComfortActions";
import {ChaosPickerZoneState, ChaosPickerState} from "ComfortReactModelState";
import { List, Map } from "immutable";


const initialState: ChaosPickerState = {
    UserList : List([]),
    Zones : List(<Array<ChaosPickerZoneState>>[ // all focus default to false
        {Name: "Comfort", Focus: false, Range: {Start: 0, End: 100}},
        {Name: "Stretch", Focus: false, Range: {Start: 100, End: 200}},
        {Name: "Chaos", Focus: false, Range: {Start: 200, End: 300}}
    ]),
    ShowUserChoices: false,
    UserChoices: List([])
};
export function comfortReactApp(state: ChaosPickerState = initialState, action): ChaosPickerState {
    switch (action.type) {
        case ComfortActions.SET_FOCUS:
            return ComfortZoneAction.setFocus(state, (<any>action).area);
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
        state.Zones = state.Zones.map((v, i) => {
            const data = Map(v).set("Focus", (v.Name === area));
            return data.toJS();
        }).toList();
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
    }
}