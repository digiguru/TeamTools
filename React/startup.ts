/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="users.tsx"/>

requirejs.config( {
    baseUrl : "/",
    paths: {
        'react': '../node_modules/react/dist/react.min',
        'react-dom': '../node_modules/react-dom/dist/react-dom.min',
        'react-test-renderer': '../node_modules/react-test-renderer/index'
    }
});
require(["users"], (u) => {
    console.log("Loaded");
});