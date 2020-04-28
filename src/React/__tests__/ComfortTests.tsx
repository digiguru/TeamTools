import * as React from "react";
import { createStore } from "redux";
import { ComfortStage } from "../Comfort/Component";
import {comfortReducer} from "../Comfort/Reducer";
// import { render } from "react-dom";
import { Provider } from "react-redux";
import * as Action from "../Comfort/Actions";
import { StageConnector } from "../Stage/Connector";
import { IUserList } from "../User/Model";


const renderizer = require("react-test-renderer");

test("Should not mutate in any way", () => {
    const myState = comfortReducer(undefined, {type: "Startup"});
    const initialState = JSON.stringify(myState);
    const checkAfterAction = (action) => {
        const currentState = comfortReducer(myState, action);
        expect(initialState).toEqual(JSON.stringify(myState));
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



test("Should show the component", () => {
    // Arrange
    const myStore = createStore(comfortReducer);

    const component = renderizer.create(
        <svg xmlns="http://www.w3.org/2000/svg" id="stage">
            <Provider store={myStore}>
                <StageConnector>
                    <ComfortStage />
                </StageConnector>
            </Provider>
        </svg>
    );

    expect(component.toJSON()).toMatchSnapshot();
    myStore.dispatch(Action.setUserFocus("Adam Hall", "in-focus"));
    expect(component.toJSON()).toMatchSnapshot();

});

test("Should allow shrinking", () => {
    // Arrange

    const myStore = createStore(comfortReducer);

    const component = renderizer.create(
        <svg xmlns="http://www.w3.org/2000/svg" id="stage">
            <Provider store={myStore}>
                <StageConnector>
                    <ComfortStage />
                </StageConnector>
            </Provider>
        </svg>
    );

    myStore.dispatch(Action.chooseZone("Adam Hall", "Stretch", 50));
    expect(component.toJSON()).toMatchSnapshot();

    myStore.dispatch(Action.chooseZone("Caroline Hall", "Chaos", 100));
    expect(component.toJSON()).toMatchSnapshot();

});


test("Should allow hiding", () => {
    // Arrange

    const myStore = createStore(comfortReducer);

    const component = renderizer.create(
        <svg xmlns="http://www.w3.org/2000/svg" id="stage">
            <Provider store={myStore}>
                <StageConnector>
                    <ComfortStage />
                </StageConnector>
            </Provider>
        </svg>
    );

    myStore.dispatch(Action.setStageVisibility("hiding"));
    expect(component.toJSON()).toMatchSnapshot();

    myStore.dispatch(Action.setStageVisibility("appearing"));
    expect(component.toJSON()).toMatchSnapshot();

});



test("Should allow users to be set okay", () => {
    // Arrange

    const myStore = createStore(comfortReducer);

    const component = renderizer.create(
        <svg xmlns="http://www.w3.org/2000/svg" id="stage">
            <Provider store={myStore}>
                <StageConnector>
                    <ComfortStage />
                </StageConnector>
            </Provider>
        </svg>
    );
    const users: IUserList = {
        Users: [
            {Username: "Test person 1"},
            {Username: "Test person 2"},
            {Username: "Test person 3"}
        ]
    };
    myStore.dispatch(Action.recieveUserList(users));
    expect(component.toJSON()).toMatchSnapshot();
});



