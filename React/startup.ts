/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="users.tsx"/>

requirejs.config( {
    baseUrl : "/",
    paths: {
        'react': '../3rdParty/react.min',
        'react-dom': '../3rdParty/react-dom.min'
    }
});
require(["users"], (u) => {
    console.log("Loaded");
});