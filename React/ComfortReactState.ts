
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
    UserList: Array<String>;
    Zones: Array<ChaosPickerZoneState>;
    ShowUserChoices: Boolean;
    CurrentUser?: String;
    UserChoices: Array<ChaosPickerUserChoiceState>;
}
export class ChaosPickerStateFactory {
    default(): ChaosPickerState {
        return {
            UserList : [],
            Zones : [ // all focus default to false
                {Name: "Comfort", Focus: false, Range: {Start: 0, End: 100}},
                {Name: "Stretch", Focus: false, Range: {Start: 100, End: 200}},
                {Name: "Chaos", Focus: false, Range: {Start: 200, End: 300}}
            ],
            ShowUserChoices: false,
            UserChoices: []
        };
    }
    dummy(): ChaosPickerState {
        return {
            UserList : [
                "Adam",
                "Caroline",
                "Lucas"
            ],
            CurrentUser : "Lucas", // default to empty - which shows the UserChoice menu
            Zones : [ // all focus default to false
                {Name: "Comfort", Focus: false, Range: {Start: 0, End: 100}},
                {Name: "Stretch", Focus: true, Range: {Start: 100, End: 200}},
                {Name: "Chaos", Focus: false, Range: {Start: 200, End: 300}}
            ],
            ShowUserChoices: false,
            UserChoices : [ // default empty
                {User: "Adam", Zone: "Stretch", Distance: 165},
                {User: "Caroline", Zone: "Comfort", Distance: 28}
            ]
        };
    }
}