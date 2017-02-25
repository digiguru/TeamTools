import * as Redux from "redux";

import { setActiveFocus, setOverFocus, selectUser, chooseZone, toggleChoiceVisibility } from "ComfortActions";
import {comfortReactApp} from "ComfortReactReducer";
const store = Redux.createStore(comfortReactApp);

console.log(store.getState());

const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

// Dispatch some actions
store.dispatch(setOverFocus("Chaos"));
store.dispatch(setOverFocus("Comfort"));
store.dispatch(setOverFocus("Stretch"));
store.dispatch(selectUser("Adam Hall"));
store.dispatch(setActiveFocus("Stretch"));
store.dispatch(chooseZone("Adam Hall", "Chaos", 150));
store.dispatch(toggleChoiceVisibility(true));

// Stop listening to state updates
unsubscribe();