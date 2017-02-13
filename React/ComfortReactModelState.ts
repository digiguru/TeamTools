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
export class ChaosZoneList {
    Comfort: ChaosPickerZoneState;
    Stretch: ChaosPickerZoneState;
    Chaos: ChaosPickerZoneState;
}
export class ChaosPickerState {
    UserList: Array<String>;
    Zones: ChaosZoneList;
    ShowUserChoices: Boolean;
    CurrentUser?: String;
    UserChoices: Array<ChaosPickerUserChoiceState>;
}
export class ChaosPickerStateFactory {
    dummy(): ChaosPickerState {
        const userList = [
                "Adam",
                "Caroline",
                "Lucas"
            ];
        const zones: ChaosZoneList =  {
            // all focus default to false
            Comfort: {Name: "Comfort", Focus: false, Range: {Start: 0, End: 100}},
            Stretch: {Name: "Stretch", Focus: true, Range: {Start: 100, End: 200 }},
            Chaos: {Name: "Chaos", Focus: false, Range: {Start: 200, End: 300}}
        };
        const userChoices: Array<ChaosPickerUserChoiceState> = [ // default empty
            {User: "Adam", Zone: "Stretch", Distance: 165},
            {User: "Caroline", Zone: "Comfort", Distance: 28}
        ];
        return {
            UserList : userList,
            CurrentUser : "Lucas", // default to empty - which shows the UserChoice menu
            Zones : zones,
            ShowUserChoices: false,
            UserChoices : userChoices
        };
    }
}