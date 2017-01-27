import * as React from "react";
import {ChaosArea, StretchArea, ComfortArea, ComfortReact, Stage} from "../ComfortReact";
const renderizer = require("react-test-renderer");

it("Should show the chaos area", () => {
    //Arrange
    const component = renderizer.create(
        <Stage><ChaosArea></ChaosArea></Stage>
    );

    let tree = component.toJSON();
    const mouseOverArea = tree.children[0].children[0];
    expect(tree).toMatchSnapshot();

    //Act snapshot 1
    mouseOverArea.props.onMouseEnter();
    expect(component.toJSON()).toMatchSnapshot();

    mouseOverArea.props.onMouseLeave();

    expect(component.toJSON()).toMatchSnapshot();

});

it("Should show the stretch area", () => {
    const component = renderizer.create(
        <Stage><StretchArea></StretchArea></Stage>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

});


it("Should show the comfort area", () => {
    const component = renderizer.create(
        <Stage><ComfortArea></ComfortArea></Stage>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

});

it("Should show the comfort model", () => {
    const component = renderizer.create(
        <Stage><ComfortReact></ComfortReact></Stage>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

});

