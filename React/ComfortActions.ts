import {Focus} from "ComfortReactModelState";

export const ComfortActions = {
    SET_ZONEFOCUS: "SET_ZONEFOCUS",
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

export function setFocus(area: "Chaos" | "Stretch" | "Comfort", focus: "in-focus" | "active" | "not-in-focus") {
    return {type: ComfortActions.SET_ZONEFOCUS, area: area, focus: focus};
}
export function selectUser(user: string) {
    return {type: ComfortActions.SELECT_USER, user: user};
}
export function chooseZone(user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number) {
    return {type: ComfortActions.CHOOSE_ZONE, user: user, area: area, distance: distance};
}
export function toggleChoiceVisibility(visible: Boolean) {
    return {type: ComfortActions.TOGGLE_CHOICES, visible: visible};
}