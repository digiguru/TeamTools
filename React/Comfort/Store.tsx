import * as React from "react";
import { createStore } from "redux";
import { ComfortApp } from "./ComponentApp";
import { comfortReducer } from "./Reducer";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setStageSize, setStageVisibility, fetchUserList } from "./Actions";
import { Size } from "../Models/Size";
import { getWidthHeight } from "../Shared/WindowHelper";
import { StageConnector } from "../Stage/Connector";


const comfortStore = createStore(comfortReducer);
// comfortStore.dispatch(fetchUserList());
comfortStore.dispatch(setStageSize(800, 800));

const unsubscribe = comfortStore.subscribe(() =>
  console.log(comfortStore.getState())
);

render(
  <Provider store={comfortStore}>
    <StageConnector>
        <ComfortApp />
    </StageConnector>
  </Provider>,
  document.getElementById("comfort")
);

export function resizeImage() {
    const size: Size = getWidthHeight();
    if (size.width > size.height) {
      comfortStore.dispatch(setStageSize(size.height, size.height));
    } else {
      comfortStore.dispatch(setStageSize(size.width, size.width));
    }
    comfortStore.dispatch(setStageSize(size.height, size.height));
}
export function hideModel() {
  comfortStore.dispatch(setStageVisibility("hiding"));
}
export function showModel() {
  comfortStore.dispatch(setStageVisibility("appearing"));
}
window.addEventListener("resize", resizeImage, false);

// Stop listening to state updates
// unsubscribe(); ;
