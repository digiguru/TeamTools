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

// require(["React/Store"], (store) => {
require(["React/Comfort/Store", "React/Tuckman/Store", "React/User/UserStore"], (comfortStore, tuckmanStore, userInputComponent) => {
// require(["React/Comfort/Store"], (comfortStore) => {
// require(["React/Tuckman/Store"], (tuckmanStore) => {

    // comfort.resizeImage();
    // tuckman.resizeImage();

    (function setupFormViewability() {

        const showForm = (formName) => {
            window.history.pushState({}, urlParam, "/react/react.html?model=" + formName);
            switch (formName) {
                case ModelEnum.All:
                    // document.getElementById("tuckman").className = "hidden";
                    // document.getElementById("comfort").className = "hidden";
                    console.log("GO", tuckmanStore.getStore().getState());
                    // comfortStore.hideModel();
                    comfortStore.myComfortStore.dispatch({type: "SET_STAGEVISIBLE", visibility: "appearing"});
                    tuckmanStore.myTuckmanStore.dispatch({type: "SET_STAGEVISIBLE", visibility: "appearing"});
                    break;
                case ModelEnum.ComfortZone:
                    // comfortStore.resizeImage();
                    tuckmanStore.myTuckmanStore.dispatch({type: "SET_STAGEVISIBLE", visibility: "hiding"});
                    comfortStore.myComfortStore.dispatch({type: "SET_STAGEVISIBLE", visibility: "appearing"});
                    break;
                case ModelEnum.Tuckman:
                    // document.getElementById("tuckman").className = "";
                    // document.getElementById("comfort").className = "hidden";
                    comfortStore.myComfortStore.dispatch({type: "SET_STAGEVISIBLE", visibility: "hiding"});
                    tuckmanStore.myTuckmanStore.dispatch({type: "SET_STAGEVISIBLE", visibility: "appearing"});
                    // comfortStore.hideModel();
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
        document.getElementById("tuckman").onclick = function () {
            showForm(ModelEnum.Tuckman);
        };
        document.getElementById("comfort").onclick = function () {
            showForm(ModelEnum.ComfortZone);
        };
    })();


});


