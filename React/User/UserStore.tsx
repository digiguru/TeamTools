import * as React from "react";
import * as Redux from "redux";
import {createStore} from "redux";
import { userReducer } from "./Reducer";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { StageConnector } from "../Stage/Connector";
import { UserInputComponent } from "./UserInputComponent";

const myStore = createStore(userReducer);

render(
  <Provider store={myStore}>
    <UserInputComponent />
  </Provider>,
  document.getElementById("user")
);

