var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define("Comfort/Actions", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.ComfortActions = {
        SET_STAGESIZE: "SET_STAGESIZE",
        SET_ZONEFOCUS: "SET_ZONEFOCUS",
        SET_USERFOCUS: "SET_USERFOCUS",
        SELECT_USER: "SELECT_USER",
        CHOOSE_ZONE: "CHOOSE_ZONE",
        TOGGLE_CHOICES: "TOGGLE_CHOICES"
    };
    function setStageSize(width, height) {
        return { type: exports.ComfortActions.SET_STAGESIZE, width: width, height: height };
    }
    exports.setStageSize = setStageSize;
    function setUserFocus(user, focus) {
        return { type: exports.ComfortActions.SET_USERFOCUS, user: user, focus: focus };
    }
    exports.setUserFocus = setUserFocus;
    function setZoneFocus(area, focus) {
        return { type: exports.ComfortActions.SET_ZONEFOCUS, area: area, focus: focus };
    }
    exports.setZoneFocus = setZoneFocus;
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
define("Models/Polar", ["require", "exports"], function (require, exports) {
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
define("Models/Point", ["require", "exports", "Models/Polar"], function (require, exports, Polar_1) {
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
        Point.distanceAsPercentage = function (thisDistance, maxDistance) {
            return (thisDistance / maxDistance) * 100;
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
define("Models/IDomMeasurement", ["require", "exports"], function (require, exports) {
    "use strict";
    var DOMMeasurement = (function () {
        function DOMMeasurement(input) {
            if (input.indexOf("%") !== -1) {
                this.Value = parseInt(input.substr(0, input.indexOf("%")), 10);
                this.Unit = "%";
            }
            else if (input.indexOf("%") !== -1) {
                this.Value = parseInt(input.substr(0, input.indexOf("px")), 10);
                this.Unit = "px";
            }
            else {
                this.Value = parseInt(input, 10);
                this.Unit = "px";
            }
        }
        DOMMeasurement.prototype.toString = function () {
            return "" + this.Value + this.Unit;
        };
        ;
        return DOMMeasurement;
    }());
    exports.DOMMeasurement = DOMMeasurement;
});
define("Models/Size", ["require", "exports"], function (require, exports) {
    "use strict";
    var Size = (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        Size.prototype.shortest = function () {
            if (this.width < this.height) {
                return this.width;
            }
            else {
                return this.height;
            }
        };
        Size.prototype.longest = function () {
            if (this.width > this.height) {
                return this.width;
            }
            else {
                return this.height;
            }
        };
        return Size;
    }());
    exports.Size = Size;
});
define("User/Model", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("ComfortZone/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    var ComfortZoneRangeState = (function () {
        function ComfortZoneRangeState() {
        }
        return ComfortZoneRangeState;
    }());
    exports.ComfortZoneRangeState = ComfortZoneRangeState;
    var ComfortZoneState = (function () {
        function ComfortZoneState() {
        }
        return ComfortZoneState;
    }());
    exports.ComfortZoneState = ComfortZoneState;
});
define("Comfort/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    var ComfortUserChoiceState = (function () {
        function ComfortUserChoiceState() {
        }
        return ComfortUserChoiceState;
    }());
    exports.ComfortUserChoiceState = ComfortUserChoiceState;
    var ComfortZoneList = (function () {
        function ComfortZoneList() {
        }
        return ComfortZoneList;
    }());
    exports.ComfortZoneList = ComfortZoneList;
    var ComfortAppState = (function () {
        function ComfortAppState() {
        }
        return ComfortAppState;
    }());
    exports.ComfortAppState = ComfortAppState;
    var ComfortAppStateWithChildren = (function (_super) {
        __extends(ComfortAppStateWithChildren, _super);
        function ComfortAppStateWithChildren() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ComfortAppStateWithChildren;
    }(ComfortAppState));
    exports.ComfortAppStateWithChildren = ComfortAppStateWithChildren;
});
define("ComfortZone/Component", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    exports.ReduxChaosArea = function (state) {
        var username = state.User && state.User.Username ? state.User.Username : "Adam Hall";
        return React.createElement("g", null,
            React.createElement("rect", { id: "chaos", className: state.Zone.Focus, onMouseEnter: function () { return state.Events.onZoneOverFocus(state.Zone.Name); }, onMouseLeave: function () { return state.Events.onZoneOffFocus(state.Zone.Name); }, onMouseDown: function () { return state.Events.onZoneMouseDown(state.Zone.Name); }, onMouseUp: function (event) { return state.Events.onZoneMouseUp(username, state.Zone.Name, state.CenterPoint, state.TotalDistance, event); }, width: state.Zone.Size.Width.toString(), height: state.Zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-chaos", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20" }, "chaos"));
    };
    exports.ReduxStretchArea = function (state) {
        var username = state.User && state.User.Username ? state.User.Username : "Adam Hall";
        return React.createElement("g", null,
            React.createElement("circle", { className: state.Zone.Focus, id: "stretch", r: "33%", cx: "50%", cy: "50%", onMouseEnter: function () { return state.Events.onZoneOverFocus(state.Zone.Name); }, onMouseLeave: function () { return state.Events.onZoneOffFocus(state.Zone.Name); }, onMouseDown: function () { return state.Events.onZoneMouseDown(state.Zone.Name); }, onMouseUp: function (event) { return state.Events.onZoneMouseUp(username, state.Zone.Name, state.CenterPoint, state.TotalDistance, event); }, width: state.Zone.Size.Width.toString(), height: state.Zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-stretch", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20%" }, "stretch"));
    };
    exports.ReduxComfortArea = function (state) {
        var username = state.User && state.User.Username ? state.User.Username : "Adam Hall";
        return React.createElement("g", null,
            React.createElement("circle", { className: state.Zone.Focus, id: "stretch", r: "15%", cx: "50%", cy: "50%", onMouseEnter: function () { return state.Events.onZoneOverFocus(state.Zone.Name); }, onMouseLeave: function () { return state.Events.onZoneOffFocus(state.Zone.Name); }, onMouseDown: function () { return state.Events.onZoneMouseDown(state.Zone.Name); }, onMouseUp: function (event) { return state.Events.onZoneMouseUp(username, state.Zone.Name, state.CenterPoint, state.TotalDistance, event); }, width: state.Zone.Size.Width.toString(), height: state.Zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-stretch", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "50%" }, "comfort"));
    };
});
define("ComfortZone/Connector", ["require", "exports", "react-redux", "Comfort/Actions", "ComfortZone/Component", "Models/Point"], function (require, exports, react_redux_1, Actions_1, Component_1, Point_1) {
    "use strict";
    var mapStateToProps = function (state, ownProps) {
        var maxDistance = state.Size.shortest();
        if (ownProps.Name === "Comfort") {
            return { Zone: state.Zones.Comfort, User: state.CurrentUser, CenterPoint: state.CenterPoint, TotalDistance: maxDistance };
        }
        else if (ownProps.Name === "Chaos") {
            return { Zone: state.Zones.Chaos, User: state.CurrentUser, CenterPoint: state.CenterPoint, TotalDistance: maxDistance };
        }
        else {
            return { Zone: state.Zones.Stretch, User: state.CurrentUser, CenterPoint: state.CenterPoint, TotalDistance: maxDistance };
        }
    };
    var getCenterPointFromElement = function (el) {
        var boundingBox = el.getBBox();
        var centerX = (boundingBox.width - boundingBox.x) / 2;
        var centerY = (boundingBox.height - boundingBox.y) / 2;
        return new Point_1.Point(centerX, centerY);
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            Events: {
                onZoneMouseDown: function (zone) {
                    dispatch(Actions_1.setZoneFocus(zone, "active"));
                },
                onZoneMouseUp: function (user, zone, centerPoint, maxDistance, event) {
                    dispatch(Actions_1.setZoneFocus(zone, "not-in-focus"));
                    var coord = [event.clientX, event.clientY];
                    // const centerPoint = getCenterPointFromElement(event.currentTarget);
                    var distance = Point_1.Point.distance(centerPoint, Point_1.Point.fromCoords(coord));
                    var distanceAsPercentage = Point_1.Point.distanceAsPercentage(distance, maxDistance);
                    dispatch(Actions_1.chooseZone(user, zone, distanceAsPercentage)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
                },
                onZoneOverFocus: function (zone) {
                    dispatch(Actions_1.setZoneFocus(zone, "in-focus"));
                },
                onZoneOffFocus: function (zone) {
                    dispatch(Actions_1.setZoneFocus(zone, "not-in-focus"));
                }
            }
        };
    };
    exports.ReduxChaosConnector = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Component_1.ReduxChaosArea);
    exports.ReduxStretchConnector = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Component_1.ReduxStretchArea);
    exports.ReduxComfortConnector = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Component_1.ReduxComfortArea);
});
define("User/Component", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    exports.ReduxUserList = function (state) {
        var className = state.ShowUsers ? "appear" : "disappear";
        return React.createElement("g", { id: "users", className: className }, state.Users.map(function (user, i) {
            return React.createElement(exports.ReduxUser, __assign({ key: user.Username }, user, { events: state.events }));
        }));
    };
    exports.ReduxUser = function (state) {
        // 60 , 150, 240
        var textY = state.Y + 60;
        return React.createElement("g", { className: "user-group" },
            React.createElement("rect", { className: state.Focus, onMouseEnter: function () { return state.events.onUserOverFocus(state.Username); }, onMouseLeave: function () { return state.events.onUserOffFocus(state.Username); }, onMouseDown: function () { return state.events.onUserMouseDown(state.Username); }, onMouseUp: function (event) { return state.events.onUserMouseUp(state.Username, event); }, y: state.Y, x: "0", width: "800", height: "90" }),
            React.createElement("text", { className: "username", y: textY, x: "60" }, state.Username));
    };
});
define("User/Connector", ["require", "exports", "react-redux", "Comfort/Actions", "User/Component", "../3rdParty/immutable.min"], function (require, exports, react_redux_2, Actions_2, Component_2, immutable_min_1) {
    "use strict";
    var mapStateToProps = function (state, ownProps) {
        return {
            ShowUsers: state.UserList.ShowUsers,
            Users: state.UserList.Users.map(function (u, i) {
                return immutable_min_1.fromJS(u).set("Y", (i * 90) + 60).toJS();
            })
        };
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            events: {
                onUserMouseDown: function (user) {
                    dispatch(Actions_2.setUserFocus(user, "active"));
                },
                onUserMouseUp: function (user, event) {
                    dispatch(Actions_2.setUserFocus(user, "not-in-focus"));
                    dispatch(Actions_2.selectUser(user));
                },
                onUserOverFocus: function (user) {
                    dispatch(Actions_2.setUserFocus(user, "in-focus"));
                },
                onUserOffFocus: function (user) {
                    dispatch(Actions_2.setUserFocus(user, "not-in-focus"));
                }
            }
        };
    };
    exports.ReduxUserConnector = react_redux_2.connect(mapStateToProps, mapDispatchToProps)(Component_2.ReduxUserList);
});
// UserListConnector 
define("ComfortUserChoice/Model", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("ComfortUserChoice/Component", ["require", "exports", "react", "Models/Point", "Models/Polar"], function (require, exports, React, Point_2, Polar_2) {
    "use strict";
    exports.ReduxUserHistoryArea = function (state) {
        if (state && state.Choices.length) {
            var totalPoints = state.Choices.length;
            var radian = 6.2831853072; // 360 * Math.PI / 180;
            var polarDivision_1 = radian / totalPoints;
            var maxDistance_1 = state.MaxDistance;
            return React.createElement("g", { id: "history" }, state.Choices.map(function (userChoice, i) {
                return React.createElement(exports.ReduxUserHistory, __assign({ CenterPoint: state.CenterPoint, key: userChoice.User.Username }, userChoice, { Index: i, PolarDivision: polarDivision_1, MaxDistance: maxDistance_1 }));
            }));
        }
        else {
            return React.createElement("g", { id: "history" });
        }
    };
    exports.ReduxUserHistory = function (state) {
        var angle = state.PolarDivision * state.Index;
        var distanceAsPixels = ((state.Distance / 100) * state.MaxDistance);
        var point = Point_2.Point.toCartesian(new Polar_2.Polar(distanceAsPixels, angle), state.CenterPoint);
        return React.createElement("circle", { cx: point.x, cy: point.y, r: "10", className: "point" });
    };
});
define("ComfortUserChoice/Connector", ["require", "exports", "react-redux", "ComfortUserChoice/Component"], function (require, exports, react_redux_3, Component_3) {
    "use strict";
    var mapStateToProps = function (state) {
        return {
            Choices: state.UserChoices,
            CenterPoint: state.CenterPoint,
            MaxDistance: state.Size.shortest()
        };
    };
    exports.ReduxUserHistoryConnector = react_redux_3.connect(mapStateToProps)(Component_3.ReduxUserHistoryArea);
});
// UserListConnector
define("Stage/Model", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Stage/Component", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    exports.Stage = function (state) {
        return React.createElement("svg", { id: "stage", width: state.Size.width, height: state.Size.height }, state.InnerBits);
    };
});
define("Stage/Connector", ["require", "exports", "react-redux", "Stage/Component"], function (require, exports, react_redux_4, Component_4) {
    "use strict";
    exports.StageConnector = react_redux_4.connect(function (state, props) {
        return { Size: state.Size, InnerBits: props.children };
    })(Component_4.Stage);
});
define("Comfort/ComponentApp", ["require", "exports", "react", "ComfortZone/Connector", "User/Connector", "ComfortUserChoice/Connector"], function (require, exports, React, Connector_1, Connector_2, Connector_3) {
    "use strict";
    exports.ComfortApp = function () { return (React.createElement("g", null,
        React.createElement(Connector_1.ReduxChaosConnector, { Name: "Chaos" }),
        React.createElement(Connector_1.ReduxStretchConnector, { Name: "Stretch" }),
        React.createElement(Connector_1.ReduxComfortConnector, { Name: "Comfort" }),
        React.createElement(Connector_2.ReduxUserConnector, null),
        React.createElement(Connector_3.ReduxUserHistoryConnector, null))); };
});
define("Comfort/Reducer", ["require", "exports", "Comfort/Actions", "../3rdParty/immutable.min", "Models/Point", "Models/Size", "Models/IDomMeasurement"], function (require, exports, Actions_3, immutable_min_2, Point_3, Size_1, IDomMeasurement_1) {
    "use strict";
    var initialSize = new Size_1.Size(800, 800);
    var initialState = {
        Size: initialSize,
        CenterPoint: new Point_3.Point(initialSize.width / 2, initialSize.height / 2),
        UserList: {
            ShowUsers: true,
            Users: [
                { Username: "Adam Hall", Focus: "not-in-focus", Y: 0 },
                { Username: "Caroline Hall", Focus: "not-in-focus", Y: 0 }
            ]
        },
        Zones: {
            Comfort: { Name: "Comfort", Focus: "not-in-focus", Range: { Start: 0, End: 33 }, Size: { Width: new IDomMeasurement_1.DOMMeasurement("50%"), Height: new IDomMeasurement_1.DOMMeasurement("50%") } },
            Stretch: { Name: "Stretch", Focus: "not-in-focus", Range: { Start: 34, End: 66 }, Size: { Width: new IDomMeasurement_1.DOMMeasurement("50%"), Height: new IDomMeasurement_1.DOMMeasurement("50%") } },
            Chaos: { Name: "Chaos", Focus: "not-in-focus", Range: { Start: 67, End: 100 }, Size: { Width: new IDomMeasurement_1.DOMMeasurement("100%"), Height: new IDomMeasurement_1.DOMMeasurement("100%") } }
        },
        ShowUserChoices: false,
        UserChoices: []
    };
    function comfortReactApp(state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case Actions_3.ComfortActions.SET_STAGESIZE:
                return ComfortZoneAction.setStageSize(state, action.width, action.height);
            case Actions_3.ComfortActions.SET_USERFOCUS:
                return ComfortZoneAction.setUserFocus(state, action.user, action.focus);
            case Actions_3.ComfortActions.SET_ZONEFOCUS:
                return ComfortZoneAction.setZoneFocus(state, action.area, action.focus);
            case Actions_3.ComfortActions.SELECT_USER:
                return ComfortZoneAction.selectUser(state, action.user);
            case Actions_3.ComfortActions.CHOOSE_ZONE:
                return ComfortZoneAction.chooseZone(state, action.user, action.area, action.distance);
            case Actions_3.ComfortActions.TOGGLE_CHOICES:
                return ComfortZoneAction.toggleChoiceVisibility(state, action.visible);
            default:
                return state;
        }
    }
    exports.comfortReactApp = comfortReactApp;
    var ComfortZoneAction = (function () {
        function ComfortZoneAction() {
        }
        ComfortZoneAction.setStageSize = function (state, width, height) {
            var newCenter = new Point_3.Point(width / 2, height / 2);
            return immutable_min_2.fromJS(state)
                .set("Size", new Size_1.Size(width, height))
                .set("CenterPoint", newCenter)
                .toJS();
        };
        ComfortZoneAction.setZoneFocus = function (state, area, focus) {
            return immutable_min_2.fromJS(state)
                .setIn(["Zones", "Comfort", "Focus"], area === "Comfort" ? focus : "not-in-focus")
                .setIn(["Zones", "Stretch", "Focus"], area === "Stretch" ? focus : "not-in-focus")
                .setIn(["Zones", "Chaos", "Focus"], area === "Chaos" ? focus : "not-in-focus").toJS();
        };
        ComfortZoneAction.setUserFocus = function (state, user, focus) {
            var originalList = immutable_min_2.List(state.UserList.Users);
            var newUserList = originalList.update(originalList.findIndex(function (item) { return item.Username === user; }), function (item) { return immutable_min_2.fromJS(item).set("Focus", focus); }).toJS();
            return immutable_min_2.fromJS(state)
                .setIn(["UserList", "Users"], newUserList).toJS();
        };
        ComfortZoneAction.selectUser = function (state, user) {
            var originalList = immutable_min_2.List(state.UserList.Users);
            var item = originalList.find(function (item) { return item.Username === user; });
            // Sets currentUser, and therefor hides the user choice menu
            var data = immutable_min_2.fromJS(state)
                .set("CurrentUser", item)
                .set("ShowUserChoices", false)
                .setIn(["UserList", "ShowUsers"], false);
            return data.toJS();
        };
        ComfortZoneAction.chooseZone = function (state, user, area, distance) {
            // Add the user choice
            var newUserChoices = immutable_min_2.List(state.UserChoices).push({
                User: { Username: user },
                Zone: area,
                Distance: distance
            }).toJS();
            // Remove the user from the choice list
            var newUserList = immutable_min_2.List(state.UserList.Users).filter(function (item) { return item.Username !== user; }).toArray();
            // Show the user list
            var showUserChoice = !!(newUserList.length);
            // Return
            return immutable_min_2.fromJS(state)
                .delete("CurrentUser")
                .set("ShowUserChoices", showUserChoice)
                .set("UserChoices", newUserChoices)
                .setIn(["UserList", "Users"], newUserList)
                .setIn(["UserList", "ShowUsers"], showUserChoice).toJS();
        };
        ComfortZoneAction.toggleChoiceVisibility = function (state, visible) {
            // Set "showUserChoices" to true
            return immutable_min_2.Map(state)
                .set("ShowUserChoices", visible).toJS();
        };
        ;
        return ComfortZoneAction;
    }());
});
define("__tests__/ComfortTests", ["require", "exports", "react", "../../3rdParty/redux.min", "Comfort/ComponentApp", "Comfort/Reducer", "../../3rdParty/react-redux.min", "Comfort/Actions", "Stage/Connector"], function (require, exports, React, redux_min_1, ComponentApp_1, Reducer_1, react_redux_min_1, Action, Connector_4) {
    "use strict";
    var renderizer = require("react-test-renderer");
    test("Should not mutate in any way", function () {
        debugger;
        var myState = Reducer_1.comfortReactApp(undefined, { type: "Startup" });
        var initialState = JSON.stringify(myState);
        var checkAfterAction = function (action) {
            var currentState = Reducer_1.comfortReactApp(myState, action);
            expect(initialState).toEqual(JSON.stringify(myState));
        };
        checkAfterAction(Action.setUserFocus("Adam Hall", "in-focus"));
        checkAfterAction(Action.selectUser("Adam Hall"));
        checkAfterAction(Action.setStageSize(800, 600));
        checkAfterAction(Action.setZoneFocus("Chaos", "in-focus"));
        checkAfterAction(Action.setZoneFocus("Stretch", "active"));
        checkAfterAction(Action.setZoneFocus("Comfort", "in-focus"));
        checkAfterAction(Action.toggleChoiceVisibility(true));
        checkAfterAction(Action.toggleChoiceVisibility(false));
        checkAfterAction(Action.chooseZone("Adam Hall", "Stretch", 85));
    });
    test("Should show the component", function () {
        // Arrange
        var myStore = redux_min_1.createStore(Reducer_1.comfortReactApp);
        var component = renderizer.create(React.createElement(react_redux_min_1.Provider, { store: myStore },
            React.createElement(Connector_4.StageConnector, null,
                React.createElement(ComponentApp_1.ComfortApp, null))));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.setUserFocus("Adam Hall", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
    });
    test("Should allow shrinking", function () {
        // Arrange
        var myStore = redux_min_1.createStore(Reducer_1.comfortReactApp);
        var component = renderizer.create(React.createElement(react_redux_min_1.Provider, { store: myStore },
            React.createElement(Connector_4.StageConnector, null,
                React.createElement(ComponentApp_1.ComfortApp, null))));
        myStore.dispatch(Action.chooseZone("Adam Hall", "Stretch", 50));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.chooseZone("Caroline Hall", "Chaos", 100));
        expect(component.toJSON()).toMatchSnapshot();
    });
});
define("Animation/Component", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var BouncyAnimation = (function (_super) {
        __extends(BouncyAnimation, _super);
        function BouncyAnimation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BouncyAnimation.prototype.render = function () {
            var delay = this.props.delay || "0s";
            var duration = this.props.duration || "0.8s";
            var toValue = parseInt(this.props.value || (20), 10);
            var toValueType = this.props.valueType || "%";
            var values = [
                0 + toValueType,
                (toValue + toValue / 4) + toValueType,
                (toValue - toValue / 10) + toValueType,
                (toValue + toValue / 20) + toValueType,
                (toValue) + toValueType,
            ];
            var valuesToString = values.join(";");
            return React.createElement("animate", { attributeType: "XML", attributeName: this.props.attributeName, from: "0%", to: "20%", dur: duration, begin: delay, values: valuesToString, keyTimes: "0; 0.3; 0.6; 0.8; 1", fill: "freeze" });
        };
        return BouncyAnimation;
    }(React.Component));
    exports.BouncyAnimation = BouncyAnimation;
});
define("TuckmanZone/Model", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Tuckman/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    ;
});
define("TuckmanZone/Component", ["require", "exports", "react", "Animation/Component"], function (require, exports, React, Component_5) {
    "use strict";
    exports.TuckmanZone = function (state) {
        var index = state.index || 0;
        var textID = state.label + "-label";
        var offset = (25 * state.index) + "%";
        var textOffset = 12 + (25 * state.index) + "%";
        var delay = (0.2 * state.index) + "s";
        var className = state.focus + " area okay js-area-standard";
        /*return <g>
            <rect className={className} id={state.label}
                onMouseUp={state.events.onMouseUp}
                onMouseDown={state.events.onMouseDown}
                onMouseEnter={state.events.onMouseEnter}
                onMouseLeave={state.events.onMouseLeave}
                x="0" y="0" width="25%" height="100%">
                <BouncyAnimation attributeName="x"  value={offset} delay={delay} />
            </rect>
            <text className="area-label" id={textID} textAnchor="middle" text-anchor="middle" x={textOffset} y="50%">{state.label}</text>;
        </g>;*/
        return React.createElement("g", null,
            React.createElement("rect", { className: className, id: state.label, onMouseEnter: function () { return state.Events.onZoneOverFocus(state.label); }, onMouseLeave: function () { return state.Events.onZoneOffFocus(state.label); }, onMouseDown: function () { return state.Events.onZoneMouseDown(state.label); }, onMouseUp: function (event) { return state.Events.onZoneMouseUp(state.username, state.label, state.maxWidth, event); }, x: "0", y: "0", width: "25%", height: "100%" },
                React.createElement(Component_5.BouncyAnimation, { attributeName: "x", value: offset, delay: delay })),
            React.createElement("text", { className: "area-label", id: textID, textAnchor: "middle", "text-anchor": "middle", x: textOffset, y: "50%" }, state.label),
            ";");
    };
});
define("Tuckman/Actions", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.TuckmanActions = {
        SET_STAGESIZE: "SET_STAGESIZE",
        SET_ZONEFOCUS: "SET_ZONEFOCUS",
        SET_USERFOCUS: "SET_USERFOCUS",
        SELECT_USER: "SELECT_USER",
        CHOOSE_ZONE: "CHOOSE_ZONE",
        TOGGLE_CHOICES: "TOGGLE_CHOICES"
    };
    function setStageSize(width, height) {
        return { type: exports.TuckmanActions.SET_STAGESIZE, width: width, height: height };
    }
    exports.setStageSize = setStageSize;
    function setZoneFocus(area, focus) {
        return { type: exports.TuckmanActions.SET_ZONEFOCUS, area: area, focus: focus };
    }
    exports.setZoneFocus = setZoneFocus;
    function setUserFocus(user, focus) {
        return { type: exports.TuckmanActions.SET_USERFOCUS, user: user, focus: focus };
    }
    exports.setUserFocus = setUserFocus;
    function selectUser(user) {
        return { type: exports.TuckmanActions.SELECT_USER, user: user };
    }
    exports.selectUser = selectUser;
    function chooseZone(user, area, distance) {
        return { type: exports.TuckmanActions.CHOOSE_ZONE, user: user, area: area, distance: distance };
    }
    exports.chooseZone = chooseZone;
    function toggleChoiceVisibility(visible) {
        return { type: exports.TuckmanActions.TOGGLE_CHOICES, visible: visible };
    }
    exports.toggleChoiceVisibility = toggleChoiceVisibility;
});
define("TuckmanZone/Connector", ["require", "exports", "react-redux", "TuckmanZone/Component", "Tuckman/Actions", "Models/Point"], function (require, exports, react_redux_5, Component_6, Actions_4, Point_4) {
    "use strict";
    var mapStateToProps = function (state, props) {
        var myState = state.zones[props.label];
        myState.maxWidth = state.Size.width;
        myState.username = state.CurrentUser ? state.CurrentUser.Username : "";
        return myState;
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            Events: {
                onZoneMouseDown: function (zone) {
                    dispatch(Actions_4.setZoneFocus(zone, "active"));
                },
                onZoneMouseUp: function (user, zone, maxDistance, event) {
                    dispatch(Actions_4.setZoneFocus(zone, "not-in-focus"));
                    var distance = event.clientX;
                    var distanceAsPercentage = Point_4.Point.distanceAsPercentage(distance, maxDistance);
                    dispatch(Actions_4.chooseZone(user, zone, distanceAsPercentage)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
                },
                onZoneOverFocus: function (zone) {
                    dispatch(Actions_4.setZoneFocus(zone, "in-focus"));
                },
                onZoneOffFocus: function (zone) {
                    dispatch(Actions_4.setZoneFocus(zone, "not-in-focus"));
                }
            }
        };
    };
    exports.TuckmanZoneConnector = react_redux_5.connect(mapStateToProps, mapDispatchToProps)(Component_6.TuckmanZone);
});
define("TuckmanUserChoice/Model", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("TuckmanUserChoice/Component", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    exports.TuckmanUserHistoryArea = function (state) {
        if (state && state.Choices.length) {
            var totalPoints_1 = state.Choices.length;
            var maxWidth_1 = state.MaxWidth;
            return React.createElement("g", { id: "history" }, state.Choices.map(function (userChoice, i) {
                return React.createElement(exports.TuckmanUserHistory, { key: userChoice.User.Username, Index: i, MaxWidth: maxWidth_1, MaxHeight: state.MaxHeight, Distance: userChoice.Distance, TotalCount: totalPoints_1 });
            }));
        }
        else {
            return React.createElement("g", { id: "history" });
        }
    };
    exports.TuckmanUserHistory = function (state) {
        var x = ((state.MaxWidth / 100) * state.Distance);
        var y = (state.MaxHeight / state.TotalCount) * state.Index;
        return React.createElement("circle", { cx: x, cy: y, r: "10", className: "point" });
    };
});
define("TuckmanUserChoice/Connector", ["require", "exports", "react-redux", "TuckmanUserChoice/Component"], function (require, exports, react_redux_6, Component_7) {
    "use strict";
    var mapStateToProps = function (state) {
        return {
            Choices: state.UserChoices,
            MaxWidth: state.Size.width,
            MaxHeight: state.Size.height
        };
    };
    exports.TuckmanUserHistoryConnector = react_redux_6.connect(mapStateToProps)(Component_7.TuckmanUserHistoryArea);
});
// UserListConnector
define("Tuckman/Component", ["require", "exports", "react", "User/Connector", "TuckmanZone/Connector", "TuckmanUserChoice/Connector"], function (require, exports, React, Connector_5, Connector_6, Connector_7) {
    "use strict";
    exports.TuckmanStage = function (state) {
        var mod = state;
        var perf = mod.zones.performing;
        return React.createElement("g", null,
            React.createElement("g", { id: "zones" },
                React.createElement(Connector_6.TuckmanZoneConnector, { label: "performing" }),
                React.createElement(Connector_6.TuckmanZoneConnector, { label: "norming" }),
                React.createElement(Connector_6.TuckmanZoneConnector, { label: "storming" }),
                React.createElement(Connector_6.TuckmanZoneConnector, { label: "forming" })),
            React.createElement(Connector_5.ReduxUserConnector, null),
            React.createElement(Connector_7.TuckmanUserHistoryConnector, null));
    };
});
define("Tuckman/Reducer", ["require", "exports", "../3rdParty/immutable.min", "Models/Size", "Models/Point", "Tuckman/Actions"], function (require, exports, immutable_min_3, Size_2, Point_5, Actions_5) {
    "use strict";
    var initialSize = new Size_2.Size(800, 800);
    var initialState = {
        UserList: {
            ShowUsers: true,
            Users: [
                { Username: "Adam Hall", Focus: "not-in-focus", Y: 0 },
                { Username: "Caroline Hall", Focus: "not-in-focus", Y: 0 }
            ]
        },
        Size: initialSize,
        zones: {
            forming: { index: 0, label: "forming", focus: "not-in-focus", Events: undefined },
            storming: { index: 1, label: "storming", focus: "not-in-focus", Events: undefined },
            norming: { index: 2, label: "norming", focus: "not-in-focus", Events: undefined },
            performing: { index: 3, label: "performing", focus: "not-in-focus", Events: undefined }
        },
        UserChoices: []
    };
    function tuckmanReactApp(state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case Actions_5.TuckmanActions.SET_STAGESIZE:
                return TuckmanZoneAction.setStageSize(state, action.width, action.height);
            case Actions_5.TuckmanActions.SET_USERFOCUS:
                return TuckmanZoneAction.setUserFocus(state, action.user, action.focus);
            case Actions_5.TuckmanActions.SET_ZONEFOCUS:
                return TuckmanZoneAction.setZoneFocus(state, action.area, action.focus);
            case Actions_5.TuckmanActions.SELECT_USER:
                return TuckmanZoneAction.selectUser(state, action.user);
            case Actions_5.TuckmanActions.CHOOSE_ZONE:
                return TuckmanZoneAction.chooseZone(state, action.user, action.area, action.distance);
            case Actions_5.TuckmanActions.TOGGLE_CHOICES:
                return TuckmanZoneAction.toggleChoiceVisibility(state, action.visible);
            default:
                return state;
        }
    }
    exports.tuckmanReactApp = tuckmanReactApp;
    var TuckmanZoneAction = (function () {
        function TuckmanZoneAction() {
        }
        TuckmanZoneAction.setStageSize = function (state, width, height) {
            var newCenter = new Point_5.Point(width / 2, height / 2);
            return immutable_min_3.fromJS(state)
                .set("Size", new Size_2.Size(width, height))
                .set("CenterPoint", newCenter)
                .toJS();
        };
        TuckmanZoneAction.setZoneFocus = function (state, area, focus) {
            return immutable_min_3.fromJS(state)
                .setIn(["zones", "forming", "focus"], area === "forming" ? focus : "not-in-focus")
                .setIn(["zones", "storming", "focus"], area === "storming" ? focus : "not-in-focus")
                .setIn(["zones", "norming", "focus"], area === "norming" ? focus : "not-in-focus")
                .setIn(["zones", "performing", "focus"], area === "performing" ? focus : "not-in-focus").toJS();
        };
        TuckmanZoneAction.setUserFocus = function (state, user, focus) {
            var originalList = immutable_min_3.List(state.UserList.Users);
            var newUserList = originalList.update(originalList.findIndex(function (item) { return item.Username === user; }), function (item) { return immutable_min_3.fromJS(item).set("Focus", focus); }).toJS();
            return immutable_min_3.fromJS(state)
                .setIn(["UserList", "Users"], newUserList).toJS();
        };
        TuckmanZoneAction.selectUser = function (state, user) {
            var originalList = immutable_min_3.List(state.UserList.Users);
            var item = originalList.find(function (item) { return item.Username === user; });
            // Sets currentUser, and therefor hides the user choice menu
            var data = immutable_min_3.fromJS(state)
                .set("CurrentUser", item)
                .set("ShowUserChoices", false)
                .setIn(["UserList", "ShowUsers"], false);
            return data.toJS();
        };
        TuckmanZoneAction.chooseZone = function (state, user, area, distance) {
            // Add the user choice
            var newUserChoices = immutable_min_3.List(state.UserChoices).push({
                User: { Username: user },
                Zone: area,
                Distance: distance
            }).toJS();
            // Remove the user from the choice list
            var newUserList = immutable_min_3.List(state.UserList.Users).filter(function (item) { return item.Username !== user; }).toArray();
            // Show the user list
            var showUserChoice = !!(newUserList.length);
            // Return
            return immutable_min_3.fromJS(state)
                .delete("CurrentUser")
                .set("ShowUserChoices", showUserChoice)
                .set("UserChoices", newUserChoices)
                .setIn(["UserList", "Users"], newUserList)
                .setIn(["UserList", "ShowUsers"], showUserChoice).toJS();
        };
        TuckmanZoneAction.toggleChoiceVisibility = function (state, visible) {
            // Set "showUserChoices" to true
            return immutable_min_3.Map(state)
                .set("ShowUserChoices", visible).toJS();
        };
        ;
        return TuckmanZoneAction;
    }());
});
define("Tuckman/Connector", ["require", "exports", "react-redux", "Tuckman/Component"], function (require, exports, react_redux_7, Component_8) {
    "use strict";
    var mapStateToProps = function (state) {
        return state;
    };
    exports.TuckmanConnector = react_redux_7.connect(mapStateToProps)(Component_8.TuckmanStage);
});
define("__tests__/TuckmanTests", ["require", "exports", "react", "../../3rdParty/redux.min", "../../3rdParty/react-redux.min", "Tuckman/Reducer", "Tuckman/Actions", "Tuckman/Connector", "Stage/Connector"], function (require, exports, React, redux_min_2, react_redux_min_2, Reducer_2, Action, Connector_8, Connector_9) {
    "use strict";
    var renderizer = require("react-test-renderer");
    test("Should not mutate in any way", function () {
        var myStore = redux_min_2.createStore(Reducer_2.tuckmanReactApp);
        var originalState = myStore.getState();
        var inputState = JSON.stringify(originalState);
        var checkAfterAction = function (action) {
            myStore.dispatch(action);
            expect(inputState).toEqual(JSON.stringify(originalState));
        };
        checkAfterAction(Action.setUserFocus("Adam Hall", "in-focus"));
        checkAfterAction(Action.selectUser("Adam Hall"));
        checkAfterAction(Action.setStageSize(800, 600));
        checkAfterAction(Action.setZoneFocus("forming", "in-focus"));
        checkAfterAction(Action.setZoneFocus("storming", "active"));
        checkAfterAction(Action.setZoneFocus("norming", "in-focus"));
        checkAfterAction(Action.setZoneFocus("performing", "in-focus"));
        checkAfterAction(Action.toggleChoiceVisibility(true));
        checkAfterAction(Action.toggleChoiceVisibility(false));
        checkAfterAction(Action.chooseZone("Adam Hall", "performing", 85));
    });
    test("Focusable zones", function () {
        var myStore = redux_min_2.createStore(Reducer_2.tuckmanReactApp);
        myStore.dispatch(Action.setStageSize(800, 600));
        var component = renderizer.create(React.createElement(react_redux_min_2.Provider, { store: myStore },
            React.createElement(Connector_9.StageConnector, null,
                React.createElement(Connector_8.TuckmanConnector, null))));
        myStore.dispatch(Action.setZoneFocus("forming", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.setZoneFocus("forming", "not-in-focus"));
        myStore.dispatch(Action.setZoneFocus("storming", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.setZoneFocus("storming", "not-in-focus"));
        myStore.dispatch(Action.setZoneFocus("norming", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.setZoneFocus("norming", "not-in-focus"));
        myStore.dispatch(Action.setZoneFocus("performing", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
    });
    test("Should show the component", function () {
        // Arrange
        var myStore = redux_min_2.createStore(Reducer_2.tuckmanReactApp);
        myStore.dispatch(Action.setStageSize(800, 600));
        var component = renderizer.create(React.createElement(react_redux_min_2.Provider, { store: myStore },
            React.createElement(Connector_9.StageConnector, null,
                React.createElement(Connector_8.TuckmanConnector, null))));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Action.setZoneFocus("forming", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
    });
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
define("Shared/WindowHelper", ["require", "exports", "Models/Size"], function (require, exports, Size_3) {
    "use strict";
    function getWidthHeight() {
        var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
        return new Size_3.Size(x, y);
    }
    exports.getWidthHeight = getWidthHeight;
});
define("Comfort/Store", ["require", "exports", "react", "redux", "Comfort/ComponentApp", "Comfort/Reducer", "react-dom", "react-redux", "Comfort/Actions", "Shared/WindowHelper", "Stage/Connector"], function (require, exports, React, Redux, ComponentApp_2, Reducer_3, react_dom_1, react_redux_8, Actions_6, WindowHelper_1, Connector_10) {
    "use strict";
    exports.myStore = Redux.createStore(Reducer_3.comfortReactApp);
    var unsubscribe = exports.myStore.subscribe(function () {
        return console.log(exports.myStore.getState());
    });
    react_dom_1.render(React.createElement(react_redux_8.Provider, { store: exports.myStore },
        React.createElement(Connector_10.StageConnector, null,
            React.createElement(ComponentApp_2.ComfortApp, null))), document.getElementById("comfort"));
    function resizeImage() {
        var size = WindowHelper_1.getWidthHeight();
        if (size.width > size.height) {
            exports.myStore.dispatch(Actions_6.setStageSize(size.height, size.height));
        }
        else {
            exports.myStore.dispatch(Actions_6.setStageSize(size.width, size.width));
        }
    }
    exports.resizeImage = resizeImage;
    window.addEventListener("resize", resizeImage, false);
});
// Stop listening to state updates
// unsubscribe(); ;
define("Shared/SVGEvents", ["require", "exports", "Models/Point"], function (require, exports, Point_6) {
    "use strict";
    var SVGEvents = (function () {
        function SVGEvents() {
        }
        SVGEvents.getDistance = function (x, y, target) {
            return Point_6.Point.distance(new Point_6.Point(x, y), SVGEvents.getCenter(target));
        };
        SVGEvents.getCenter = function (target) {
            var rect = target.getBoundingClientRect();
            return new Point_6.Point(rect.left + (rect.width / 2), rect.top + (rect.height / 2));
        };
        return SVGEvents;
    }());
    exports.SVGEvents = SVGEvents;
});
define("Shared/Events", ["require", "exports", "Shared/SVGEvents"], function (require, exports, SVGEvents_1) {
    "use strict";
    var Events = (function () {
        function Events() {
        }
        Events.calculateDistance = function (distance) {
            if (distance < 34) {
                return "comfort";
            }
            else if (distance < 67) {
                return "stretch";
            }
            else {
                return "chaos";
            }
        };
        Events.mouseEnter = function () {
            this.setState({ focus: "in-focus" });
        };
        Events.mouseDown = function () {
            this.setState({ focus: "active" });
        };
        Events.mouseUp = function (a) {
            var target = a.target;
            var center = SVGEvents_1.SVGEvents.getCenter(target);
            var distance = SVGEvents_1.SVGEvents.getDistance(a.clientX, a.clientY, target);
            this.setState({ focus: "not-in-focus" });
        };
        Events.mouseLeave = function () {
            this.setState({ focus: "not-in-focus" });
        };
        return Events;
    }());
    exports.Events = Events;
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
        "immutability-helper": "../3rdParty/index",
        "redux": "../3rdParty/redux.min",
        "react-redux": "../3rdParty/react-redux.min",
    }
});
require(["Comfort/Store"], function (u) {
    u.resizeImage();
});
require(["Tuckman/Store"], function (u) {
    u.resizeImage();
});
document.getElementById("go-tuckman").onclick = function () {
    document.getElementById("comfort").className = "hidden";
    document.getElementById("tuckman").className = "";
};
document.getElementById("go-comfort").onclick = function () {
    document.getElementById("comfort").className = "";
    document.getElementById("tuckman").className = "hidden";
};
define("Tuckman/Store", ["require", "exports", "react", "redux", "react-dom", "react-redux", "Tuckman/Actions", "Shared/WindowHelper", "Tuckman/Connector", "Stage/Connector", "Tuckman/Reducer"], function (require, exports, React, Redux, react_dom_2, react_redux_9, Actions_7, WindowHelper_2, Connector_11, Connector_12, Reducer_4) {
    "use strict";
    exports.myStore = Redux.createStore(Reducer_4.tuckmanReactApp);
    var unsubscribe = exports.myStore.subscribe(function () {
        return console.log(exports.myStore.getState());
    });
    react_dom_2.render(React.createElement(react_redux_9.Provider, { store: exports.myStore },
        React.createElement(Connector_12.StageConnector, null,
            React.createElement(Connector_11.TuckmanConnector, null))), document.getElementById("tuckman"));
    function resizeImage() {
        var size = WindowHelper_2.getWidthHeight();
        if (size.width > size.height) {
            exports.myStore.dispatch(Actions_7.setStageSize(size.height, size.height));
        }
        else {
            exports.myStore.dispatch(Actions_7.setStageSize(size.width, size.width));
        }
    }
    exports.resizeImage = resizeImage;
    window.addEventListener("resize", resizeImage, false);
});
// Stop listening to state updates
// unsubscribe(); ;

//# sourceMappingURL=compiled.js.map
