import {ChaosPickerState} from "ComfortReactState";
import { List, Map } from "immutable";
const createStore = require("redux").createStore;

export interface IAction {
    type: "SET_FOCUS" | "SELECT_USER" | "CHOOSE_ZONE" | "SHOW_CHOICES";
}
export class ComfortZoneActionFactory {
    setFocusToComfort() {
        return {type: "SET_FOCUS", area: "comfort"};
    }
    selectUserAdam() {
        return {type: "SELECT_USER", user: "Adam"};
    }
    adamChooseZoneStretch165() {
        return {type: "CHOOSE_ZONE", user: "Adam", area: "Stretch", distance: "165"};
    }
    showChoices() {
        return {type: "SHOW_CHOICES"};
    }
}
export class ComfortZoneAction {
    doAction(state: ChaosPickerState, action: IAction) {
        switch(action.type) {
            case "SET_FOCUS":
                return this.setFocus(state, (<any>action).area);
            case "SELECT_USER":
                return this.selectUser(state, (<any>action).user);
            case "CHOOSE_ZONE":
                return this.chooseZone(state, (<any>action).user, (<any>action).area, (<any>action).distance);
            case "SHOW_CHOICES":
                return this.showChoices(state);
            default:
                return state;
        }
    }
    setFocus(state: ChaosPickerState, area: "Chaos" | "Stretch" | "Comfort"): ChaosPickerState {
        // Set focus to true on this zone, and all others to false.
        state.Zones = state.Zones.map((v, i) => {
            const data = Immutable.Map(v).set("Focus", (v.Name === area));
            return data.toJS();
        }).toList();
        return state;
    }
    selectUser(state: ChaosPickerState, user: String): ChaosPickerState {
        // Sets currentUser, and therefor hides the user choice menu
        /*return Object.assign({}, state, {
            CurrentUser: user,
            ShowUserChoices: false
        });*/
        const data = Immutable.Map(state)
            .set("CurrentUser", user)
            .set("ShowUserChoices", false);
        return data.toJS();
    }
    chooseZone(state: ChaosPickerState, user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number): ChaosPickerState {
         // Adds to UserChoices, and sets currentUser to empty
        const data = state.UserChoices.push({
                User: user,
                Zone: area,
                Distance: distance
            });
        return Immutable.Map(state)
            .delete("CurrentUser")
            .set("UserChoices", data).toJS();
    }
    showChoices(state: ChaosPickerState) {
        // Set "showUserChoices" to true
        return Immutable.Map(state)
            .set("ShowUserChoices", true).toJS();
    }
}