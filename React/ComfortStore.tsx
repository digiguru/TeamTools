import * as React from "react";
import * as Redux from "redux";
import { ReduxComfortApp } from "ComfortReactApp";
import {comfortReactApp} from "ComfortReactReducer";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setStageSize, setUserFocus } from "./ComfortActions";
import { Point, Size } from "./Point";

export const myStore = Redux.createStore(comfortReactApp);

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

function resizeImage() {
    //calculations here...
    const size: Size = getWidthHeight();
    if (size.width > size.height) {
      myStore.dispatch(setStageSize(size.height, size.height));
    } else {
      myStore.dispatch(setStageSize(size.width, size.width));
    }
}
function getWidthHeight(): Size {
  const w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName("body")[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;
  return new Size(x, y);
};

window.addEventListener("resize", resizeImage, false);


// Stop listening to state updates
// unsubscribe(); ;