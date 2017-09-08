import * as React from "react";
import * as Redux from "redux";
import { ComfortApp } from "./ComponentApp";
import {comfortReactApp} from "./Reducer";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setStageSize, setStageVisibility, setUserList } from "./Actions";
import { Size } from "../Models/Size";
import { getWidthHeight } from "../Shared/WindowHelper";
import { StageConnector } from "../Stage/Connector";
import { InMemoryBrowserUsers } from "../../Shared/InMemoryBrowserUsers";

export const myComfortStore = Redux.createStore(comfortReactApp);
const users = new InMemoryBrowserUsers(window);
export function setUsers(data) {
  myComfortStore.dispath(setUserList(data));
}
users.getUsers().then(setUsers);


const unsubscribe = myComfortStore.subscribe(() =>
  console.log(myComfortStore.getState())
);

render(
  <Provider store={myComfortStore}>
    <StageConnector>
        <ComfortApp />
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
export function hideModel() {
  myComfortStore.dispath(setStageVisibility("hiding"));
}
export function showModel() {
  myComfortStore.dispath(setStageVisibility("appearing"));
}
window.addEventListener("resize", resizeImage, false);

// Stop listening to state updates
// unsubscribe(); ;
