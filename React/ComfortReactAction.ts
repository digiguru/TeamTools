import {ChaosPickerState} from "ComfortReactState";

// Object.assign
interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
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
    setFocus(state: ChaosPickerState, area: "Chaos" | "Stretch" | "Comfort"): ChaosPickerState {
        // Set focus to true on this zone, and all others to false.
        state.Zones.map((v, i) => {
            return Object.assign({}, v, {
                Focus: (v.Name === area)
            });

        });
        return state;
    }
    selectUser(state: ChaosPickerState, user: String): ChaosPickerState {
        // Sets currentUser, and therefor hides the user choice menu
        return Object.assign({}, state, {
            CurrentUser: user,
            ShowUserChoices: false
        });
    }
    chooseZone(state: ChaosPickerState, user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number): ChaosPickerState {
         // Adds to UserChoices, and sets currentUser to empty
        const data = [
            ...state.UserChoices,
            {
                User: user,
                Zone: area,
                Distance: distance
            }
        ];
        Object.assign({}, state, {
            UserChoices: data,
            CurrentUser: undefined
        });
        return state;
    }
    showChoices(state: ChaosPickerState) {
        // Set "showUserChoices" to true
        return Object.assign({}, state, {
            ShowUserChoices: true
        });
    }
}