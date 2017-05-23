import { IUserList } from "../User/Model";

export const TuckmanActions = {
    SET_STAGESIZE : "SET_STAGESIZE",
    SET_ZONEFOCUS : "SET_ZONEFOCUS",
    SET_USERFOCUS : "SET_USERFOCUS",
    SET_USERLIST  : "SET_USERLIST",
    SELECT_USER   : "SELECT_USER",
    CHOOSE_ZONE   : "CHOOSE_ZONE",
    TOGGLE_CHOICES: "TOGGLE_CHOICES"
};

export function setStageSize(width: number, height: number) {
    return {type: TuckmanActions.SET_STAGESIZE, width: width, height: height};
}
export function setZoneFocus(area: "forming" | "storming" | "norming" | "performing", focus: "in-focus" | "active" | "not-in-focus") {
    return {type: TuckmanActions.SET_ZONEFOCUS, area: area, focus: focus};
}

export function setUserFocus(user: string, focus: "in-focus" | "active" | "not-in-focus") {
    return {type: TuckmanActions.SET_USERFOCUS, user: user, focus: focus};
}
export function setUserList(userList: IUserList) {
    return {type: TuckmanActions.SET_USERLIST, userList: userList};
}
export function selectUser(user: string) {
    return {type: TuckmanActions.SELECT_USER, user: user};
}
export function chooseZone(user: string, area: "forming" | "storming" | "norming" | "performing", distance: number) {
    return {type: TuckmanActions.CHOOSE_ZONE, user: user, area: area, distance: distance};
}
export function toggleChoiceVisibility(visible: boolean) {
    return {type: TuckmanActions.TOGGLE_CHOICES, visible: visible};
}

