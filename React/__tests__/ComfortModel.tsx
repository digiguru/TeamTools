import * as React from "react";
import {ChaosArea, StretchArea, ComfortArea, ComfortReact} from "../ComfortReact";
import {Stage, BouncyAnimation} from "../SVGHelper";
const renderizer = require("react-test-renderer");

it("Should show the chaos area", () => {
    // Arrange
    const component = renderizer.create(
        <Stage><ChaosArea></ChaosArea></Stage>
    );
    const tree = component.toJSON();
    const mouseOverArea = tree.children[0].children[0];
    expect(tree).toMatchSnapshot();

    // Act snapshot 2
    mouseOverArea.props.onMouseEnter();
    // Assert Snapshot 2
    
    expect(component.toJSON()).toMatchSnapshot();

    // Act snapshot 3
    mouseOverArea.props.onMouseLeave();
    // Assert Snapshot 3
    expect(component.toJSON()).toMatchSnapshot();

});

it("Should show the stretch area", () => {
    const component = renderizer.create(
        <Stage><StretchArea></StretchArea></Stage>
    );
    const tree = component.toJSON();
    const mouseOverArea = tree.children[0].children[0];
    expect(tree).toMatchSnapshot();

    // Act snapshot 2
    mouseOverArea.props.onMouseEnter();
    // Assert Snapshot 2
    expect(component.toJSON()).toMatchSnapshot();

    // Act snapshot 3
    mouseOverArea.props.onMouseLeave();
    // Assert Snapshot 3
    expect(component.toJSON()).toMatchSnapshot();

});


it("Should show the comfort area - animated", () => {
    const component = renderizer.create(
        <Stage><ComfortArea><BouncyAnimation attributeName="r" /></ComfortArea></Stage>
    );
    expect(component.toJSON()).toMatchSnapshot();

});

it("Should show the comfort area - standard", () => {
    const component = renderizer.create(
        <Stage><ComfortArea></ComfortArea></Stage>
    );
    const tree = component.toJSON();
    
    const mouseOverArea = tree.children[0].children[0];
    expect(tree).toMatchSnapshot();

    // Act snapshot 2
    mouseOverArea.props.onMouseEnter();
    // Assert Snapshot 2
    expect(component.toJSON()).toMatchSnapshot();

    // Act snapshot 3
    mouseOverArea.props.onMouseLeave();
    // Assert Snapshot 3
    expect(component.toJSON()).toMatchSnapshot();

});
it("The complete comfort model", () => {
    const component = renderizer.create(
        <Stage width="800" height="800"><ComfortReact></ComfortReact></Stage>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

});

