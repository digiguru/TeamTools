define("ComfortActions", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.ComfortActions = {
        SET_FOCUS: "SET_FOCUS",
        SELECT_USER: "SELECT_USER",
        CHOOSE_ZONE: "CHOOSE_ZONE",
        TOGGLE_CHOICES: "TOGGLE_CHOICES"
    };
    /*
    export function setFocusToComfort() {
        return {type: ComfortActions.SET_FOCUS, area: "comfort"};
    };
    export function selectUserAdam() {
        return {type: ComfortActions.SELECT_USER, user: "Adam"};
    }
    export function adamChooseZoneStretch165() {
        return {type: ComfortActions.CHOOSE_ZONE, user: "Adam", area: "Stretch", distance: "165"};
    }
    */
    function setFocus(area) {
        return { type: exports.ComfortActions.SET_FOCUS, area: area };
    }
    exports.setFocus = setFocus;
    ;
    function selectUser(user) {
        return { type: exports.ComfortActions.SELECT_USER, user: user };
    }
    exports.selectUser = selectUser;
    function chooseZone(user, area, distance) {
        return { type: exports.ComfortActions.CHOOSE_ZONE, user: user, area: area, distance: distance };
    }
    exports.chooseZone = chooseZone;
    function toggleChoiceVisibility(visible) {
        return { type: exports.ComfortActions.TOGGLE_CHOICES, visible: visible };
    }
    exports.toggleChoiceVisibility = toggleChoiceVisibility;
});
define("ComfortReactModelState", ["require", "exports", "immutable"], function (require, exports, immutable_1) {
    "use strict";
    var ChaosPickerUserChoiceState = (function () {
        function ChaosPickerUserChoiceState() {
        }
        return ChaosPickerUserChoiceState;
    }());
    exports.ChaosPickerUserChoiceState = ChaosPickerUserChoiceState;
    var ChaosPickerZoneRangeState = (function () {
        function ChaosPickerZoneRangeState() {
        }
        return ChaosPickerZoneRangeState;
    }());
    exports.ChaosPickerZoneRangeState = ChaosPickerZoneRangeState;
    var ChaosPickerZoneState = (function () {
        function ChaosPickerZoneState() {
        }
        return ChaosPickerZoneState;
    }());
    exports.ChaosPickerZoneState = ChaosPickerZoneState;
    var ChaosPickerState = (function () {
        function ChaosPickerState() {
        }
        return ChaosPickerState;
    }());
    exports.ChaosPickerState = ChaosPickerState;
    var ChaosPickerStateFactory = (function () {
        function ChaosPickerStateFactory() {
        }
        ChaosPickerStateFactory.prototype.dummy = function () {
            var userList = [
                "Adam",
                "Caroline",
                "Lucas"
            ];
            var zones = [
                { Name: "Comfort", Focus: false, Range: { Start: 0, End: 100 } },
                { Name: "Stretch", Focus: true, Range: { Start: 100, End: 200 } },
                { Name: "Chaos", Focus: false, Range: { Start: 200, End: 300 } }
            ];
            var userChoices = [
                { User: "Adam", Zone: "Stretch", Distance: 165 },
                { User: "Caroline", Zone: "Comfort", Distance: 28 }
            ];
            return {
                UserList: immutable_1.List(userList),
                CurrentUser: "Lucas",
                Zones: immutable_1.List(zones),
                ShowUserChoices: false,
                UserChoices: immutable_1.List(userChoices)
            };
        };
        return ChaosPickerStateFactory;
    }());
    exports.ChaosPickerStateFactory = ChaosPickerStateFactory;
});
define("ComfortReactReducer", ["require", "exports", "ComfortActions", "immutable"], function (require, exports, ComfortActions_1, immutable_2) {
    "use strict";
    var initialState = {
        UserList: immutable_2.List([]),
        Zones: immutable_2.List([
            { Name: "Comfort", Focus: false, Range: { Start: 0, End: 100 } },
            { Name: "Stretch", Focus: false, Range: { Start: 100, End: 200 } },
            { Name: "Chaos", Focus: false, Range: { Start: 200, End: 300 } }
        ]),
        ShowUserChoices: false,
        UserChoices: immutable_2.List([])
    };
    function comfortReactApp(state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case ComfortActions_1.ComfortActions.SET_FOCUS:
                return ComfortZoneAction.setFocus(state, action.area);
            case ComfortActions_1.ComfortActions.SELECT_USER:
                return ComfortZoneAction.selectUser(state, action.user);
            case ComfortActions_1.ComfortActions.CHOOSE_ZONE:
                return ComfortZoneAction.chooseZone(state, action.user, action.area, action.distance);
            case ComfortActions_1.ComfortActions.TOGGLE_CHOICES:
                return ComfortZoneAction.toggleChoiceVisibility(state, action.visible);
            default:
                return state;
        }
    }
    exports.comfortReactApp = comfortReactApp;
    var ComfortZoneAction = (function () {
        function ComfortZoneAction() {
        }
        ComfortZoneAction.setFocus = function (state, area) {
            // Set focus to true on this zone, and all others to false.
            state.Zones = state.Zones.map(function (v, i) {
                var data = immutable_2.Map(v).set("Focus", (v.Name === area));
                return data.toJS();
            }).toList();
            return state;
        };
        ComfortZoneAction.selectUser = function (state, user) {
            // Sets currentUser, and therefor hides the user choice menu
            /*return Object.assign({}, state, {
                CurrentUser: user,
                ShowUserChoices: false
            });*/
            var data = immutable_2.Map(state)
                .set("CurrentUser", user)
                .set("ShowUserChoices", false);
            return data.toJS();
        };
        ComfortZoneAction.chooseZone = function (state, user, area, distance) {
            // Adds to UserChoices, and sets currentUser to empty
            var data = state.UserChoices.push({
                User: user,
                Zone: area,
                Distance: distance
            });
            return immutable_2.Map(state)
                .delete("CurrentUser")
                .set("UserChoices", data).toJS();
        };
        ComfortZoneAction.toggleChoiceVisibility = function (state, visible) {
            // Set "showUserChoices" to true
            return immutable_2.Map(state)
                .set("ShowUserChoices", visible).toJS();
        };
        return ComfortZoneAction;
    }());
});
define("ComfortStore", ["require", "exports", "../3rdParty/redux.min", "ComfortActions", "ComfortReactReducer"], function (require, exports, Redux, ComfortActions_2, ComfortReactReducer_1) {
    "use strict";
    var store = Redux.createStore(ComfortReactReducer_1.comfortReactApp);
    console.log(store.getState());
    var unsubscribe = store.subscribe(function () {
        return console.log(store.getState());
    });
    // Dispatch some actions
    store.dispatch(ComfortActions_2.setFocus("Chaos"));
    store.dispatch(ComfortActions_2.setFocus("Comfort"));
    store.dispatch(ComfortActions_2.setFocus("Stretch"));
    store.dispatch(ComfortActions_2.selectUser("Adam Hall"));
    store.dispatch(ComfortActions_2.chooseZone("Adam Hall", "Chaos", 150));
    store.dispatch(ComfortActions_2.toggleChoiceVisibility(true));
    // Stop listening to state updates
    unsubscribe();
});
define("Polar", ["require", "exports"], function (require, exports) {
    "use strict";
    var Polar = (function () {
        function Polar(radius, angle) {
            this.radius = radius;
            this.angle = angle;
        }
        return Polar;
    }());
    exports.Polar = Polar;
});
define("Point", ["require", "exports", "Polar"], function (require, exports, Polar_1) {
    "use strict";
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.fromCoords = function (coords) {
            return new Point(coords[0], coords[1]);
        };
        Point.fromOffset = function (point, origin) {
            var dx = point.x - origin.x;
            var dy = point.y - origin.y;
            return new Point(dx, dy);
        };
        Point.toOffset = function (point, origin) {
            var dx = point.x + origin.x;
            var dy = point.y + origin.y;
            return new Point(dx, dy);
        };
        Point.distance = function (point, origin) {
            var offset = Point.fromOffset(point, origin);
            return Point.distanceFromOffset(offset);
        };
        Point.distanceFromOffset = function (offset) {
            return Math.sqrt(offset.x * offset.x + offset.y * offset.y);
        };
        Point.toCartesianNoOffset = function (polar) {
            var x = polar.radius * Math.cos(polar.angle);
            var y = polar.radius * Math.sin(polar.angle);
            return new Point(x, y);
        };
        Point.toCartesian = function (polar, origin) {
            var point = Point.toCartesianNoOffset(polar);
            return Point.toOffset(point, origin);
        };
        Point.toPolar = function (point, origin) {
            var offset = Point.fromOffset(point, origin);
            var radius = Point.distanceFromOffset(offset);
            var angle = Math.atan2(offset.y, offset.x);
            return new Polar_1.Polar(radius, angle);
        };
        return Point;
    }());
    exports.Point = Point;
});
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../typings/main/definitions/immutable/index.d.ts" />
/// <reference path="../typings/redux/redux.d.ts" />
requirejs.config({
    baseUrl: "/",
    paths: {
        "react": "../3rdParty/react.min",
        "react-dom": "../3rdParty/react-dom.min",
        "immutable": "../3rdParty/immutable.min",
        "redux": "../3rdParty/redux.min"
    }
});
require(["ComfortStore"], function (u) {
    console.log("Loaded");
});

//# sourceMappingURL=compiled.js.map
