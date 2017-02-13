import * as Redux from "../3rdParty/redux.min";

import { setFocus, selectUser, chooseZone, toggleChoiceVisibility } from "ComfortActions";
import {comfortReactApp} from "ComfortReactReducer";
const store = Redux.createStore(comfortReactApp);

console.log(store.getState());

const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

// Dispatch some actions
store.dispatch(setFocus("Chaos"));
store.dispatch(setFocus("Comfort"));
store.dispatch(setFocus("Stretch"));
store.dispatch(selectUser("Adam Hall"));
store.dispatch(chooseZone("Adam Hall", "Chaos", 150));
store.dispatch(toggleChoiceVisibility(true));

// Stop listening to state updates
unsubscribe();