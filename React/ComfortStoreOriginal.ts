import * as Redux from "redux";

import { setUserFocus, setZoneFocus, selectUser, chooseZone, toggleChoiceVisibility } from "ComfortActions";
import { comfortReactApp } from "ComfortReactReducer";
import { Point } from "./Point";
const store = Redux.createStore(comfortReactApp);

console.log(store.getState());

const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

// Dispatch some actions
store.dispatch(setUserFocus("Adam Hall", "in-focus"));

store.dispatch(setZoneFocus("Chaos", "in-focus"));
store.dispatch(setZoneFocus("Comfort", "in-focus"));
store.dispatch(setZoneFocus("Stretch", "in-focus"));
store.dispatch(selectUser("Adam Hall"));
store.dispatch(setZoneFocus("Stretch", "active"));
store.dispatch(chooseZone("Adam Hall", "Chaos", 150, new Point(400, 400)));
store.dispatch(toggleChoiceVisibility(true));

// Stop listening to state updates
unsubscribe();