import * as React from "react";
import * as Redux from "redux";
import { ComfortApp } from "./ComponentApp";
import {comfortReactApp} from "./Reducer";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setStageSize, setUserFocus } from "./Actions";
import { Point } from "../Models/Point";
import { Size } from "../Models/Size";
import { getWidthHeight } from "../Shared/WindowHelper";

export const myStore = Redux.createStore(comfortReactApp);

console.log(myStore.getState());

const unsubscribe = myStore.subscribe(() =>
  console.log(myStore.getState())
);

render(
  <Provider store={myStore}>
    <ComfortApp />
  </Provider>,
  document.getElementById("stage")
);

export function resizeImage() {
    //calculations here...
    const size: Size = getWidthHeight();
    if (size.width > size.height) {
      myStore.dispatch(setStageSize(size.height, size.height));
    } else {
      myStore.dispatch(setStageSize(size.width, size.width));
    }
}

window.addEventListener("resize", resizeImage, false);

// Stop listening to state updates
// unsubscribe(); ;