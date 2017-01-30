import * as React from "react";
import {TuckmanComponent, ChartArea} from "../TuckmanReact";
import {Stage, BouncyAnimation} from "../SVGHelper";
const renderizer = require("react-test-renderer");

it("Should show the component", () => {
    // Arrange
    const component = renderizer.create(
        <Stage><TuckmanComponent></TuckmanComponent></Stage>
    );
    expect(component.toJSON()).toMatchSnapshot();


});

it("Should show the stretch area", () => {
    // Arrange
    const component = renderizer.create(
        <Stage><ChartArea width="200" offset="100" label="example"></ChartArea></Stage>
    );
    expect(component.toJSON()).toMatchSnapshot();

});


