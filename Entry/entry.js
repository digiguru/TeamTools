/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../Shared/InMemoryBrowserUsers.ts"/>
/// <reference path="../Shared/UserConstructor.ts"/>
requirejs.config({
    baseUrl: '/'
});
var users;
require(['Shared/InMemoryBrowserUsers', 'Shared/UserConstructor'], function (u, c) {
    users = new u.InMemoryBrowserUsers(window);
    var UIEntry = (function () {
        function UIEntry() {
            document.getElementById('new').addEventListener("mousedown", function () {
                UI.ClearUsers();
            });
            document.getElementById('user').addEventListener("keyup", function (e) {
                var code = e.keyCode;
                if (code === 13) {
                    AddUser();
                }
            });
            document.getElementById('add').addEventListener("mousedown", function () {
                AddUser();
            });
        }
        UIEntry.prototype.AddUser = function (username) {
            var _this = this;
            var textNode = document.createElement("span");
            textNode.setAttribute("class", "user");
            textNode.textContent = username;
            var deleteButton = document.createElement("a");
            deleteButton.setAttribute("href", "void(0);");
            deleteButton.textContent = "X";
            deleteButton.addEventListener("mousedown", function (e) {
                var el = e.target.parentNode;
                _this.ClearUser(el.textContent);
                var usernames = UI.GetUsers();
                saveUsers(usernames);
            });
            var newNode = document.createElement("li");
            newNode.appendChild(textNode);
            newNode.appendChild(deleteButton);
            document.getElementById('users').appendChild(newNode);
        };
        UIEntry.prototype.ClearUser = function (username) {
            var parent = document.getElementById('users');
            var nodeList = parent.childNodes;
            for (var i = nodeList.length; i--; i > 0) {
                if (username === nodeList[i].textContent) {
                    document.getElementById('users').removeChild(nodeList[i]);
                }
            }
        };
        UIEntry.prototype.ClearUsers = function () {
            var parent = document.getElementById('users');
            var nodeList = parent.childNodes;
            for (var i = nodeList.length; i--; i > 0) {
                document.getElementById('users').removeChild(nodeList[i]);
            }
        };
        UIEntry.prototype.GetUsername = function () {
            return document.getElementById('user').value;
        };
        UIEntry.prototype.ShowError = function (error) {
            alert(error);
        };
        UIEntry.prototype.ClearUsername = function () {
            document.getElementById('user').value = "";
        };
        UIEntry.prototype.FocusUsername = function () {
            document.getElementById('user').focus();
        };
        UIEntry.prototype.GetUsers = function () {
            var entry = document.getElementById('users').getElementsByClassName('user');
            var usernames = new Array();
            for (var i = 0; i < entry.length; i++) {
                usernames.push(entry.item(i).textContent);
            }
            return usernames;
        };
        ;
        return UIEntry;
    }());
    var UI = new UIEntry();
    var saveUsers = function (usernames) {
        var newusers = c.UserConstructor.createUsersByNames(usernames);
        users.setUsers(newusers).then(function (result) {
            console.log("Set users", result);
        });
    };
    var AddUser = function () {
        var username = UI.GetUsername();
        if (username) {
            var usernames = UI.GetUsers();
            var isUnique = !(usernames.filter(function (value) {
                return value === username;
            }).length);
            if (isUnique) {
                UI.AddUser(username);
                usernames = UI.GetUsers();
                saveUsers(usernames);
                UI.ClearUsername();
                setTimeout(function () { UI.FocusUsername(); }, 10);
            }
            else {
                UI.ShowError("already entered user" + username);
            }
        }
    };
    users.getUsers().then(function (data) {
        UI.ClearUsers();
        UI.FocusUsername();
        if (data && data.length) {
            var strings = data.map(function (user) {
                return user.name;
            });
            for (var i = 0; i < strings.length; i++) {
                UI.AddUser(strings[i]);
            }
        }
    });
});

//# sourceMappingURL=entry.js.map
