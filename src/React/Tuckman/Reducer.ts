import { ITuckmanModel } from "./Model";
import { Size } from "../Models/Size";
import { Point } from "../Models/Point";
import { TuckmanActions } from "./Actions";
import { IUser, IUserList, IUserUI } from "../User/Model";

const initialSize: Size = new Size(800, 800);
const initialState: ITuckmanModel = {
    UserList: {
        ShowUsers: true,
        Users: [
            {Username: "Adam Hall", Focus: "not-in-focus", Y: 0},
            {Username: "Caroline Hall", Focus: "not-in-focus", Y: 0}
        ]
    },
    Size: initialSize,
    CenterPoint: new Point(initialSize.width / 2, initialSize.height / 2),
    onHide: () => undefined,
    onShow: () => undefined,
    zones: {
        forming: {index: 0, label: "forming", focus: "not-in-focus", Events: undefined, visibility: "appearing"},
        storming: {index: 1, label: "storming", focus: "not-in-focus", Events: undefined, visibility: "appearing"},
        norming: {index: 2, label: "norming", focus: "not-in-focus", Events: undefined, visibility: "appearing"},
        performing: {index: 3, label: "performing", focus: "not-in-focus", Events: undefined, visibility: "appearing"}
    },
    visibility: false,
    ShowUserChoices: false,
    UserChoices: []
};

export function tuckmanReducer(state: ITuckmanModel = initialState, action): ITuckmanModel {
    switch (action.type) {
        case TuckmanActions.SET_STAGESIZE:
            return TuckmanZoneAction.setStageSize(state, action.width, action.height);
        case TuckmanActions.SET_STAGEVISIBLE:
            return TuckmanZoneAction.setStageVisibilty(state, action.visibility);
        case TuckmanActions.SET_USERFOCUS:
            return TuckmanZoneAction.setUserFocus(state, action.user, action.focus);
        case TuckmanActions.SET_ZONEFOCUS:
            return TuckmanZoneAction.setZoneFocus(state, action.area, action.focus);
        case TuckmanActions.SELECT_USER:
            return TuckmanZoneAction.selectUser(state, action.user);
        case TuckmanActions.CHOOSE_ZONE:
            return TuckmanZoneAction.chooseZone(state, action.user, action.area, action.distance);
        case TuckmanActions.TOGGLE_CHOICES:
            return TuckmanZoneAction.toggleChoiceVisibility(state, action.visible);
        default:
            return state;
    }
}

class TuckmanZoneAction {
    static setStageSize(state: ITuckmanModel, width: number, height: number): ITuckmanModel {
        return {...state, Size: new Size(width, height), CenterPoint: new Point(width / 2, height / 2)};
    }

    static setStageVisibilty(state: ITuckmanModel, visibility: "hiding" | "appearing"): ITuckmanModel {
        if (!state.zones) return state;
        return {
            ...state,
            zones: {
                forming: {...state.zones.forming, visibility},
                storming: {...state.zones.storming, visibility},
                norming: {...state.zones.norming, visibility},
                performing: {...state.zones.performing, visibility}
            }
        };
    }

    static setZoneFocus(state: ITuckmanModel, area: "forming" | "storming" | "norming" | "performing", focus: "in-focus" | "active" | "not-in-focus"): ITuckmanModel {
        if (!state.zones) return state;
        return {
            ...state,
            zones: {
                forming: {...state.zones.forming, focus: area === "forming" ? focus : "not-in-focus"},
                storming: {...state.zones.storming, focus: area === "storming" ? focus : "not-in-focus"},
                norming: {...state.zones.norming, focus: area === "norming" ? focus : "not-in-focus"},
                performing: {...state.zones.performing, focus: area === "performing" ? focus : "not-in-focus"}
            }
        };
    }

    static setUserFocus(state: ITuckmanModel, user: string, focus: "in-focus" | "active" | "not-in-focus"): ITuckmanModel {
        const users = (state.UserList?.Users ?? []).map((item) =>
            item.Username === user ? {...item, Focus: focus, Y: "Y" in item ? item.Y : 0} as IUserUI : item
        );
        return {...state, UserList: {...state.UserList, Users: users}};
    }

    static setUsers(state: ITuckmanModel, userList: IUserList): ITuckmanModel {
        return {...state, UserList: userList};
    }

    static selectUser(state: ITuckmanModel, user: string): ITuckmanModel {
        const item = (state.UserList?.Users ?? []).find(candidate => candidate.Username === user) as IUser | undefined;
        return {
            ...state,
            CurrentUser: item,
            ShowUserChoices: false,
            UserList: {...state.UserList, ShowUsers: false}
        };
    }

    static chooseZone(state: ITuckmanModel, user: string, area: "forming" | "storming" | "norming" | "performing", distance: number): ITuckmanModel {
        const newUserList = (state.UserList?.Users ?? []).filter((item) => item.Username !== user);
        const showUserChoice = newUserList.length > 0;
        return {
            ...state,
            CurrentUser: undefined,
            ShowUserChoices: showUserChoice,
            UserChoices: [...(state.UserChoices ?? []), {User: {Username: user}, Zone: area, Distance: distance}],
            UserList: {...state.UserList, Users: newUserList, ShowUsers: showUserChoice}
        };
    }

    static toggleChoiceVisibility(state: ITuckmanModel, visible: boolean): ITuckmanModel {
        return {...state, visibility: !visible, ShowUserChoices: visible};
    }
}
