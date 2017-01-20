var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
<ul id="users"><li><span class="user">Adam Hall</span><a href="void(0);">X</a></li><li><span class="user">Billie Davey</span><a href="void(0);">X</a></li><li><span class="user">Laura Rowe</span><a href="void(0);">X</a></li><li><span class="user">Simon Dawson</span><a href="void(0);">X</a></li><li><span class="user">Fred</span><a href="void(0);">X</a></li></ul>
*/
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
var UserList = (function (_super) {
    __extends(UserList, _super);
    function UserList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserList.prototype.render = function () {
        var users = [];
        this.props.users.forEach(function (user) {
            users.push(React.createElement(User, { user: user, username: user.name, key: user.name }));
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

//# sourceMappingURL=compiled.js.map
