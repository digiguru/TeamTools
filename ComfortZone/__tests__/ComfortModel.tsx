import * as React from 'react';
import {ChaosArea, StretchArea, ComfortArea, ComfortReact, Stage} from '../ComfortReact';
const renderizer = require('react-test-renderer');

it('Should show the chaos area', () => {
    const component = renderizer.create(
        <ChaosArea></ChaosArea>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    debugger;
    tree.children[0].props.onMouseEnter();
    expect(tree).toMatchSnapshot();

    tree.children[0].props.onMouseLeave();
    expect(tree).toMatchSnapshot();


});

it('Should show the stretch area', () => {
    const component = renderizer.create(
        <Stage><StretchArea></StretchArea></Stage>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

});


it('Should show the comfort area', () => {
    const component = renderizer.create(
        <Stage><ComfortArea></ComfortArea></Stage>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

});

it('Should show the comfort model', () => {
    const component = renderizer.create(
        <ComfortReact></ComfortReact>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

});

