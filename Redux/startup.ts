/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../typings/main/definitions/immutable/index.d.ts" />
/// <reference path="../typings/redux/redux.d.ts" />


requirejs.config( {
    baseUrl : "/",
    paths: {
        "react": "../3rdParty/react.min",
        "react-dom": "../3rdParty/react-dom.min",
        "immutable": "../3rdParty/immutable.min",
        "redux": "../3rdParty/redux.min"
    }
});
require(["ComfortStore"], (u) => {
    console.log("Loaded");
});