import * as React from "react";

const renderizer = require("react-test-renderer");





it("Should show the component", () => {
    // Arrange
    /*const component = renderizer.create(
        <Stage><TuckmanComponent></TuckmanComponent></Stage>
    );*/
    expect("Hello").toMatchSnapshot();


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
