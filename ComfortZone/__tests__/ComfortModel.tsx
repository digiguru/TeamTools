import * as React from 'react';
import ComfortReact from '../ComfortReact';
const renderizer = require('react-test-renderer');

it('Should show the comfort model', () => {
    const component = renderizer.create(
        <ComfortReact></ComfortReact>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

});