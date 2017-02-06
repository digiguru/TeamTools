var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
    //const r = new Polar(1,20);
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
                React.createElement("text", { className: "area-label", id: "label-choas", "text-anchor": "middle", textAnchor: "middle", x: "50%", y: "20" }, "chaos"));
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
                React.createElement("g", { id: "history" }));
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
        debugger;
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
        debugger;
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
define("ComfortReactState", ["require", "exports", "immutable"], function (require, exports, immutable_1) {
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
        ChaosPickerStateFactory.prototype.default = function () {
            var zoneArr = [
                { Name: "Comfort", Focus: false, Range: { Start: 0, End: 100 } },
                { Name: "Stretch", Focus: false, Range: { Start: 100, End: 200 } },
                { Name: "Chaos", Focus: false, Range: { Start: 200, End: 300 } }
            ];
            return {
                UserList: immutable_1.List([]),
                Zones: immutable_1.List(zoneArr),
                ShowUserChoices: false,
                UserChoices: immutable_1.List([])
            };
        };
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
define("ComfortReactReducer", ["require", "exports"], function (require, exports) {
    "use strict";
    var createStore = require("redux").createStore;
    var ComfortZoneActionFactory = (function () {
        function ComfortZoneActionFactory() {
        }
        ComfortZoneActionFactory.prototype.setFocusToComfort = function () {
            return { type: "SET_FOCUS", area: "comfort" };
        };
        ComfortZoneActionFactory.prototype.selectUserAdam = function () {
            return { type: "SELECT_USER", user: "Adam" };
        };
        ComfortZoneActionFactory.prototype.adamChooseZoneStretch165 = function () {
            return { type: "CHOOSE_ZONE", user: "Adam", area: "Stretch", distance: "165" };
        };
        ComfortZoneActionFactory.prototype.showChoices = function () {
            return { type: "SHOW_CHOICES" };
        };
        return ComfortZoneActionFactory;
    }());
    exports.ComfortZoneActionFactory = ComfortZoneActionFactory;
    var ComfortZoneAction = (function () {
        function ComfortZoneAction() {
        }
        ComfortZoneAction.prototype.doAction = function (state, action) {
            switch (action.type) {
                case "SET_FOCUS":
                    return this.setFocus(state, action.area);
                case "SELECT_USER":
                    return this.selectUser(state, action.user);
                case "CHOOSE_ZONE":
                    return this.chooseZone(state, action.user, action.area, action.distance);
                case "SHOW_CHOICES":
                    return this.showChoices(state);
                default:
                    return state;
            }
        };
        ComfortZoneAction.prototype.setFocus = function (state, area) {
            // Set focus to true on this zone, and all others to false.
            state.Zones = state.Zones.map(function (v, i) {
                var data = Immutable.Map(v).set("Focus", (v.Name === area));
                return data.toJS();
            }).toList();
            return state;
        };
        ComfortZoneAction.prototype.selectUser = function (state, user) {
            // Sets currentUser, and therefor hides the user choice menu
            /*return Object.assign({}, state, {
                CurrentUser: user,
                ShowUserChoices: false
            });*/
            var data = Immutable.Map(state)
                .set("CurrentUser", user)
                .set("ShowUserChoices", false);
            return data.toJS();
        };
        ComfortZoneAction.prototype.chooseZone = function (state, user, area, distance) {
            // Adds to UserChoices, and sets currentUser to empty
            var data = state.UserChoices.push({
                User: user,
                Zone: area,
                Distance: distance
            });
            return Immutable.Map(state)
                .delete("CurrentUser")
                .set("UserChoices", data).toJS();
        };
        ComfortZoneAction.prototype.showChoices = function (state) {
            // Set "showUserChoices" to true
            return Immutable.Map(state)
                .set("ShowUserChoices", true).toJS();
        };
        return ComfortZoneAction;
    }());
    exports.ComfortZoneAction = ComfortZoneAction;
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
                React.createElement("span", { className: "user" }, this.props.username),
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
            this.props.users.forEach(function (user) {
                users.push(React.createElement(User, { username: user.name, key: user.name }));
            });
            return React.createElement("ul", { id: "users" }, users);
        };
        return UserList;
    }(React.Component));
    exports.UserList = UserList;
    var UserObject = (function () {
        function UserObject(name) {
            this.name = name;
        }
        return UserObject;
    }());
    exports.UserObject = UserObject;
});
/*
<ul id="users"><li><span class="user">Adam Hall</span><a href="void(0);">X</a></li><li><span class="user">Billie Davey</span><a href="void(0);">X</a></li><li><span class="user">Laura Rowe</span><a href="void(0);">X</a></li><li><span class="user">Simon Dawson</span><a href="void(0);">X</a></li><li><span class="user">Fred</span><a href="void(0);">X</a></li></ul>
*/
define("users", ["require", "exports", "react", "react-dom", "userComponents", "ComfortReact", "TuckmanReact"], function (require, exports, React, ReactDOM, userComponents_1, ComfortReact_2, TuckmanReact_2) {
    "use strict";
    exports.USERS = [
        new userComponents_1.UserObject("Bob"),
        new userComponents_1.UserObject("Donald")
    ];
    ReactDOM.render(React.createElement(userComponents_1.UserList, { users: exports.USERS }), document.getElementById("container"));
    ReactDOM.render(React.createElement(ComfortReact_2.ComfortReact, null), document.getElementById("comfort"));
    ReactDOM.render(React.createElement(TuckmanReact_2.TuckmanComponent, null), document.getElementById("tuckman"));
});
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../node_modules/immutable/dist/immutable.d.ts" />
/// <reference path="../node_modules/redux/index.d.ts" />
/// <reference path="users.tsx"/>
requirejs.config({
    baseUrl: "/",
    paths: {
        "react": "../3rdParty/react.min",
        "react-dom": "../3rdParty/react-dom.min",
        "immutable": "../3rdParty/immutable.min",
        "redux": "../3rdParty/redux.min"
    }
});
require(["users"], function (u) {
    console.log("Loaded");
});

//# sourceMappingURL=compiled.js.map
