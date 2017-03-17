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
define("SVGHelper", ["require", "exports", "react", "Models/Point"], function (require, exports, React, Point_1) {
    "use strict";
    var SVGEvents = (function () {
        function SVGEvents() {
        }
        SVGEvents.getDistance = function (x, y, target) {
            return Point_1.Point.distance(new Point_1.Point(x, y), SVGEvents.getCenter(target));
        };
        SVGEvents.getCenter = function (target) {
            var rect = target.getBoundingClientRect();
            return new Point_1.Point(rect.left + (rect.width / 2), rect.top + (rect.height / 2));
        };
        return SVGEvents;
    }());
    exports.SVGEvents = SVGEvents;
    var Events = (function () {
        function Events() {
        }
        Events.calculateDistance = function (distance) {
            if (distance < 100) {
                return "comfort";
            }
            else if (distance < 300) {
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
            var center = SVGEvents.getCenter(target);
            var distance = SVGEvents.getDistance(a.clientX, a.clientY, target);
            console.log(distance);
            this.setState({ focus: "not-in-focus" });
        };
        Events.mouseLeave = function () {
            this.setState({ focus: "not-in-focus" });
        };
        return Events;
    }());
    exports.Events = Events;
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                width: "800",
                height: "800"
            };
            return _this;
        }
        Stage.prototype.render = function () {
            return React.createElement("svg", { id: "stage", width: this.state.width, height: this.state.height }, this.props.children);
        };
        return Stage;
    }(React.Component));
    exports.Stage = Stage;
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
    function chooseZone(user, area, distance, x, y) {
        return { type: exports.ComfortActions.CHOOSE_ZONE, user: user, area: area, distance: distance, x: x, y: y };
    }
    exports.chooseZone = chooseZone;
    function toggleChoiceVisibility(visible) {
        return { type: exports.ComfortActions.TOGGLE_CHOICES, visible: visible };
    }
    exports.toggleChoiceVisibility = toggleChoiceVisibility;
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
define("User/Connector", ["require", "exports", "react-redux", "Comfort/Actions", "User/Component", "immutable"], function (require, exports, react_redux_1, Actions_1, Component_1, immutable_1) {
    "use strict";
    var mapStateToProps = function (state, ownProps) {
        return {
            ShowUsers: state.UserList.ShowUsers,
            Users: state.UserList.Users.map(function (u, i) {
                return immutable_1.fromJS(u).set("Y", (i * 90) + 60).toJS();
            })
        };
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            events: {
                onUserMouseDown: function (user) {
                    dispatch(Actions_1.setUserFocus(user, "active"));
                },
                onUserMouseUp: function (user, event) {
                    dispatch(Actions_1.setUserFocus(user, "not-in-focus"));
                    /*const coord = [event.clientX, event.clientY];
                    const centerPoint = getCenterPointFromElement(event.currentTarget);
                    const distance = Point.distance(centerPoint, Point.fromCoords(coord));*/
                    dispatch(Actions_1.selectUser(user)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
                },
                onUserOverFocus: function (user) {
                    dispatch(Actions_1.setUserFocus(user, "in-focus"));
                },
                onUserOffFocus: function (user) {
                    dispatch(Actions_1.setUserFocus(user, "not-in-focus"));
                }
            }
        };
    };
    exports.ReduxUserConnector = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Component_1.ReduxUserList);
});
// UserListConnector 
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
        return Size;
    }());
    exports.Size = Size;
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
    var ChaosPickerUserChoiceState = (function () {
        function ChaosPickerUserChoiceState() {
        }
        return ChaosPickerUserChoiceState;
    }());
    exports.ChaosPickerUserChoiceState = ChaosPickerUserChoiceState;
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
});
define("ComfortZone/Component", ["require", "exports", "react", "react-redux"], function (require, exports, React, react_redux_2) {
    "use strict";
    exports.Stage = function (state) {
        var children = state.children;
        return React.createElement("svg", { id: "stage", width: state.Size.width, height: state.Size.height }, children);
    };
    exports.StageConnector = react_redux_2.connect(function (state) {
        return state;
    })(exports.Stage);
    exports.ReduxChaosArea = function (state) {
        return React.createElement("g", null,
            React.createElement("rect", { id: "chaos", className: state.Zone.Focus, onMouseEnter: function () { return state.Events.onZoneOverFocus(state.Zone.Name); }, onMouseLeave: function () { return state.Events.onZoneOffFocus(state.Zone.Name); }, onMouseDown: function () { return state.Events.onZoneMouseDown(state.Zone.Name); }, onMouseUp: function (event) { return state.Events.onZoneMouseUp(state.User, state.Zone.Name, state.CenterPoint, event); }, width: state.Zone.Size.Width.toString(), height: state.Zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-chaos", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20" }, "chaos"));
    };
    exports.ReduxStretchArea = function (state) {
        return React.createElement("g", null,
            React.createElement("circle", { className: state.Zone.Focus, id: "stretch", r: "33%", cx: "50%", cy: "50%", onMouseEnter: function () { return state.Events.onZoneOverFocus(state.Zone.Name); }, onMouseLeave: function () { return state.Events.onZoneOffFocus(state.Zone.Name); }, onMouseDown: function () { return state.Events.onZoneMouseDown(state.Zone.Name); }, onMouseUp: function (event) { return state.Events.onZoneMouseUp(state.User, state.Zone.Name, state.CenterPoint, event); }, width: state.Zone.Size.Width.toString(), height: state.Zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-stretch", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20%" }, "stretch"));
    };
    exports.ReduxComfortArea = function (state) {
        return React.createElement("g", null,
            React.createElement("circle", { className: state.Zone.Focus, id: "stretch", r: "15%", cx: "50%", cy: "50%", onMouseEnter: function () { return state.Events.onZoneOverFocus(state.Zone.Name); }, onMouseLeave: function () { return state.Events.onZoneOffFocus(state.Zone.Name); }, onMouseDown: function () { return state.Events.onZoneMouseDown(state.Zone.Name); }, onMouseUp: function (event) { return state.Events.onZoneMouseUp(state.User, state.Zone.Name, state.CenterPoint, event); }, width: state.Zone.Size.Width.toString(), height: state.Zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-stretch", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "50%" }, "comfort"));
    };
});
define("ComfortZone/Connector", ["require", "exports", "react-redux", "Comfort/Actions", "ComfortZone/Component", "Models/Point"], function (require, exports, react_redux_3, Actions_2, Component_2, Point_2) {
    "use strict";
    /*import {SVG} from "../Shared/SVG";*/
    var mapStateToProps = function (state, ownProps) {
        if (ownProps.Name === "Comfort") {
            return { Zone: state.Zones.Comfort, User: state.CurrentUser, CenterPoint: state.CenterPoint };
        }
        else if (ownProps.Name === "Chaos") {
            return { Zone: state.Zones.Chaos, User: state.CurrentUser, CenterPoint: state.CenterPoint };
        }
        else {
            return { Zone: state.Zones.Stretch, User: state.CurrentUser, CenterPoint: state.CenterPoint };
        }
    };
    var getCenterPointFromElement = function (el) {
        var boundingBox = el.getBBox();
        var centerX = (boundingBox.width - boundingBox.x) / 2;
        var centerY = (boundingBox.height - boundingBox.y) / 2;
        return new Point_2.Point(centerX, centerY);
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            Events: {
                onZoneMouseDown: function (zone) {
                    dispatch(Actions_2.setZoneFocus(zone, "active"));
                },
                onZoneMouseUp: function (user, zone, centerPoint, event) {
                    dispatch(Actions_2.setZoneFocus(zone, "not-in-focus"));
                    var coord = [event.clientX, event.clientY];
                    // const centerPoint = getCenterPointFromElement(event.currentTarget);
                    var distance = Point_2.Point.distance(centerPoint, Point_2.Point.fromCoords(coord));
                    dispatch(Actions_2.chooseZone(user, zone, distance, centerPoint.x, centerPoint.y)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
                },
                onZoneOverFocus: function (zone) {
                    dispatch(Actions_2.setZoneFocus(zone, "in-focus"));
                },
                onZoneOffFocus: function (zone) {
                    dispatch(Actions_2.setZoneFocus(zone, "not-in-focus"));
                }
            }
        };
    };
    exports.ReduxChaosConnector = react_redux_3.connect(mapStateToProps, mapDispatchToProps)(Component_2.ReduxChaosArea);
    exports.ReduxStretchConnector = react_redux_3.connect(mapStateToProps, mapDispatchToProps)(Component_2.ReduxStretchArea);
    exports.ReduxComfortConnector = react_redux_3.connect(mapStateToProps, mapDispatchToProps)(Component_2.ReduxComfortArea);
});
define("ComfortUserChoice/Component", ["require", "exports", "react", "Models/Point", "Models/Polar"], function (require, exports, React, Point_3, Polar_2) {
    "use strict";
    exports.ReduxUserHistoryArea = function (state) {
        if (state && state.Choices.length) {
            var totalPoints = state.Choices.length;
            var radian = 6.2831853072; // 360 * Math.PI / 180;
            var polarDivision_1 = radian / totalPoints;
            /*
            .attr("cx", (data: ComfortUserChoice, index) => {
                const angle = polarDivision * index;
                return Point.toCartesian(new Polar(data.distance, angle), new Point(400, 400)).x;
            })
            .attr("cy", (data: ComfortUserChoice, index) => {
                const angle = polarDivision * index;
                return Point.toCartesian(new Polar(data.distance, angle), new Point(400, 400)).y;
            });
            */
            return React.createElement("g", { id: "history" }, state.Choices.map(function (userChoice, i) {
                return React.createElement(exports.ReduxUserHistory, __assign({ CenterPoint: state.CenterPoint, key: userChoice.User }, userChoice, { index: i, polarDivision: polarDivision_1 }));
            }));
        }
        else {
            return React.createElement("p", null, "nothing");
        }
    };
    exports.ReduxUserHistory = function (state) {
        //state.Distance
        //state.User
        //state.Zone
        var angle = state.polarDivision * state.index;
        var point = Point_3.Point.toCartesian(new Polar_2.Polar(state.Distance, angle), state.CenterPoint);
        return React.createElement("circle", { cx: point.x, cy: point.y, r: "10", className: "point" });
    };
});
define("ComfortUserChoice/Connector", ["require", "exports", "react-redux", "ComfortUserChoice/Component"], function (require, exports, react_redux_4, Component_3) {
    "use strict";
    var mapStateToProps = function (state, ownProps) {
        return {
            Choices: state.UserChoices,
            CenterPoint: state.CenterPoint
        };
    };
    var mapDispatchToProps = function (dispatch) {
        return {};
    };
    exports.ReduxUserHistoryConnector = react_redux_4.connect(mapStateToProps, mapDispatchToProps)(Component_3.ReduxUserHistoryArea);
});
// UserListConnector
define("Comfort/ComponentApp", ["require", "exports", "react", "ComfortZone/Connector", "User/Connector", "ComfortUserChoice/Connector", "ComfortZone/Component"], function (require, exports, React, Connector_1, Connector_2, Connector_3, Component_4) {
    "use strict";
    exports.ComfortApp = function () { return (React.createElement(Component_4.StageConnector, null,
        React.createElement(Connector_1.ReduxChaosConnector, { Name: "Chaos" }),
        React.createElement(Connector_1.ReduxStretchConnector, { Name: "Stretch" }),
        React.createElement(Connector_1.ReduxComfortConnector, { Name: "Comfort" }),
        React.createElement(Connector_2.ReduxUserConnector, null),
        React.createElement(Connector_3.ReduxUserHistoryConnector, null))); };
});
define("Comfort/Reducer", ["require", "exports", "Comfort/Actions", "immutable", "Models/Point", "Models/Size", "Models/IDomMeasurement"], function (require, exports, Actions_3, immutable_2, Point_4, Size_1, IDomMeasurement_1) {
    "use strict";
    var initialSize = new Size_1.Size(800, 800);
    var initialState = {
        Size: initialSize,
        CenterPoint: new Point_4.Point(initialSize.width / 2, initialSize.height / 2),
        UserList: {
            ShowUsers: true,
            Users: [
                { Username: "Adam Hall", Focus: "not-in-focus", Y: 0 },
                { Username: "Caroline Hall", Focus: "not-in-focus", Y: 0 }
            ]
        },
        Zones: {
            Comfort: { Name: "Comfort", Focus: "not-in-focus", Range: { Start: 0, End: 100 }, Size: { Width: new IDomMeasurement_1.DOMMeasurement("50%"), Height: new IDomMeasurement_1.DOMMeasurement("50%") } },
            Stretch: { Name: "Stretch", Focus: "not-in-focus", Range: { Start: 100, End: 200 }, Size: { Width: new IDomMeasurement_1.DOMMeasurement("50%"), Height: new IDomMeasurement_1.DOMMeasurement("50%") } },
            Chaos: { Name: "Chaos", Focus: "not-in-focus", Range: { Start: 200, End: 300 }, Size: { Width: new IDomMeasurement_1.DOMMeasurement("100%"), Height: new IDomMeasurement_1.DOMMeasurement("100%") } }
        },
        ShowUserChoices: false,
        UserChoices: []
    };
    function comfortReactApp(state, action) {
        if (state === void 0) { state = initialState; }
        console.log(action.type, action);
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
                return ComfortZoneAction.chooseZone(state, action.user, action.area, action.distance, action.x, action.y);
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
            var newCenter = new Point_4.Point(width / 2, height / 2);
            return immutable_2.fromJS(state)
                .set("Size", new Size_1.Size(width, height))
                .set("CenterPoint", newCenter)
                .toJS();
        };
        ComfortZoneAction.setZoneFocus = function (state, area, focus) {
            return immutable_2.fromJS(state)
                .setIn(["Zones", "Comfort", "Focus"], area === "Comfort" ? focus : "not-in-focus")
                .setIn(["Zones", "Stretch", "Focus"], area === "Stretch" ? focus : "not-in-focus")
                .setIn(["Zones", "Chaos", "Focus"], area === "Chaos" ? focus : "not-in-focus").toJS();
        };
        ComfortZoneAction.setUserFocus = function (state, user, focus) {
            var originalList = immutable_2.List(state.UserList.Users);
            var newUserList = originalList.update(originalList.findIndex(function (item) { return item.Username === user; }), function (item) { return immutable_2.fromJS(item).set("Focus", focus); }).toJS();
            return immutable_2.fromJS(state)
                .setIn(["UserList", "Users"], newUserList).toJS();
        };
        ComfortZoneAction.selectUser = function (state, user) {
            // Sets currentUser, and therefor hides the user choice menu
            var data = immutable_2.fromJS(state)
                .set("CurrentUser", user)
                .set("ShowUserChoices", false)
                .setIn(["UserList", "ShowUsers"], false);
            return data.toJS();
        };
        ComfortZoneAction.chooseZone = function (state, user, area, distance, x, y) {
            // Add the user choice
            var newUserChoices = immutable_2.List(state.UserChoices).push({
                User: user,
                Zone: area,
                Distance: distance
            }).toJS();
            // Remove the user from the choice list
            var newUserList = immutable_2.List(state.UserList.Users).filter(function (item) { return item.Username !== user; }).toArray();
            // Show the user list
            var showUserChoice = !!(newUserList.length);
            // Return
            return immutable_2.fromJS(state)
                .delete("CurrentUser")
                .set("CenterPoint", new Point_4.Point(x, y))
                .set("ShowUserChoices", showUserChoice)
                .set("UserChoices", newUserChoices)
                .setIn(["UserList", "Users"], newUserList)
                .setIn(["UserList", "ShowUsers"], showUserChoice).toJS();
        };
        ComfortZoneAction.toggleChoiceVisibility = function (state, visible) {
            // Set "showUserChoices" to true
            return immutable_2.Map(state)
                .set("ShowUserChoices", visible).toJS();
        };
        ;
        return ComfortZoneAction;
    }());
});
define("__tests__/ReduxComfort", ["require", "exports", "react", "../../3rdParty/redux.min", "Comfort/ComponentApp", "Comfort/Reducer", "../../3rdParty/react-redux.min", "Comfort/Actions"], function (require, exports, React, Redux, ComponentApp_1, Reducer_1, react_redux_min_1, Actions_4) {
    "use strict";
    var renderizer = require("react-test-renderer");
    it("Should show the component", function () {
        // Arrange
        var myStore = Redux.createStore(Reducer_1.comfortReactApp);
        var component = renderizer.create(React.createElement(react_redux_min_1.Provider, { store: myStore },
            React.createElement(ComponentApp_1.ComfortApp, null)));
        expect(component.toJSON()).toMatchSnapshot();
        myStore.dispatch(Actions_4.setUserFocus("Adam Hall", "in-focus"));
        expect(component.toJSON()).toMatchSnapshot();
    });
});
define("Tuckman/Component", ["require", "exports", "react", "SVGHelper"], function (require, exports, React, SVGHelper_1) {
    "use strict";
    //import {IResizableMouseEvents} from "../Comfort/React";
    var ChartArea = (function (_super) {
        __extends(ChartArea, _super);
        function ChartArea(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                focus: "not-in-focus",
                width: props.width || "100%",
                height: props.height || "100%",
                onMouseEnter: SVGHelper_1.Events.mouseEnter.bind(_this),
                onMouseLeave: SVGHelper_1.Events.mouseLeave.bind(_this),
                onMouseUp: SVGHelper_1.Events.mouseUp.bind(_this),
                onMouseDown: SVGHelper_1.Events.mouseDown.bind(_this)
            };
            return _this;
        }
        ChartArea.prototype.render = function () {
            var index = parseInt(this.props.index || 0, 10);
            var label = this.props.label || 0;
            var textID = label + "-label";
            var width = parseInt(this.props.width, 10);
            var offset = (25 * index) + "%";
            var textOffset = 12 + (25 * index) + "%";
            var delay = (0.2 * index) + "s";
            var className = this.state.focus + " area okay js-area-standard";
            return React.createElement("g", null,
                React.createElement("rect", { className: className, id: label, onMouseUp: this.props.onMouseUp, onMouseDown: this.props.onMouseDown, onMouseEnter: this.props.onMouseEnter, onMouseLeave: this.props.onMouseLeave, x: "0", y: "0", width: "25%", height: "100%" },
                    React.createElement(SVGHelper_1.BouncyAnimation, { attributeName: "x", value: offset, delay: delay })),
                React.createElement("text", { className: "area-label", id: textID, textAnchor: "middle", "text-anchor": "middle", x: textOffset, y: "50%" }, label),
                ";");
        };
        return ChartArea;
    }(React.Component));
    exports.ChartArea = ChartArea;
    var TuckmanComponent = (function (_super) {
        __extends(TuckmanComponent, _super);
        function TuckmanComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TuckmanComponent.prototype.render = function () {
            return React.createElement(SVGHelper_1.Stage, null,
                React.createElement("g", { id: "zones" },
                    React.createElement(ChartArea, { label: "performing", index: "3" }),
                    React.createElement(ChartArea, { label: "norming", index: "2" }),
                    React.createElement(ChartArea, { label: "storming", index: "1" }),
                    React.createElement(ChartArea, { label: "forming", index: "0" })));
            //         <rect id="clickable" width="100%" height="100%" fill-opacity="0.0"></rect>
        };
        return TuckmanComponent;
    }(React.Component));
    exports.TuckmanComponent = TuckmanComponent;
});
/*
<svg id="stage" width="800" height="800">
            <g id="assets" fill-opacity="0.0">
                <path id="asset-tick" stroke-miterlimit="4" stroke-width="0" stroke="#007f00" fill="#007f00" d="m216.77742,285.47641l89.687332,115.132935c45.697845,-103.041046 101.639099,-197.834396 191.554749,-287.832077c-67.294983,42.004333 -141.475403,121.768204 -204.841431,220.466995l-76.40065,-47.767853z"></path>
            </g>



            <g id="zones">
                <rect class="area js-area-standard" id="storming" x="200" y="0" width="200" height="800"></rect>
                <rect class="area js-area-standard" id="norming" x="400" y="0" width="200" height="800"></rect>
                <rect class="area js-area-standard" id="performing" x="600" y="0" width="200" height="800"></rect>
            </g>
            <g id="history">
            </g>
            <text class="area-label" id="label-storming" text-anchor="middle" x="300" y="400">storming</text>
            <text class="area-label" id="label-norming" text-anchor="middle" x="500" y="400">norming</text>
            <text class="area-label" id="label-performing" text-anchor="middle" x="700" y="400">performing</text>

            <rect id="clickable" width="800" height="800" fill-opacity="0.0"></rect>
            <g id="users" transform="">

            <g id="user0" class="user-group"><rect y="60" x="0" width="800" height="90" data-name="asdsa" data-id="user0"></rect><text class="username" y="120" x="60" data-name="asdsa" style="font-size: 60px; font-family: &quot;Share Tech Mono&quot;; fill: rgb(128, 128, 128);">asdsa</text></g><g id="user1" class="user-group"><rect y="150" x="0" width="800" height="90" data-name="asd" data-id="user1"></rect><text class="username" y="210" x="60" data-name="asd" style="font-size: 60px; font-family: &quot;Share Tech Mono&quot;; fill: rgb(128, 128, 128);">asd</text></g><g id="user2" class="user-group"><rect y="240" x="0" width="800" height="90" data-name="sadasd" data-id="user2"></rect><text class="username" y="300" x="60" data-name="sadasd" style="font-size: 60px; font-family: &quot;Share Tech Mono&quot;; fill: rgb(128, 128, 128);">sadasd</text></g></g>
        </svg>
        */
define("__tests__/TuckmanModel", ["require", "exports", "react", "Tuckman/Component", "SVGHelper"], function (require, exports, React, Component_5, SVGHelper_2) {
    "use strict";
    var renderizer = require("react-test-renderer");
    it("Should show the component", function () {
        // Arrange
        var component = renderizer.create(React.createElement(SVGHelper_2.Stage, null,
            React.createElement(Component_5.TuckmanComponent, null)));
        expect(component.toJSON()).toMatchSnapshot();
    });
    it("Should show the stretch area", function () {
        // Arrange
        var component = renderizer.create(React.createElement(SVGHelper_2.Stage, null,
            React.createElement(Component_5.ChartArea, { width: "200", offset: "100", label: "example" })));
        expect(component.toJSON()).toMatchSnapshot();
    });
});
define("Comfort/Store", ["require", "exports", "react", "redux", "Comfort/ComponentApp", "Comfort/Reducer", "react-dom", "react-redux", "Comfort/Actions", "Models/Size"], function (require, exports, React, Redux, ComponentApp_2, Reducer_2, react_dom_1, react_redux_5, Actions_5, Size_2) {
    "use strict";
    exports.myStore = Redux.createStore(Reducer_2.comfortReactApp);
    console.log(exports.myStore.getState());
    var unsubscribe = exports.myStore.subscribe(function () {
        return console.log(exports.myStore.getState());
    });
    react_dom_1.render(React.createElement(react_redux_5.Provider, { store: exports.myStore },
        React.createElement(ComponentApp_2.ComfortApp, null)), document.getElementById("stage"));
    function resizeImage() {
        //calculations here...
        var size = getWidthHeight();
        if (size.width > size.height) {
            exports.myStore.dispatch(Actions_5.setStageSize(size.height, size.height));
        }
        else {
            exports.myStore.dispatch(Actions_5.setStageSize(size.width, size.width));
        }
    }
    function getWidthHeight() {
        var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
        return new Size_2.Size(x, y);
    }
    ;
    window.addEventListener("resize", resizeImage, false);
});
// Stop listening to state updates
// unsubscribe(); ; 
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
    u.gogogo();
});
define("User/Model", ["require", "exports"], function (require, exports) {
    "use strict";
});

//# sourceMappingURL=compiled.js.map
