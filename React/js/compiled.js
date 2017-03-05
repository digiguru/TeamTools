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
define("SVGHelper", ["require", "exports", "react", "Point"], function (require, exports, React, Point_1) {
    "use strict";
    /*require(["../Coords/Polar"], (u) => {
        console.log(new u.Polar(1,20));
    });*/
    // const r = new Polar(1,20);
    var SVGEvents = (function () {
        function SVGEvents() {
        }
        SVGEvents.getDistance = function (x, y, target) {
            return Point_1.Point.distance(new Point_1.Point(x, y), SVGEvents.getCenter(target));
        };
        SVGEvents.getCenter = function (target) {
            var rect = target.getBoundingClientRect();
            return new Point_1.Point(rect.left + (rect.width / 2), rect.top + (rect.height / 2));
            /*
            return {
                x:rect.left + (rect.width / 2),
                y:rect.top + (rect.height / 2)
            }
            */
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
define("ComfortActions", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.ComfortActions = {
        SET_ZONEFOCUS: "SET_ZONEFOCUS",
        SET_USERFOCUS: "SET_USERFOCUS",
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
/*
<g id="users" transform="">
    <g id="user1" class="user-group">
        <rect y="150" x="0" width="800" height="90" data-name="asd" data-id="user1"></rect>
        <text class="username" y="210" x="60" data-name="asd" style="font-size: 60px; font-family: &quot;Share Tech Mono&quot;; fill: rgb(128, 128, 128);">asd</text>
    </g>
    <g id="user2" class="user-group">
        <rect y="240" x="0" width="800" height="90" data-name="sadasd" data-id="user2"></rect>
        <text class="username" y="300" x="60" data-name="sadasd" style="font-size: 60px; font-family: &quot;Share Tech Mono&quot;; fill: rgb(128, 128, 128);">sadasd</text>
    </g>
</g>
*/
define("ReactUserComponent", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    exports.ReduxUserList = function (state) {
        return React.createElement("g", { id: "users" }, state.Users.map(function (user, i) {
            return React.createElement(exports.ReduxUser, __assign({}, user, { events: state.events }));
        }));
    };
    exports.ReduxUser = function (state) {
        // 60 , 150, 240
        return React.createElement("g", { className: "user-group" },
            React.createElement("rect", { className: state.Focus, onMouseEnter: function () { return state.events.onUserOverFocus(state.username); }, onMouseLeave: function () { return state.events.onUserOffFocus(state.username); }, onMouseDown: function () { return state.events.onUserMouseDown(state.username); }, onMouseUp: function (event) { return state.events.onUserMouseUp(state.username, event); }, y: state.y, x: "0", width: "800", height: "90" }),
            React.createElement("text", { className: "username", y: state.y, x: "60" }, state.username));
    };
});
define("UserListConnector", ["require", "exports", "react-redux", "ComfortActions", "ReactUserComponent", "immutable"], function (require, exports, react_redux_1, ComfortActions_1, ReactUserComponent_1, immutable_1) {
    "use strict";
    var mapStateToProps = function (state, ownProps) {
        return {
            Users: state.UserList.Users.map(function (u, i) {
                return immutable_1.fromJS(u).set("Y", (i * 90) + 60).toJS();
            })
        };
    };
    var mapDispatchToProps = function (dispatch) {
        return {
            events: {
                onUserMouseDown: function (user) {
                    dispatch(ComfortActions_1.setUserFocus(user, "active"));
                },
                onUserMouseUp: function (user, event) {
                    dispatch(ComfortActions_1.setUserFocus(user, "not-in-focus"));
                    /*const coord = [event.clientX, event.clientY];
                    const centerPoint = getCenterPointFromElement(event.currentTarget);
                    const distance = Point.distance(centerPoint, Point.fromCoords(coord));*/
                    dispatch(ComfortActions_1.selectUser(user)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
                },
                onUserOverFocus: function (user) {
                    dispatch(ComfortActions_1.setUserFocus(user, "in-focus"));
                },
                onUserOffFocus: function (user) {
                    dispatch(ComfortActions_1.setUserFocus(user, "not-in-focus"));
                }
            }
        };
    };
    exports.ReduxUserConnector = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ReactUserComponent_1.ReduxUserList);
});
// UserListConnector 
define("ComfortReactModelState", ["require", "exports"], function (require, exports) {
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
    var ChaosZoneList = (function () {
        function ChaosZoneList() {
        }
        return ChaosZoneList;
    }());
    exports.ChaosZoneList = ChaosZoneList;
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
    var ChaosPickerState = (function () {
        function ChaosPickerState() {
        }
        return ChaosPickerState;
    }());
    exports.ChaosPickerState = ChaosPickerState;
});
define("ComfortReact", ["require", "exports", "react", "SVGHelper"], function (require, exports, React, SVGHelper_1) {
    "use strict";
    var ChaosArea = (function (_super) {
        __extends(ChaosArea, _super);
        function ChaosArea(props) {
            var _this = _super.call(this, props) || this;
            _this.props.onMouseEnter = SVGHelper_1.Events.mouseEnter.bind(_this);
            _this.props.onMouseLeave = SVGHelper_1.Events.mouseLeave.bind(_this);
            _this.props.onMouseUp = SVGHelper_1.Events.mouseUp.bind(_this);
            _this.props.onMouseDown = SVGHelper_1.Events.mouseDown.bind(_this);
            _this.state = {
                focus: "not-in-focus",
                width: props.width || "100%",
                height: props.height || "100%",
            };
            return _this;
        }
        ChaosArea.prototype.render = function () {
            var className = this.state.focus + " area js-area-standard";
            return React.createElement("g", null,
                React.createElement("rect", { id: "chaos", className: className, onMouseUp: this.props.onMouseUp, onMouseDown: this.props.onMouseDown, onMouseEnter: this.props.onMouseEnter, onMouseLeave: this.props.onMouseLeave, width: this.state.width, height: this.state.height }),
                React.createElement("text", { className: "area-label", id: "label-chaos", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20" }, "chaos"));
        };
        return ChaosArea;
    }(React.Component));
    exports.ChaosArea = ChaosArea;
    var StretchArea = (function (_super) {
        __extends(StretchArea, _super);
        function StretchArea(props) {
            var _this = _super.call(this, props) || this;
            _this.props.onMouseEnter = SVGHelper_1.Events.mouseEnter.bind(_this);
            _this.props.onMouseLeave = SVGHelper_1.Events.mouseLeave.bind(_this);
            _this.props.onMouseUp = SVGHelper_1.Events.mouseUp.bind(_this);
            _this.props.onMouseDown = SVGHelper_1.Events.mouseDown.bind(_this);
            _this.state = {
                focus: "not-in-focus",
                width: props.width || "100%",
                height: props.height || "100%"
            };
            return _this;
        }
        StretchArea.prototype.render = function () {
            var className = this.state.focus + " area js-area-standard";
            return React.createElement("g", null,
                React.createElement("circle", { onMouseUp: this.props.onMouseUp, onMouseDown: this.props.onMouseDown, onMouseEnter: this.props.onMouseEnter, onMouseLeave: this.props.onMouseLeave, className: className, id: "stretch", r: "0%", cx: "50%", cy: "50%" }, this.props.children),
                React.createElement("text", { className: "area-label", id: "label-stretch", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20%" }, "stretch"));
        };
        return StretchArea;
    }(React.Component));
    exports.StretchArea = StretchArea;
    var ComfortArea = (function (_super) {
        __extends(ComfortArea, _super);
        function ComfortArea(props) {
            var _this = _super.call(this, props) || this;
            _this.props.onMouseEnter = SVGHelper_1.Events.mouseEnter.bind(_this);
            _this.props.onMouseLeave = SVGHelper_1.Events.mouseLeave.bind(_this);
            _this.props.onMouseUp = SVGHelper_1.Events.mouseUp.bind(_this);
            _this.props.onMouseDown = SVGHelper_1.Events.mouseDown.bind(_this);
            _this.state = {
                focus: "not-in-focus",
                width: props.width || "100%",
                height: props.height || "100%"
            };
            return _this;
        }
        ComfortArea.prototype.render = function () {
            var className = this.state.focus + " area js-area-standard";
            // const startValue = 0 || this.props.value;
            var value = this.props.value || 20;
            return React.createElement("g", null,
                React.createElement("circle", { onMouseUp: this.props.onMouseUp, onMouseDown: this.props.onMouseDown, onMouseEnter: this.props.onMouseEnter, onMouseLeave: this.props.onMouseLeave, className: className, id: "comfort", r: "0%", cx: "50%", cy: "50%" }, this.props.children),
                React.createElement("text", { className: "area-label", id: "label-comfort", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "50%" }, "comfort"));
            // keySplines=".42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;" 
        };
        return ComfortArea;
    }(React.Component));
    exports.ComfortArea = ComfortArea;
    var ComfortReact = (function (_super) {
        __extends(ComfortReact, _super);
        function ComfortReact() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ComfortReact.prototype.render = function () {
            return React.createElement(SVGHelper_1.Stage, null,
                React.createElement(ChaosArea, null),
                React.createElement("g", { id: "zones" },
                    React.createElement(StretchArea, null,
                        React.createElement(SVGHelper_1.BouncyAnimation, { attributeName: "r", value: "45" })),
                    React.createElement(ComfortArea, null,
                        React.createElement(SVGHelper_1.BouncyAnimation, { attributeName: "r", value: "20", delay: "0.5s" }))),
                React.createElement("g", { id: "history", display: this.props.ShowUserChoices }));
            //         <rect id="clickable" width="100%" height="100%" fill-opacity="0.0"></rect>
        };
        return ComfortReact;
    }(React.Component));
    exports.ComfortReact = ComfortReact;
});
define("__tests__/ComfortModel", ["require", "exports", "react", "ComfortReact", "SVGHelper"], function (require, exports, React, ComfortReact_1, SVGHelper_2) {
    "use strict";
    var renderizer = require("react-test-renderer");
    it("Should show the chaos area", function () {
        // Arrange
        var component = renderizer.create(React.createElement(SVGHelper_2.Stage, null,
            React.createElement(ComfortReact_1.ChaosArea, null)));
        var tree = component.toJSON();
        var mouseOverArea = tree.children[0].children[0];
        expect(tree).toMatchSnapshot();
        // Act snapshot 2
        mouseOverArea.props.onMouseEnter();
        // Assert Snapshot 2
        expect(component.toJSON()).toMatchSnapshot();
        // Act snapshot 3
        mouseOverArea.props.onMouseLeave();
        // Assert Snapshot 3
        expect(component.toJSON()).toMatchSnapshot();
    });
    it("Should show the stretch area", function () {
        var component = renderizer.create(React.createElement(SVGHelper_2.Stage, null,
            React.createElement(ComfortReact_1.StretchArea, null)));
        var tree = component.toJSON();
        var mouseOverArea = tree.children[0].children[0];
        expect(tree).toMatchSnapshot();
        // Act snapshot 2
        mouseOverArea.props.onMouseEnter();
        // Assert Snapshot 2
        expect(component.toJSON()).toMatchSnapshot();
        // Act snapshot 3
        mouseOverArea.props.onMouseLeave();
        // Assert Snapshot 3
        expect(component.toJSON()).toMatchSnapshot();
    });
    it("Should show the comfort area - animated", function () {
        var component = renderizer.create(React.createElement(SVGHelper_2.Stage, null,
            React.createElement(ComfortReact_1.ComfortArea, null,
                React.createElement(SVGHelper_2.BouncyAnimation, { attributeName: "r" }))));
        expect(component.toJSON()).toMatchSnapshot();
    });
    it("Should show the comfort area - standard", function () {
        var component = renderizer.create(React.createElement(SVGHelper_2.Stage, null,
            React.createElement(ComfortReact_1.ComfortArea, null)));
        var tree = component.toJSON();
        var mouseOverArea = tree.children[0].children[0];
        expect(tree).toMatchSnapshot();
        // Act snapshot 2
        mouseOverArea.props.onMouseEnter();
        // Assert Snapshot 2
        expect(component.toJSON()).toMatchSnapshot();
        // Act snapshot 3
        mouseOverArea.props.onMouseLeave();
        // Assert Snapshot 3
        expect(component.toJSON()).toMatchSnapshot();
    });
    it("The complete comfort model", function () {
        var component = renderizer.create(React.createElement(SVGHelper_2.Stage, { width: "800", height: "800" },
            React.createElement(ComfortReact_1.ComfortReact, null)));
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
define("Link.react", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var STATUS = {
        NORMAL: "normal",
        HOVERED: "hovered",
    };
    var Link = (function (_super) {
        __extends(Link, _super);
        function Link(props) {
            var _this = _super.call(this, props) || this;
            _this._onMouseEnter = _this._onMouseEnter.bind(_this);
            _this._onMouseLeave = _this._onMouseLeave.bind(_this);
            _this.state = {
                class: STATUS.NORMAL,
            };
            return _this;
        }
        Link.prototype._onMouseEnter = function () {
            this.setState({ class: STATUS.HOVERED });
        };
        Link.prototype._onMouseLeave = function () {
            this.setState({ class: STATUS.NORMAL });
        };
        Link.prototype.render = function () {
            return React.createElement("a", { className: this.state.class, href: this.props.page || "#", onMouseEnter: this._onMouseEnter, onMouseLeave: this._onMouseLeave }, this.props.children);
        };
        return Link;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Link;
});
define("__tests__/Link.react-test", ["require", "exports", "react", "Link.react"], function (require, exports, React, Link_react_1) {
    "use strict";
    var renderizer = require('react-test-renderer');
    it('Link changes the class when hovered', function () {
        var component = renderizer.create(React.createElement(Link_react_1.default, { page: "http://www.facebook.com" }, "Facebook"));
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        // manually trigger the callback
        tree.props.onMouseEnter();
        // re-rendering
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        // manually trigger the callback
        tree.props.onMouseLeave();
        // re-rendering
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
define("TuckmanReact", ["require", "exports", "react", "SVGHelper"], function (require, exports, React, SVGHelper_3) {
    "use strict";
    var ChartArea = (function (_super) {
        __extends(ChartArea, _super);
        function ChartArea(props) {
            var _this = _super.call(this, props) || this;
            _this.props.onMouseEnter = SVGHelper_3.Events.mouseEnter.bind(_this);
            _this.props.onMouseLeave = SVGHelper_3.Events.mouseLeave.bind(_this);
            _this.props.onMouseUp = SVGHelper_3.Events.mouseUp.bind(_this);
            _this.props.onMouseDown = SVGHelper_3.Events.mouseDown.bind(_this);
            _this.state = {
                focus: "not-in-focus",
                width: props.width || "100%",
                height: props.height || "100%",
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
                    React.createElement(SVGHelper_3.BouncyAnimation, { attributeName: "x", value: offset, delay: delay })),
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
            return React.createElement(SVGHelper_3.Stage, null,
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
define("__tests__/TuckmanModel", ["require", "exports", "react", "TuckmanReact", "SVGHelper"], function (require, exports, React, TuckmanReact_1, SVGHelper_4) {
    "use strict";
    var renderizer = require("react-test-renderer");
    it("Should show the component", function () {
        // Arrange
        var component = renderizer.create(React.createElement(SVGHelper_4.Stage, null,
            React.createElement(TuckmanReact_1.TuckmanComponent, null)));
        expect(component.toJSON()).toMatchSnapshot();
    });
    it("Should show the stretch area", function () {
        // Arrange
        var component = renderizer.create(React.createElement(SVGHelper_4.Stage, null,
            React.createElement(TuckmanReact_1.ChartArea, { width: "200", offset: "100", label: "example" })));
        expect(component.toJSON()).toMatchSnapshot();
    });
});
define("ComfortReactAlt", ["require", "exports", "react", "SVGHelper"], function (require, exports, React, SVGHelper_5) {
    "use strict";
    var ChaosArea = (function (_super) {
        __extends(ChaosArea, _super);
        function ChaosArea(props) {
            var _this = _super.call(this, props) || this;
            _this.props.onMouseEnter = SVGHelper_5.Events.mouseEnter.bind(_this);
            _this.props.onMouseLeave = SVGHelper_5.Events.mouseLeave.bind(_this);
            _this.props.onMouseUp = SVGHelper_5.Events.mouseUp.bind(_this);
            _this.props.onMouseDown = SVGHelper_5.Events.mouseDown.bind(_this);
            _this.state = {
                focus: "not-in-focus",
                width: props.width || "100%",
                height: props.height || "100%",
            };
            return _this;
        }
        ChaosArea.prototype.render = function () {
            var className = this.state.focus + " area js-area-standard";
            return React.createElement("g", null,
                React.createElement("rect", { id: "chaos", className: className, onMouseUp: this.props.onMouseUp, onMouseDown: this.props.onMouseDown, onMouseEnter: this.props.onMouseEnter, onMouseLeave: this.props.onMouseLeave, width: this.state.width, height: this.state.height }),
                React.createElement("text", { className: "area-label", id: "label-chaos", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20" }, "chaos"));
        };
        return ChaosArea;
    }(React.Component));
    exports.ChaosArea = ChaosArea;
    var StretchArea = (function (_super) {
        __extends(StretchArea, _super);
        function StretchArea(props) {
            var _this = _super.call(this, props) || this;
            _this.props.onMouseEnter = SVGHelper_5.Events.mouseEnter.bind(_this);
            _this.props.onMouseLeave = SVGHelper_5.Events.mouseLeave.bind(_this);
            _this.props.onMouseUp = SVGHelper_5.Events.mouseUp.bind(_this);
            _this.props.onMouseDown = SVGHelper_5.Events.mouseDown.bind(_this);
            _this.state = {
                focus: "not-in-focus",
                width: props.width || "100%",
                height: props.height || "100%"
            };
            return _this;
        }
        StretchArea.prototype.render = function () {
            var className = this.state.focus + " area js-area-standard";
            return React.createElement("g", null,
                React.createElement("circle", { onMouseUp: this.props.onMouseUp, onMouseDown: this.props.onMouseDown, onMouseEnter: this.props.onMouseEnter, onMouseLeave: this.props.onMouseLeave, className: className, id: "stretch", r: "0%", cx: "50%", cy: "50%" }, this.props.children),
                React.createElement("text", { className: "area-label", id: "label-stretch", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20%" }, "stretch"));
        };
        return StretchArea;
    }(React.Component));
    exports.StretchArea = StretchArea;
    var ComfortArea = (function (_super) {
        __extends(ComfortArea, _super);
        function ComfortArea(props) {
            var _this = _super.call(this, props) || this;
            _this.props.onMouseEnter = SVGHelper_5.Events.mouseEnter.bind(_this);
            _this.props.onMouseLeave = SVGHelper_5.Events.mouseLeave.bind(_this);
            _this.props.onMouseUp = SVGHelper_5.Events.mouseUp.bind(_this);
            _this.props.onMouseDown = SVGHelper_5.Events.mouseDown.bind(_this);
            _this.state = {
                focus: "not-in-focus",
                width: props.width || "100%",
                height: props.height || "100%"
            };
            return _this;
        }
        ComfortArea.prototype.render = function () {
            var className = this.state.focus + " area js-area-standard";
            // const startValue = 0 || this.props.value;
            var value = this.props.value || 20;
            return React.createElement("g", null,
                React.createElement("circle", { onMouseUp: this.props.onMouseUp, onMouseDown: this.props.onMouseDown, onMouseEnter: this.props.onMouseEnter, onMouseLeave: this.props.onMouseLeave, className: className, id: "comfort", r: "0%", cx: "50%", cy: "50%" }, this.props.children),
                React.createElement("text", { className: "area-label", id: "label-comfort", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "50%" }, "comfort"));
            // keySplines=".42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;" 
        };
        return ComfortArea;
    }(React.Component));
    exports.ComfortArea = ComfortArea;
    var ComfortReact = (function (_super) {
        __extends(ComfortReact, _super);
        function ComfortReact() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ComfortReact.prototype.render = function () {
            return React.createElement(SVGHelper_5.Stage, null,
                React.createElement(ChaosArea, null),
                React.createElement("g", { id: "zones" },
                    React.createElement(StretchArea, null,
                        React.createElement(SVGHelper_5.BouncyAnimation, { attributeName: "r", value: "45" })),
                    React.createElement(ComfortArea, null,
                        React.createElement(SVGHelper_5.BouncyAnimation, { attributeName: "r", value: "20", delay: "0.5s" }))),
                React.createElement("g", { id: "history", display: this.props.ShowUserChoices }));
            //         <rect id="clickable" width="100%" height="100%" fill-opacity="0.0"></rect>
        };
        return ComfortReact;
    }(React.Component));
    exports.ComfortReact = ComfortReact;
});
define("ComfortReduxZone", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    exports.ReduxChaosArea = function (state) {
        return React.createElement("g", null,
            React.createElement("rect", { id: "chaos", className: state.zone.Focus, onMouseEnter: function () { return state.events.onZoneOverFocus(state.zone.Name); }, onMouseLeave: function () { return state.events.onZoneOffFocus(state.zone.Name); }, onMouseDown: function () { return state.events.onZoneMouseDown(state.zone.Name); }, onMouseUp: function (event) { return state.events.onZoneMouseUp(state.user, state.zone.Name, event); }, width: state.zone.Size.Width.toString(), height: state.zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-chaos", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20" }, "chaos"),
            ";");
    };
    exports.ReduxStretchArea = function (state) {
        return React.createElement("g", null,
            React.createElement("circle", { className: state.zone.Focus, id: "stretch", r: "33%", cx: "50%", cy: "50%", onMouseEnter: function () { return state.events.onZoneOverFocus(state.zone.Name); }, onMouseLeave: function () { return state.events.onZoneOffFocus(state.zone.Name); }, onMouseDown: function () { return state.events.onZoneMouseDown(state.zone.Name); }, onMouseUp: function (event) { return state.events.onZoneMouseUp(state.user, state.zone.Name, event); }, width: state.zone.Size.Width.toString(), height: state.zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-stretch", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20%" }, "stretch"));
    };
    exports.ReduxComfortArea = function (state) {
        return React.createElement("g", null,
            React.createElement("circle", { className: state.zone.Focus, id: "stretch", r: "15%", cx: "50%", cy: "50%", onMouseEnter: function () { return state.events.onZoneOverFocus(state.zone.Name); }, onMouseLeave: function () { return state.events.onZoneOffFocus(state.zone.Name); }, onMouseDown: function () { return state.events.onZoneMouseDown(state.zone.Name); }, onMouseUp: function (event) { return state.events.onZoneMouseUp(state.user, state.zone.Name, event); }, width: state.zone.Size.Width.toString(), height: state.zone.Size.Height.toString() }),
            React.createElement("text", { className: "area-label", id: "label-stretch", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "50%" }, "comfort"));
    };
});
define("ComfortReactZoneConnector", ["require", "exports", "react-redux", "ComfortActions", "ComfortReduxZone", "Point"], function (require, exports, react_redux_2, ComfortActions_2, ComfortReduxZone_1, Point_2) {
    "use strict";
    /*import {SVG} from "../Shared/SVG";*/
    var mapStateToProps = function (state, ownProps) {
        if (ownProps.Name === "Comfort") {
            return { zone: state.Zones.Comfort, user: "Adam Hall" };
        }
        else if (ownProps.Name === "Chaos") {
            return { zone: state.Zones.Chaos, user: "Adam Hall" };
        }
        else {
            return { zone: state.Zones.Stretch, user: "Adam Hall" };
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
            events: {
                onZoneMouseDown: function (zone) {
                    dispatch(ComfortActions_2.setZoneFocus(zone, "active"));
                },
                onZoneMouseUp: function (user, zone, event) {
                    dispatch(ComfortActions_2.setZoneFocus(zone, "not-in-focus"));
                    var coord = [event.clientX, event.clientY];
                    var centerPoint = getCenterPointFromElement(event.currentTarget);
                    var distance = Point_2.Point.distance(centerPoint, Point_2.Point.fromCoords(coord));
                    dispatch(ComfortActions_2.chooseZone(user, zone, distance)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
                },
                onZoneOverFocus: function (zone) {
                    dispatch(ComfortActions_2.setZoneFocus(zone, "in-focus"));
                },
                onZoneOffFocus: function (zone) {
                    dispatch(ComfortActions_2.setZoneFocus(zone, "not-in-focus"));
                }
            }
        };
    };
    exports.ReduxChaosConnector = react_redux_2.connect(mapStateToProps, mapDispatchToProps)(ComfortReduxZone_1.ReduxChaosArea);
    exports.ReduxStretchConnector = react_redux_2.connect(mapStateToProps, mapDispatchToProps)(ComfortReduxZone_1.ReduxStretchArea);
    exports.ReduxComfortConnector = react_redux_2.connect(mapStateToProps, mapDispatchToProps)(ComfortReduxZone_1.ReduxComfortArea);
});
define("ComfortReactApp", ["require", "exports", "react", "SVGHelper", "ComfortReactZoneConnector", "UserListConnector"], function (require, exports, React, SVGHelper_6, ComfortReactZoneConnector_1, UserListConnector_1) {
    "use strict";
    /*
            <g id="users">
            </g>
    
            <ReduxUserConnector />
    */
    exports.ReduxComfortApp = function () { return (React.createElement(SVGHelper_6.Stage, null,
        React.createElement(ComfortReactZoneConnector_1.ReduxChaosConnector, { Name: "Chaos" }),
        React.createElement(ComfortReactZoneConnector_1.ReduxStretchConnector, { Name: "Stretch" }),
        React.createElement(ComfortReactZoneConnector_1.ReduxComfortConnector, { Name: "Comfort" }),
        React.createElement(UserListConnector_1.ReduxUserConnector, null))); };
});
/*
export class ChaosArea extends React.Component<any, IResizableInteractiveModelState> {
     constructor(props: IResizableMouseEvents) {
        super(props);
        this.props.onMouseEnter = Events.mouseEnter.bind(this);
        this.props.onMouseLeave = Events.mouseLeave.bind(this);
        this.props.onMouseUp = Events.mouseUp.bind(this);
        this.props.onMouseDown = Events.mouseDown.bind(this);
        this.state = {
            focus: "not-in-focus",
            width: props.width || "100%",
            height: props.height || "100%",
        };
    }
    render() {
        const className: string = this.state.focus + " area js-area-standard";
        return <g>
            <rect id="chaos" className={className}
                onMouseUp={this.props.onMouseUp}
                onMouseDown={this.props.onMouseDown}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                width={this.state.width} height={this.state.height}></rect>
            <text className="area-label" id="label-chaos" text-anchor="middle" textAnchor="middle" x="50%" y="20">chaos</text>
        </g>;
    }
}

export class StretchArea extends React.Component<any, IResizableInteractiveModelState> {
    constructor(props: IResizableMouseEvents) {
        super(props);

        this.props.onMouseEnter = Events.mouseEnter.bind(this);
        this.props.onMouseLeave = Events.mouseLeave.bind(this);
        this.props.onMouseUp = Events.mouseUp.bind(this);
        this.props.onMouseDown = Events.mouseDown.bind(this);

        this.state = {
            focus: "not-in-focus",
            width: props.width || "100%",
            height: props.height || "100%"
        };
    }

    render() {
        const className: string = this.state.focus + " area js-area-standard";
        return <g>
            <circle
                onMouseUp={this.props.onMouseUp}
                onMouseDown={this.props.onMouseDown}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                className={className} id="stretch" r="0%" cx="50%" cy="50%">
                {this.props.children}
            </circle>
            <text className="area-label" id="label-stretch" text-anchor="middle" textAnchor="middle" x="50%" y="20%">stretch</text>
        </g>;
    }
}

export class ComfortArea extends React.Component<any, IResizableInteractiveModelState> {
     constructor(props: IResizableMouseEvents) {
        super(props);

        this.props.onMouseEnter = Events.mouseEnter.bind(this);
        this.props.onMouseLeave = Events.mouseLeave.bind(this);
        this.props.onMouseUp = Events.mouseUp.bind(this);
        this.props.onMouseDown = Events.mouseDown.bind(this);
        this.state = {
            focus: "not-in-focus",
            width: props.width || "100%",
            height: props.height || "100%"
        };
    }

    render() {
        const className: string = this.state.focus + " area js-area-standard";
        // const startValue = 0 || this.props.value;
        const value = this.props.value || 20;
        return <g>
            <circle
                onMouseUp={this.props.onMouseUp}
                onMouseDown={this.props.onMouseDown}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                className={className} id="comfort" r="0%" cx="50%" cy="50%">
                {this.props.children}
            </circle>
            <text className="area-label" id="label-comfort" text-anchor="middle" textAnchor="middle" x="50%" y="50%">comfort</text>
        </g>;
        // keySplines=".42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;"
    }
}*/
define("ComfortReactReducer", ["require", "exports", "ComfortActions", "ComfortReactModelState", "immutable"], function (require, exports, ComfortActions_3, ComfortReactModelState_1, immutable_2) {
    "use strict";
    var initialState = {
        UserList: {
            Users: [
                { Username: "Adam Hall", Focus: "not-in-focus", Y: 0 },
                { Username: "Caroline Hall", Focus: "not-in-focus", Y: 0 }
            ]
        },
        Zones: {
            Comfort: { Name: "Comfort", Focus: "not-in-focus", Range: { Start: 0, End: 100 }, Size: { Width: new ComfortReactModelState_1.DOMMeasurement("50%"), Height: new ComfortReactModelState_1.DOMMeasurement("50%") } },
            Stretch: { Name: "Stretch", Focus: "not-in-focus", Range: { Start: 100, End: 200 }, Size: { Width: new ComfortReactModelState_1.DOMMeasurement("50%"), Height: new ComfortReactModelState_1.DOMMeasurement("50%") } },
            Chaos: { Name: "Chaos", Focus: "not-in-focus", Range: { Start: 200, End: 300 }, Size: { Width: new ComfortReactModelState_1.DOMMeasurement("100%"), Height: new ComfortReactModelState_1.DOMMeasurement("100%") } }
        },
        ShowUserChoices: false,
        UserChoices: []
    };
    function comfortReactApp(state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case ComfortActions_3.ComfortActions.SET_USERFOCUS:
                return ComfortZoneAction.setUserFocus(state, action.user, action.focus);
            case ComfortActions_3.ComfortActions.SET_ZONEFOCUS:
                return ComfortZoneAction.setZoneFocus(state, action.area, action.focus);
            case ComfortActions_3.ComfortActions.SELECT_USER:
                return ComfortZoneAction.selectUser(state, action.user);
            case ComfortActions_3.ComfortActions.CHOOSE_ZONE:
                return ComfortZoneAction.chooseZone(state, action.user, action.area, action.distance);
            case ComfortActions_3.ComfortActions.TOGGLE_CHOICES:
                return ComfortZoneAction.toggleChoiceVisibility(state, action.visible);
            default:
                return state;
        }
    }
    exports.comfortReactApp = comfortReactApp;
    var ComfortZoneAction = (function () {
        function ComfortZoneAction() {
        }
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
                .set("UserList", { Users: newUserList }).toJS();
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
            // Add the user choice
            var newUserChoices = immutable_2.fromJS(state.UserChoices).push({
                User: user,
                Zone: area,
                Distance: distance
            });
            // Remove the user from the choice list
            var newUserList = immutable_2.List(state.UserList.Users).filter(function (item) { return item.Username !== user; });
            // Show the user list
            var showUserChoice = newUserList.count();
            // Return
            return immutable_2.Map(state)
                .delete("CurrentUser")
                .set("ShowUserChoices", showUserChoice)
                .set("UserChoices", newUserChoices)
                .set("UserList", { Users: newUserList }).toJS();
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
define("ComfortStore", ["require", "exports", "react", "redux", "ComfortReactApp", "ComfortReactReducer", "react-dom", "react-redux", "ComfortActions"], function (require, exports, React, Redux, ComfortReactApp_1, ComfortReactReducer_1, react_dom_1, react_redux_3, ComfortActions_4) {
    "use strict";
    var myStore = Redux.createStore(ComfortReactReducer_1.comfortReactApp);
    console.log(myStore.getState());
    var unsubscribe = myStore.subscribe(function () {
        return console.log(myStore.getState());
    });
    react_dom_1.render(React.createElement(react_redux_3.Provider, { store: myStore },
        React.createElement(ComfortReactApp_1.ReduxComfortApp, null)), document.getElementById("stage"));
    myStore.dispatch(ComfortActions_4.setUserFocus("Adam Hall", "in-focus"));
});
// Stop listening to state updates
// unsubscribe(); ; 
define("ComfortStoreOriginal", ["require", "exports", "redux", "ComfortActions", "ComfortReactReducer"], function (require, exports, Redux, ComfortActions_5, ComfortReactReducer_2) {
    "use strict";
    var store = Redux.createStore(ComfortReactReducer_2.comfortReactApp);
    console.log(store.getState());
    var unsubscribe = store.subscribe(function () {
        return console.log(store.getState());
    });
    // Dispatch some actions
    store.dispatch(ComfortActions_5.setUserFocus("Adam Hall", "in-focus"));
    store.dispatch(ComfortActions_5.setZoneFocus("Chaos", "in-focus"));
    store.dispatch(ComfortActions_5.setZoneFocus("Comfort", "in-focus"));
    store.dispatch(ComfortActions_5.setZoneFocus("Stretch", "in-focus"));
    store.dispatch(ComfortActions_5.selectUser("Adam Hall"));
    store.dispatch(ComfortActions_5.setZoneFocus("Stretch", "active"));
    store.dispatch(ComfortActions_5.chooseZone("Adam Hall", "Chaos", 150));
    store.dispatch(ComfortActions_5.toggleChoiceVisibility(true));
    // Stop listening to state updates
    unsubscribe();
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
require(["ComfortStore"], function (u) {
    console.log("Loaded");
});
define("userComponents", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var Delete = (function (_super) {
        __extends(Delete, _super);
        function Delete() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Delete.prototype.render = function () {
            return React.createElement("a", { href: "void(0);" }, "X");
        };
        return Delete;
    }(React.Component));
    exports.Delete = Delete;
    var User = (function (_super) {
        __extends(User, _super);
        function User() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        User.prototype.render = function () {
            return React.createElement("li", null,
                React.createElement("span", { className: "user" }, this.props.Username),
                React.createElement(Delete, null));
        };
        return User;
    }(React.Component));
    exports.User = User;
    var NewTeam = (function (_super) {
        __extends(NewTeam, _super);
        function NewTeam() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NewTeam.prototype.render = function () {
            return React.createElement("input", { type: "button", value: "new team", id: "new" });
        };
        return NewTeam;
    }(React.Component));
    exports.NewTeam = NewTeam;
    var UserList = (function (_super) {
        __extends(UserList, _super);
        function UserList() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UserList.prototype.render = function () {
            var users = [];
            this.props.Users.forEach(function (user) {
                users.push(React.createElement(User, __assign({}, user)));
            });
            return React.createElement("ul", { id: "users" }, users);
        };
        return UserList;
    }(React.Component));
    exports.UserList = UserList;
});
/*
<ul id="users"><li><span class="user">Adam Hall</span><a href="void(0);">X</a></li><li><span class="user">Billie Davey</span><a href="void(0);">X</a></li><li><span class="user">Laura Rowe</span><a href="void(0);">X</a></li><li><span class="user">Simon Dawson</span><a href="void(0);">X</a></li><li><span class="user">Fred</span><a href="void(0);">X</a></li></ul>
*/
define("users", ["require", "exports", "react", "react-dom", "userComponents", "ComfortReact", "TuckmanReact"], function (require, exports, React, ReactDOM, userComponents_1, ComfortReact_2, TuckmanReact_2) {
    "use strict";
    exports.USERS = [
        { Username: "Bob" },
        { Username: "Donald" }
    ];
    ReactDOM.render(React.createElement(userComponents_1.UserList, { Users: exports.USERS }), document.getElementById("container"));
    ReactDOM.render(React.createElement(ComfortReact_2.ComfortReact, null), document.getElementById("comfort"));
    ReactDOM.render(React.createElement(TuckmanReact_2.TuckmanComponent, null), document.getElementById("tuckman"));
});

//# sourceMappingURL=compiled.js.map
