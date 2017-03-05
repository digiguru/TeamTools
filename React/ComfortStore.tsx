import * as React from "react";
import * as Redux from "redux";
import { ReduxComfortApp } from "ComfortReactApp";
import {comfortReactApp} from "ComfortReactReducer";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setUserFocus } from "ComfortActions";

const myStore = Redux.createStore(comfortReactApp);

console.log(myStore.getState());

const unsubscribe = myStore.subscribe(() =>
  console.log(myStore.getState())
);

render(
  <Provider store={myStore}>
    <ReduxComfortApp />
  </Provider>,
  document.getElementById("stage")
);

myStore.dispatch(setUserFocus("Adam Hall", "in-focus"));

// Stop listening to state updates
// unsubscribe(); ;