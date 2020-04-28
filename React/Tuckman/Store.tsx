import * as React from "react";
import * as Redux from "redux";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setStageSize, setStageVisibility } from "./Actions";
import { Size } from "../Models/Size";
import { getWidthHeight } from "../Shared/WindowHelper";
import { TuckmanConnector } from "./Connector";
import { StageConnector } from "../Stage/Connector";
import { tuckmanReducer } from "./Reducer";
import { InMemoryBrowserUsers } from "../../Shared/InMemoryBrowserUsers";
export const myTuckmanStore = Redux.createStore(tuckmanReducer);
const users = new InMemoryBrowserUsers(window);


const unsubscribe = myTuckmanStore.subscribe(() =>
  console.log(myTuckmanStore.getState())
);

render(
  <Provider store={myTuckmanStore}>
    <StageConnector>
        <TuckmanConnector />
    </StageConnector>
  </Provider>,
  document.getElementById("tuckman")
);

export function resizeImage() {
    const size: Size = getWidthHeight();
    if (size.width > size.height) {
      myTuckmanStore.dispatch(setStageSize(size.height, size.height));
    } else {
      myTuckmanStore.dispatch(setStageSize(size.width, size.width));
    }
}
export function getStore() {
  return myTuckmanStore;
}
function hideModel() {
  myTuckmanStore.dispatch(setStageVisibility("hiding"));
}
function showModel() {
  myTuckmanStore.dispatch(setStageVisibility("appearing"));
}

window.addEventListener("resize", resizeImage, false);
setTimeout(() => {
  console.log("HIDE IT!");
  myTuckmanStore.dispatch(setStageVisibility("hiding"));
}, 5000);
// Stop listening to state updates
// unsubscribe(); ;
