import * as React from "react";
import * as Redux from "../../3rdParty/redux.min";
import { ComfortApp } from "../Comfort/ComponentApp";
import {comfortReactApp} from "../Comfort/Reducer";
import { render } from "react-dom";
import { Provider } from "../../3rdParty/react-redux.min";
import { setUserFocus, chooseZone } from "../Comfort/Actions";

const renderizer = require("react-test-renderer");

it("Should show the component", () => {
    // Arrange

    const myStore = Redux.createStore(comfortReactApp);

    const component = renderizer.create(
        <Provider store={myStore}>
            <ComfortApp />
        </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
    myStore.dispatch(setUserFocus("Adam Hall", "in-focus"));
    expect(component.toJSON()).toMatchSnapshot();

});

it("Should allow shrinking", () => {
    // Arrange

    const myStore = Redux.createStore(comfortReactApp);

    const component = renderizer.create(
        <Provider store={myStore}>
            <ComfortApp />
        </Provider>
    );
    myStore.dispatch(chooseZone("Adam Hall", "Stretch", 50));
    expect(component.toJSON()).toMatchSnapshot();

    myStore.dispatch(chooseZone("Caroline Hall", "Chaos", 100));
    expect(component.toJSON()).toMatchSnapshot();

});



