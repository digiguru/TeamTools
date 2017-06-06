import * as React from "react";
import * as Redux from "redux";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setStageSize, setStageVisibility } from "./Actions";
import { Size } from "../Models/Size";
import { getWidthHeight } from "../Shared/WindowHelper";
import { TuckmanConnector } from "./Connector";
import { StageConnector } from "../Stage/Connector";
import { tuckmanReactApp } from "./Reducer";
import { InMemoryBrowserUsers } from "../../Shared/InMemoryBrowserUsers";
export const myStore = Redux.createStore(tuckmanReactApp);
const users = new InMemoryBrowserUsers(window);


const unsubscribe = myStore.subscribe(() =>
  console.log(myStore.getState())
);

render(
  <Provider store={myStore}>
    <StageConnector>
        <TuckmanConnector />
    </StageConnector>
  </Provider>,
  document.getElementById("tuckman")
);

export function resizeImage() {
    const size: Size = getWidthHeight();
    if (size.width > size.height) {
      myStore.dispatch(setStageSize(size.height, size.height));
    } else {
      myStore.dispatch(setStageSize(size.width, size.width));
    }
}
export function hideModel() {
  myStore.dispath(setStageVisibility("hiding"));
}
export function showModel() {
  myStore.dispath(setStageVisibility("appearing"));
}

window.addEventListener("resize", resizeImage, false);

// Stop listening to state updates
// unsubscribe(); ;
