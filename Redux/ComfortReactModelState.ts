import { List, Map } from "immutable";

export class ChaosPickerUserChoiceState {
    User: String;
    Zone: "Chaos" | "Stretch" | "Comfort";
    Distance: number;
}
export class ChaosPickerZoneRangeState {
    Start: number;
    End: number;
}
export class ChaosPickerZoneState {
    Name: "Chaos" | "Stretch" | "Comfort";
    Focus: Boolean;
    Range: ChaosPickerZoneRangeState;
}
export class ChaosPickerState {
    UserList: List<String>;
    Zones: List<ChaosPickerZoneState>;
    ShowUserChoices: Boolean;
    CurrentUser?: String;
    UserChoices: List<ChaosPickerUserChoiceState>;
}
export class ChaosPickerStateFactory {
    dummy(): ChaosPickerState {
        const userList = [
                "Adam",
                "Caroline",
                "Lucas"
            ];
        const zones: Array<ChaosPickerZoneState> = [ // all focus default to false
                {Name: "Comfort", Focus: false, Range: {Start: 0, End: 100}},
                {Name: "Stretch", Focus: true, Range: {Start: 100, End: 200}},
                {Name: "Chaos", Focus: false, Range: {Start: 200, End: 300}}
            ];
        const userChoices: Array<ChaosPickerUserChoiceState> = [ // default empty
                {User: "Adam", Zone: "Stretch", Distance: 165},
                {User: "Caroline", Zone: "Comfort", Distance: 28}
            ];
        return {
            UserList : List(userList),
            CurrentUser : "Lucas", // default to empty - which shows the UserChoice menu
            Zones : List(zones),
            ShowUserChoices: false,
            UserChoices : List(userChoices)
        };
    }
}