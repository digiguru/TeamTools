import * as React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
// import { TuckmanStage } from "../Tuckman/Component";
import { tuckmanReducer } from "../Tuckman/Reducer";
// import { Size } from "../Models/Size";
import * as Action from "../Tuckman/Actions";
import { TuckmanConnector } from "../Tuckman/Connector";
import { StageConnector } from "../Stage/Connector";
import { act } from "react-test-renderer";
// import { Stage } from "../Stage/Component";
const renderizer = require("react-test-renderer");

test("Should not mutate in any way", () => {
    const myStore = createStore(tuckmanReducer);
    const originalState = myStore.getState();
    const inputState = JSON.stringify(originalState);
    const checkAfterAction = (action) => {
        myStore.dispatch(action);
        expect(inputState).toEqual(JSON.stringify(originalState));
    };
    checkAfterAction(Action.setUserFocus("Adam Hall", "in-focus"));
    checkAfterAction(Action.selectUser("Adam Hall"));
    checkAfterAction(Action.setStageSize(800, 600));
    checkAfterAction(Action.setZoneFocus("forming", "in-focus"));
    checkAfterAction(Action.setZoneFocus("storming", "active"));
    checkAfterAction(Action.setZoneFocus("norming", "in-focus"));
    checkAfterAction(Action.setZoneFocus("performing", "in-focus"));
    checkAfterAction(Action.toggleChoiceVisibility(true));
    checkAfterAction(Action.toggleChoiceVisibility(false));
    checkAfterAction(Action.chooseZone("Adam Hall", "performing", 85));
});

test("Focusable zones", () => {
    const myStore = createStore(tuckmanReducer);
    
    myStore.dispatch(Action.setStageSize(800, 600));

    const component = renderizer.create(
            <Provider store={myStore}>
                <StageConnector>
                    <TuckmanConnector />
                </StageConnector>
            </Provider>
    );

    myStore.dispatch(Action.setZoneFocus("forming", "in-focus"));
    expect(component.toJSON()).toMatchSnapshot();
    myStore.dispatch(Action.setZoneFocus("forming", "not-in-focus"));
    myStore.dispatch(Action.setZoneFocus("storming", "in-focus"));
    expect(component.toJSON()).toMatchSnapshot();
    myStore.dispatch(Action.setZoneFocus("storming", "not-in-focus"));
    myStore.dispatch(Action.setZoneFocus("norming", "in-focus"));
    expect(component.toJSON()).toMatchSnapshot();
    myStore.dispatch(Action.setZoneFocus("norming", "not-in-focus"));
    myStore.dispatch(Action.setZoneFocus("performing", "in-focus"));
    expect(component.toJSON()).toMatchSnapshot();


});

test("Should show the component", () => {
    // Arrange
    const myStore = createStore(tuckmanReducer);
    myStore.dispatch(Action.setStageSize(800, 600));

    const component = renderizer.create(
            <Provider store={myStore}>
                <StageConnector>
                    <TuckmanConnector />
                </StageConnector>
            </Provider>
    );

    expect(component.toJSON()).toMatchSnapshot();
    myStore.dispatch(Action.setZoneFocus("forming", "in-focus"));
    expect(component.toJSON()).toMatchSnapshot();

});
/*
it("Should show the stretch area", () => {
    // Arrange
    const component = renderizer.create(
        <Stage><ChartArea width="200" offset="100" label="example"></ChartArea></Stage>
    );
    expect(component.toJSON()).toMatchSnapshot();

});


*/
