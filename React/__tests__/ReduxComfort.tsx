import * as React from "react";
import {createStore} from "../../3rdParty/redux.min";
import { ComfortApp } from "../Comfort/ComponentApp";
import {comfortReactApp} from "../Comfort/Reducer";
import { render } from "react-dom";
import { Provider } from "../../3rdParty/react-redux.min";
import * as Action from "../Comfort/Actions";
import { StageConnector } from "../Stage/Connector";

const renderizer = require("react-test-renderer");

test.skip("Should not mutate in any way", () => {
    const myStore = createStore(comfortReactApp);
    const originalState = myStore.getState();
    const inputState = JSON.stringify(originalState);
    const checkAfterAction = (action) => {
        myStore.dispatch(action);
        expect(inputState).toEqual(JSON.stringify(originalState));
    };
    checkAfterAction(Action.setUserFocus("Adam Hall", "in-focus"));
    checkAfterAction(Action.selectUser("Adam Hall"));
    checkAfterAction(Action.setStageSize(800, 600));
    checkAfterAction(Action.setZoneFocus("Chaos", "in-focus"));
    checkAfterAction(Action.setZoneFocus("Stretch", "active"));
    checkAfterAction(Action.setZoneFocus("Comfort", "in-focus"));
    checkAfterAction(Action.toggleChoiceVisibility(true));
    checkAfterAction(Action.toggleChoiceVisibility(false));
    checkAfterAction(Action.chooseZone("Adam Hall", "Stretch", 85));
});



test.skip("Should show the component", () => {
    // Arrange
    debugger;
    const myStore = createStore(comfortReactApp);
    const component = renderizer.create(
        <Provider store={myStore}>
            <StageConnector>
                <ComfortApp />
            </StageConnector>
        </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
    myStore.dispatch(Action.setUserFocus("Adam Hall", "in-focus"));
    expect(component.toJSON()).toMatchSnapshot();

});

test.skip("Should allow shrinking", () => {
    // Arrange

    const myStore = createStore(comfortReactApp);

    const component = renderizer.create(
        <Provider store={myStore}>
            <StageConnector>
                <ComfortApp />
            </StageConnector>
        </Provider>
    );
    myStore.dispatch(Action.chooseZone("Adam Hall", "Stretch", 50));
    expect(component.toJSON()).toMatchSnapshot();

    myStore.dispatch(Action.chooseZone("Caroline Hall", "Chaos", 100));
    expect(component.toJSON()).toMatchSnapshot();

});



