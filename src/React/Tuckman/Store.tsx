import * as React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { setStageSize, setStageVisibility } from "./Actions";
import { Size } from "../Models/Size";
import { getWidthHeight } from "../Shared/WindowHelper";
import { TuckmanConnector } from "./Connector";
import { StageConnector } from "../Stage/Connector";
import { tuckmanReducer } from "./Reducer";
export const myTuckmanStore = createStore(tuckmanReducer);

myTuckmanStore.subscribe(() =>
  console.log(myTuckmanStore.getState())
);

function TuckmanStore() {
  return (
    <Provider store={myTuckmanStore}>
      <StageConnector>
          <TuckmanConnector />
      </StageConnector>
    </Provider>
  );
}

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
window.addEventListener("resize", resizeImage, false);
setTimeout(() => {
  console.log("HIDE IT!");
  myTuckmanStore.dispatch(setStageVisibility("hiding"));
}, 5000);
// Stop listening to state updates
// unsubscribe(); ;
export default TuckmanStore;
