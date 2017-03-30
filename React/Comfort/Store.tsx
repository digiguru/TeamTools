import * as React from "react";
import * as Redux from "redux";
import { ComfortApp } from "./ComponentApp";
import {comfortReactApp} from "./Reducer";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setStageSize } from "./Actions";
import { Size } from "../Models/Size";
import { getWidthHeight } from "../Shared/WindowHelper";
import { StageConnector } from "../Stage/Connector";

export const myStore = Redux.createStore(comfortReactApp);


const unsubscribe = myStore.subscribe(() =>
  console.log(myStore.getState())
);

render(
  <Provider store={myStore}>
    <StageConnector>
        <ComfortApp />
    </StageConnector>
  </Provider>,
  document.getElementById("stage")
);

export function resizeImage() {
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
