import * as React from "react";
import { createStore } from "../../3rdParty/redux.min";
import { Provider } from "../../3rdParty/react-redux.min";
import { TuckmanApp } from "../Tuckman/Component";
import { tuckmanReactApp } from "../Tuckman/Reducer";
import { Stage } from "../Stage/Component";
import { Size } from "../Models/Size";
const renderizer = require("react-test-renderer");





it("Should show the component", () => {
    // Arrange

    const myStore = createStore(tuckmanReactApp);
    const stageSize = new Size(800, 600);
    const component = renderizer.create(
        <Provider store={myStore}>
            <Stage Size={stageSize}>
                <TuckmanApp></TuckmanApp>
            </Stage>
        </Provider>
    );
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
