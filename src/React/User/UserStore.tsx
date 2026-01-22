import * as React from "react";
import * as Redux from "redux";
import {createStore} from "redux";
import { userReducer } from "./Reducer";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { StageConnector } from "../Stage/Connector";
import { UserInputComponent } from "./UserInputComponent";

const myStore = createStore(userReducer);

const rootElement = document.getElementById("user");
if (!rootElement) {
  throw new Error("User element not found");
}
const root = createRoot(rootElement);
root.render(
  <Provider store={myStore}>
    <UserInputComponent />
  </Provider>
);
