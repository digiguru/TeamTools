import { ComfortActions } from "./Actions";
import { ComfortAppState } from "./Model";
import { Point } from "../Models/Point";
import { Size } from "../Models/Size";
import { DOMMeasurement } from "../Models/IDomMeasurement";
import { IUser, IUserList, IUserUI } from "../User/Model";

const initialSize: Size = new Size(800, 800);
const initialState: ComfortAppState = {
    Size: initialSize,
    CenterPoint: new Point(initialSize.width / 2, initialSize.height / 2),
    UserList: {
        ShowUsers: true,
        Users: [
            {Username: "Adam Hall", Focus: "not-in-focus", Y: 0},
            {Username: "Caroline Hall", Focus: "not-in-focus", Y: 0}
        ]
    },
    Zones: {
        Comfort: {Name: "Comfort", Focus: "not-in-focus", Range: {Start: 0, End: 33}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Stretch: {Name: "Stretch", Focus: "not-in-focus", Range: {Start: 34, End: 66}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Chaos: {Name: "Chaos", Focus: "not-in-focus", Range: {Start: 67, End: 100}, Size: {Width: new DOMMeasurement("100%"), Height: new DOMMeasurement("100%")}}
    },
    ShowUserChoices: false,
    UserChoices: []
};

export function comfortReducer(state: ComfortAppState = initialState, action): ComfortAppState {
    switch (action.type) {
        case ComfortActions.SET_USERLIST:
            return ComfortZoneAction.setUsers(state, action.userList);
        case ComfortActions.SET_STAGEVISIBILITY:
            return ComfortZoneAction.setVisibility(state, action.visibility);
        case ComfortActions.SET_STAGESIZE:
            return ComfortZoneAction.setStageSize(state, action.width, action.height);
        case ComfortActions.SET_USERFOCUS:
            return ComfortZoneAction.setUserFocus(state, action.user, action.focus);
        case ComfortActions.SET_ZONEFOCUS:
            return ComfortZoneAction.setZoneFocus(state, action.area, action.focus);
        case ComfortActions.SELECT_USER:
            return ComfortZoneAction.selectUser(state, action.user);
        case ComfortActions.CHOOSE_ZONE:
            return ComfortZoneAction.chooseZone(state, action.user, action.area, action.distance);
        case ComfortActions.TOGGLE_CHOICES:
            return ComfortZoneAction.toggleChoiceVisibility(state, action.visible);
        default:
            return state;
    }
}

class ComfortZoneAction {
    static setStageSize(state: ComfortAppState, width: number, height: number): ComfortAppState {
        return {
            ...state,
            Size: new Size(width, height),
            CenterPoint: new Point(width / 2, height / 2)
        };
    }

    static setVisibility(state: ComfortAppState, visibility: "hiding" | "appearing"): ComfortAppState {
        return {
            ...state,
            Zones: {
                ...state.Zones,
                Comfort: {...state.Zones.Comfort, visibility},
                Stretch: {...state.Zones.Stretch, visibility},
                Chaos: {...state.Zones.Chaos, visibility}
            }
        };
    }

    static setZoneFocus(state: ComfortAppState, area: "Chaos" | "Stretch" | "Comfort", focus: "in-focus" | "active" | "not-in-focus"): ComfortAppState {
        return {
            ...state,
            Zones: {
                ...state.Zones,
                Comfort: {...state.Zones.Comfort, Focus: area === "Comfort" ? focus : "not-in-focus"},
                Stretch: {...state.Zones.Stretch, Focus: area === "Stretch" ? focus : "not-in-focus"},
                Chaos: {...state.Zones.Chaos, Focus: area === "Chaos" ? focus : "not-in-focus"}
            }
        };
    }

    static setUserFocus(state: ComfortAppState, user: string, focus: "in-focus" | "active" | "not-in-focus"): ComfortAppState {
        const users = (state.UserList.Users ?? []).map((item) =>
            item.Username === user ? {...item, Focus: focus, Y: "Y" in item ? item.Y : 0} as IUserUI : item
        );
        return {...state, UserList: {...state.UserList, Users: users}};
    }

    static selectUser(state: ComfortAppState, user: string): ComfortAppState {
        const item = (state.UserList.Users ?? []).find(candidate => candidate.Username === user) as IUser | undefined;
        return {
            ...state,
            CurrentUser: item,
            ShowUserChoices: false,
            UserList: {...state.UserList, ShowUsers: false}
        };
    }

    static setUsers(state: ComfortAppState, userList: IUserList): ComfortAppState {
        return {...state, UserList: userList};
    }

    static chooseZone(state: ComfortAppState, user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number): ComfortAppState {
        const newUserList = (state.UserList.Users ?? []).filter((item) => item.Username !== user);
        const showUserChoice = newUserList.length > 0;
        return {
            ...state,
            CurrentUser: undefined,
            ShowUserChoices: showUserChoice,
            UserChoices: [...state.UserChoices, {User: {Username: user}, Zone: area, Distance: distance}],
            UserList: {...state.UserList, Users: newUserList, ShowUsers: showUserChoice}
        };
    }

    static toggleChoiceVisibility(state: ComfortAppState, visible: boolean): ComfortAppState {
        return {...state, ShowUserChoices: visible};
    }
}
