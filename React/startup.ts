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

require(["React/Comfort/Store", "React/Tuckman/Store"], (comfort, tuckman) => {
    comfort.resizeImage();
    tuckman.resizeImage();

    (function setupFormViewability() {

        const showForm = (formName) => {
            window.history.pushState({}, urlParam, "/react/react.html?model=" + formName);
            switch (formName) {
                case ModelEnum.All:
                    // document.getElementById("tuckman").className = "hidden";
                    // document.getElementById("comfort").className = "hidden";
                    comfort.hideModel();
                    tuckman.hideModel();
                    break;
                case ModelEnum.ComfortZone:
                    comfort.resizeImage();
                    tuckman.hideModel();
                    break;
                case ModelEnum.Tuckman:
                    // document.getElementById("tuckman").className = "";
                    // document.getElementById("comfort").className = "hidden";
                    tuckman.resizeImage();
                    comfort.hideModel();
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
            if (urlParams && urlParams.length >= 1) {
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


});


