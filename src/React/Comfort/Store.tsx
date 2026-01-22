import * as React from "react";
import { createStore } from "redux";
import { ComfortConnector } from "./Connector";
import { comfortReducer } from "./Reducer";
import { Provider } from "react-redux";
import { setStageSize, setStageVisibility, fetchUserList } from "./Actions";
import { Size } from "../Models/Size";
import { getWidthHeight } from "../Shared/WindowHelper";
import { StageConnector } from "../Stage/Connector";


const store = createStore(comfortReducer);
// comfortStore.dispatch(fetchUserList());
store.dispatch(setStageSize(800, 800));

const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

function ComfortStore() {
  return (
  <Provider store={store}>
    <StageConnector>
        <ComfortConnector />
    </StageConnector>
  </Provider>
  );
}

export function resizeImage() {
    const size: Size = getWidthHeight();
    if (size.width > size.height) {
      store.dispatch(setStageSize(size.height, size.height));
    } else {
      store.dispatch(setStageSize(size.width, size.width));
    }
    store.dispatch(setStageSize(size.height, size.height));
}
export function getStore() {
  return store;
}
function hideModel() {
  store.dispatch(setStageVisibility("hiding"));
}
function showModel() {
  store.dispatch(setStageVisibility("appearing"));
}
window.addEventListener("resize", resizeImage, false);

// Stop listening to state updates
// unsubscribe(); ;

export default ComfortStore;
