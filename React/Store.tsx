import * as React from "react";
import {createStore} from "redux";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setStageSize, setStageVisibility } from "./Tuckman/Actions";
import { Size } from "./Models/Size";
import reducer from "./CombineReducers";
import { getWidthHeight } from "./Shared/WindowHelper";
import { TuckmanConnector } from "./Tuckman/Connector";
import { ComfortApp } from "./Comfort/ComponentApp";
import { StageConnector } from "./Stage/Connector";

import { InMemoryBrowserUsers } from "../Shared/InMemoryBrowserUsers";
const myStore = createStore(reducer);
const initSize: Size = getWidthHeight();
myStore.dispatch(setStageSize(initSize.height, initSize.height));
const users = new InMemoryBrowserUsers(window);


const unsubscribe = myStore.subscribe(() =>
  console.log(myStore.getState())
);

render(
  <Provider store={myStore}>
    <StageConnector>
        <div id="tuckman"><TuckmanConnector /></div>
        <div id="comfort"><ComfortApp /></div>
    </StageConnector>
  </Provider>,
  document.getElementById("container")
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
