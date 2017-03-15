import { Point, Size } from "./Point";

export const ComfortActions = {
    SET_STAGESIZE: "SET_STAGESIZE",
    SET_ZONEFOCUS: "SET_ZONEFOCUS",
    SET_USERFOCUS: "SET_USERFOCUS",
    SELECT_USER: "SELECT_USER",
    CHOOSE_ZONE: "CHOOSE_ZONE",
    TOGGLE_CHOICES: "TOGGLE_CHOICES"
};

/*
export function setFocusToComfort() {
    return {type: ComfortActions.SET_FOCUS, area: "comfort"};
};
export function selectUserAdam() {
    return {type: ComfortActions.SELECT_USER, user: "Adam"};
}
export function adamChooseZoneStretch165() {
    return {type: ComfortActions.CHOOSE_ZONE, user: "Adam", area: "Stretch", distance: "165"};
}
*/
export function setStageSize(width: number, height: number) {
    return {type: ComfortActions.SET_STAGESIZE, width: width, height: height};
}
export function setUserFocus(user: string, focus: "in-focus" | "active" | "not-in-focus") {
    return {type: ComfortActions.SET_USERFOCUS, user: user, focus: focus};
}
export function setZoneFocus(area: "Chaos" | "Stretch" | "Comfort", focus: "in-focus" | "active" | "not-in-focus") {
    return {type: ComfortActions.SET_ZONEFOCUS, area: area, focus: focus};
}
export function selectUser(user: string) {
    return {type: ComfortActions.SELECT_USER, user: user};
}
export function chooseZone(user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number, x: number, y: number) {
    return {type: ComfortActions.CHOOSE_ZONE, user: user, area: area, distance: distance, x: x, y: y};
}
export function toggleChoiceVisibility(visible: boolean) {
    return {type: ComfortActions.TOGGLE_CHOICES, visible: visible};
}