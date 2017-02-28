import * as Redux from "redux";

import { setFocus, selectUser, chooseZone, toggleChoiceVisibility } from "ComfortActions";
import {comfortReactApp} from "ComfortReactReducer";
const store = Redux.createStore(comfortReactApp);

console.log(store.getState());

const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

// Dispatch some actions
store.dispatch(setFocus("Chaos", "in-focus"));
store.dispatch(setFocus("Comfort", "in-focus"));
store.dispatch(setFocus("Stretch", "in-focus"));
store.dispatch(selectUser("Adam Hall"));
store.dispatch(setFocus("Stretch", "active"));
store.dispatch(chooseZone("Adam Hall", "Chaos", 150));
store.dispatch(toggleChoiceVisibility(true));

// Stop listening to state updates
unsubscribe();