var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("ComfortReact", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var ChaosArea = (function (_super) {
        __extends(ChaosArea, _super);
        function ChaosArea(props) {
            var _this = _super.call(this, props) || this;
            _this._onMouseEnter = _this._onMouseEnter.bind(_this);
            _this._onMouseLeave = _this._onMouseLeave.bind(_this);
            _this.state = {
                focus: "not-in-focus",
                width: props.width || "100%",
                height: props.height || "100%"
            };
            return _this;
        }
        ChaosArea.prototype._onMouseEnter = function () {
            this.setState({ focus: "in-focus" });
        };
        ChaosArea.prototype._onMouseLeave = function () {
            this.setState({ focus: "not-in-focus" });
        };
        ChaosArea.prototype.render = function () {
            var className = this.state.focus + " area js-area-standard";
            return React.createElement("g", null,
                React.createElement("rect", { className: className, onMouseEnter: this._onMouseEnter, onMouseLeave: this._onMouseLeave, id: "chaos", width: this.state.width, height: this.state.height }),
                React.createElement("text", { className: "area-label", id: "label-choas", textAnchor: "middle", x: "50%", y: "20" }, "chaos"));
        };
        return ChaosArea;
    }(React.Component));
    exports.ChaosArea = ChaosArea;
    var StretchArea = (function (_super) {
        __extends(StretchArea, _super);
        function StretchArea(props) {
            var _this = _super.call(this, props) || this;
            _this._onMouseEnter = _this._onMouseEnter.bind(_this);
            _this._onMouseLeave = _this._onMouseLeave.bind(_this);
            _this.state = {
                focus: "not-in-focus",
                width: props.width || "100%",
                height: props.height || "100%"
            };
            return _this;
        }
        StretchArea.prototype._onMouseEnter = function () {
            this.setState({ focus: "in-focus" });
        };
        StretchArea.prototype._onMouseLeave = function () {
            this.setState({ focus: "not-in-focus" });
        };
        StretchArea.prototype.render = function () {
            var className = this.state.focus + " area js-area-standard";
            return React.createElement("g", null,
                React.createElement("circle", { onMouseEnter: this._onMouseEnter, onMouseLeave: this._onMouseLeave, className: className, id: "stretch", r: "45%", cx: "50%", cy: "50%" }),
                React.createElement("text", { className: "area-label", id: "label-stretch", textAnchor: "middle", x: "50%", y: "25%" }, "stretch"));
        };
        return StretchArea;
    }(React.Component));
    exports.StretchArea = StretchArea;
    var ComfortArea = (function (_super) {
        __extends(ComfortArea, _super);
        function ComfortArea(props) {
            var _this = _super.call(this, props) || this;
            _this._onMouseEnter = _this._onMouseEnter.bind(_this);
            _this._onMouseLeave = _this._onMouseLeave.bind(_this);
            _this.state = {
                focus: "not-in-focus",
                width: props.width || "100%",
                height: props.height || "100%"
            };
            return _this;
        }
        ComfortArea.prototype._onMouseEnter = function () {
            this.setState({ focus: "in-focus" });
        };
        ComfortArea.prototype._onMouseLeave = function () {
            this.setState({ focus: "not-in-focus" });
        };
        ComfortArea.prototype.render = function () {
            var className = this.state.focus + " area js-area-standard";
            return React.createElement("g", null,
                React.createElement("circle", { onMouseEnter: this._onMouseEnter, onMouseLeave: this._onMouseLeave, className: className, id: "comfort", r: "20%", cx: "50%", cy: "50%" },
                    React.createElement("animate", { attributeType: "XML", attributeName: "r", from: "0%", to: "20%", dur: "0.8s", values: "0%; 25%; 18%; 21%; 20%", keyTimes: "0; 0.3; 0.6; 0.8; 1" })),
                React.createElement("text", { className: "area-label", id: "label-comfort", textAnchor: "middle", x: "50%", y: "50%" }, "comfort"));
            // keySplines=".42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;.42 0 1 1;0 0 .59 1;" 
        };
        return ComfortArea;
    }(React.Component));
    exports.ComfortArea = ComfortArea;
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                width: "100%",
                height: "100%"
            };
            return _this;
        }
        Stage.prototype.render = function () {
            return React.createElement("svg", { id: "stage", width: this.state.width, height: this.state.height }, this.props.children);
        };
        return Stage;
    }(React.Component));
    exports.Stage = Stage;
    var ComfortReact = (function (_super) {
        __extends(ComfortReact, _super);
        function ComfortReact() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ComfortReact.prototype.render = function () {
            return React.createElement(Stage, null,
                React.createElement(ChaosArea, null),
                React.createElement("g", { id: "zones" },
                    React.createElement(StretchArea, null),
                    React.createElement(ComfortArea, null)),
                React.createElement("g", { id: "history" }));
            //         <rect id="clickable" width="100%" height="100%" fill-opacity="0.0"></rect>
        };
        return ComfortReact;
    }(React.Component));
    exports.ComfortReact = ComfortReact;
});
define("__tests__/ComfortModel", ["require", "exports", "react", "ComfortReact"], function (require, exports, React, ComfortReact_1) {
    "use strict";
    var renderizer = require("react-test-renderer");
    it("Should show the chaos area", function () {
        // Arrange
        var component = renderizer.create(React.createElement(ComfortReact_1.Stage, null,
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
        var component = renderizer.create(React.createElement(ComfortReact_1.Stage, null,
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
    it("Should show the comfort area", function () {
        var component = renderizer.create(React.createElement(ComfortReact_1.Stage, null,
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
        var component = renderizer.create(React.createElement(ComfortReact_1.Stage, { width: "800", height: "800" },
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
define("users", ["require", "exports", "react", "react-dom", "userComponents", "ComfortReact"], function (require, exports, React, ReactDOM, userComponents_1, ComfortReact_2) {
    "use strict";
    exports.USERS = [
        new userComponents_1.UserObject("Bob"),
        new userComponents_1.UserObject("Donald")
    ];
    ReactDOM.render(React.createElement(userComponents_1.UserList, { users: exports.USERS }), document.getElementById("container"));
    ReactDOM.render(React.createElement(ComfortReact_2.ComfortReact, null), document.getElementById("comfort"));
});
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="users.tsx"/>
requirejs.config({
    baseUrl: "/",
    paths: {
        'react': '../node_modules/react/dist/react.min',
        'react-dom': '../node_modules/react-dom/dist/react-dom.min',
        'react-test-renderer': '../node_modules/react-test-renderer/index'
    }
});
require(["users"], function (u) {
    console.log("Loaded");
});

//# sourceMappingURL=compiled.js.map
