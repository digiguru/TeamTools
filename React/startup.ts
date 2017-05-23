/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../typings/main/definitions/immutable/index.d.ts" />
/// <reference path="../typings/redux/redux.d.ts" />


requirejs.config( {
    baseUrl : "/",
    paths: {
        "react"              : "../3rdParty/react.min",
        "react-dom"          : "../3rdParty/react-dom.min",
        "immutable"          : "../3rdParty/immutable.min",
        "immutability-helper": "../3rdParty/index",
        "redux"              : "../3rdParty/redux.min",
        "react-redux"        : "../3rdParty/react-redux.min",
    }
});

require(["Comfort/Store"], (u) => {
    u.resizeImage();
});
require(["Tuckman/Store"], (u) => {
    u.resizeImage();
});

(function setupFormViewability() {
    document.getElementById("go-tuckman").onclick = function () {
        document.getElementById("comfort").className = "hidden";
        document.getElementById("tuckman").className = "";
    };
    document.getElementById("go-comfort").onclick = function () {
        document.getElementById("comfort").className = "";
        document.getElementById("tuckman").className = "hidden";
    };
})();
