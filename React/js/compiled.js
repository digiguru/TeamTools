var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        debugger;
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
/*
<ul id="users"><li><span class="user">Adam Hall</span><a href="void(0);">X</a></li><li><span class="user">Billie Davey</span><a href="void(0);">X</a></li><li><span class="user">Laura Rowe</span><a href="void(0);">X</a></li><li><span class="user">Simon Dawson</span><a href="void(0);">X</a></li><li><span class="user">Fred</span><a href="void(0);">X</a></li></ul>
*/
define("users", ["require", "exports", "react", "react-dom"], function (require, exports, React, ReactDOM) {
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
    var EntryPage = (function (_super) {
        __extends(EntryPage, _super);
        function EntryPage() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EntryPage.prototype.render = function () {
            return React.createElement(UserList, { users: USERS });
        };
        return EntryPage;
    }(React.Component));
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
    var UserObject = (function () {
        function UserObject(name) {
            this.name = name;
        }
        return UserObject;
    }());
    var USERS = [
        new UserObject("Bob"),
        new UserObject("Donald")
    ];
    ReactDOM.render(React.createElement(UserList, { users: USERS }), document.getElementById("container"));
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
