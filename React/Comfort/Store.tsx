import * as React from "react";
import { createStore } from "redux";
import { ComfortConnector } from "./Connector";
import { comfortReducer } from "./Reducer";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setStageSize, setStageVisibility, fetchUserList } from "./Actions";
import { Size } from "../Models/Size";
import { getWidthHeight } from "../Shared/WindowHelper";
import { StageConnector } from "../Stage/Connector";


export const myComfortStore = createStore(comfortReducer);
// comfortStore.dispatch(fetchUserList());
myComfortStore.dispatch(setStageSize(800, 800));

const unsubscribe = myComfortStore.subscribe(() =>
  console.log(myComfortStore.getState())
);

render(
  <Provider store={myComfortStore}>
    <StageConnector>
        <ComfortConnector />
    </StageConnector>
  </Provider>,
  document.getElementById("comfort")
);

export function resizeImage() {
    const size: Size = getWidthHeight();
    if (size.width > size.height) {
      myComfortStore.dispatch(setStageSize(size.height, size.height));
    } else {
      myComfortStore.dispatch(setStageSize(size.width, size.width));
    }
    myComfortStore.dispatch(setStageSize(size.height, size.height));
}
export function getStore() {
  return myComfortStore;
}
function hideModel() {
  myComfortStore.dispatch(setStageVisibility("hiding"));
}
function showModel() {
  myComfortStore.dispatch(setStageVisibility("appearing"));
}
window.addEventListener("resize", resizeImage, false);

// Stop listening to state updates
// unsubscribe(); ;
