import * as React from "react";
import {createStore} from "redux";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { setStageSize, setStageVisibility } from "./Tuckman/Actions";
import { Size } from "./Models/Size";
import reducer from "./CombineReducers";
import { getWidthHeight } from "./Shared/WindowHelper";
// import { TuckmanConnector } from "./Tuckman/Connector";
import { TuckmanStage } from "./Tuckman/Component";
import { ComfortStage } from "./Comfort/Component";
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
        <ComfortStage />
    </StageConnector>
  </Provider>,
  document.getElementById("container")
);
// <TuckmanStage />
// <TuckmanConnector />
// <div id="comfort"></div>
// <div id="tuckman"></div>

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
