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

require(["React/Comfort/Store"], (u) => {
    u.resizeImage();
});
require(["React/Tuckman/Store"], (u) => {
    u.resizeImage();
});

(function setupFormViewability() {

    const showForm = (urlParam) => {
        window.history.pushState({}, urlParam, "/react/react.html?model=" + urlParam);
        switch (urlParam) {
            case ModelEnum.All:
                document.getElementById("tuckman").className = "hidden";
                document.getElementById("comfort").className = "hidden";
                break;
            case ModelEnum.ComfortZone:
                document.getElementById("tuckman").className = "";
                document.getElementById("comfort").className = "hidden";
                break;
            case ModelEnum.Tuckman:
                document.getElementById("tuckman").className = "hidden";
                document.getElementById("comfort").className = "";
                break;
        }
    };

    const ModelEnum = {
        All: "",
        Tuckman: "Tuckman",
        ComfortZone: "ComfortZone"
    };

    const getModelFromQuerystring = () => {
        const urlParams = document.URL.split("?model=");
        if (urlParams && urlParams.length === 1) {
            return urlParams[1];
        }
        return ModelEnum.All;
    };

    const urlParam = getModelFromQuerystring();
    showForm(urlParam);
    document.getElementById("go-tuckman").onclick = function () {
        showForm(ModelEnum.Tuckman);
    };
    document.getElementById("go-comfort").onclick = function () {
        showForm(ModelEnum.ComfortZone);
    };
})();
