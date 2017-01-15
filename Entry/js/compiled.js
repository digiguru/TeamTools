define("Shared/Cache", ["require", "exports"], function (require, exports) {
    "use strict";
    var GenericCache = (function () {
        function GenericCache() {
            this.store = [];
        }
        GenericCache.prototype.update = function (item) {
            for (var i = 0; i < this.store.length; i++) {
                if (item.id === this.store[i].id) {
                    this.store[i] = item;
                }
            }
            return Promise.resolve(this.store);
        };
        GenericCache.prototype.add = function (item) {
            this.store.push(item);
            return Promise.resolve(this.store);
        };
        GenericCache.prototype.get = function () {
            return Promise.resolve(this.store);
        };
        GenericCache.prototype.getById = function (id) {
            var store = this.store.filter(function (x) {
                return x.id === id;
            });
            if (store.length) {
                return Promise.resolve(store[0]);
            }
            throw Error("Cannot find item by ID: " + id);
        };
        GenericCache.prototype.set = function (items) {
            this.store = items;
            return Promise.resolve(this.store);
            ;
        };
        return GenericCache;
    }());
    exports.GenericCache = GenericCache;
});
define("Shared/User", ["require", "exports"], function (require, exports) {
    "use strict";
    var User = (function () {
        function User(name, id) {
            this.name = name;
            this.id = id;
            this.voted = false;
        }
        return User;
    }());
    exports.User = User;
});
define("Shared/IUsers", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Shared/UserConstructor", ["require", "exports", "Shared/User"], function (require, exports, User_1) {
    "use strict";
    var UserConstructor = (function () {
        function UserConstructor() {
        }
        UserConstructor.notEmpty = function (input) {
            return (input !== "");
        };
        UserConstructor.createUsersByNames = function (names) {
            var _this = this;
            var filtered = names.filter(UserConstructor.notEmpty);
            var users = filtered.map(function (v, i) {
                return _this.createUser(v, i);
            });
            return users;
        };
        UserConstructor.createUser = function (name, index) {
            return new User_1.User(name, "user" + index);
        };
        return UserConstructor;
    }());
    exports.UserConstructor = UserConstructor;
});
define("Shared/Users", ["require", "exports", "Shared/Cache", "Shared/UserConstructor"], function (require, exports, Cache_1, UserConstructor_1) {
    "use strict";
    var InMemoryUsers = (function () {
        function InMemoryUsers() {
            this.cache = new Cache_1.GenericCache();
            var users = UserConstructor_1.UserConstructor.createUsersByNames([
                "Adam Hall",
                "Billie Davey",
                "Laura Rowe",
                "Simon Dawson"
            ]);
            this.setUsers(users);
        }
        InMemoryUsers.prototype.addUser = function (user) {
            return this.cache.add(user);
        };
        InMemoryUsers.prototype.addUserByName = function (name) {
            return this.cache.add(UserConstructor_1.UserConstructor.createUser(name, 9));
        };
        InMemoryUsers.prototype.updateUser = function (user) {
            return this.cache.update(user);
        };
        InMemoryUsers.prototype.getUsers = function () {
            return this.cache.get();
        };
        InMemoryUsers.prototype.getUser = function (id) {
            return this.cache.getById(id);
        };
        InMemoryUsers.prototype.saveUser = function (user) {
            return this.cache.update(user);
        };
        InMemoryUsers.prototype.setUsers = function (users) {
            return this.cache.set(users);
        };
        return InMemoryUsers;
    }());
    exports.InMemoryUsers = InMemoryUsers;
});
define("Shared/BrowserRepo", ["require", "exports"], function (require, exports) {
    "use strict";
    var BrowserRepo = (function () {
        function BrowserRepo(key, window) {
            this.br = window;
            this.key = key;
        }
        BrowserRepo.prototype.get = function () {
            var text = this.br.localStorage.getItem(this.key);
            var json = JSON.parse(text);
            return Promise.resolve(json);
        };
        BrowserRepo.prototype.save = function (thing) {
            var text = JSON.stringify(thing);
            this.br.localStorage.setItem(this.key, text);
            return Promise.resolve(thing);
        };
        return BrowserRepo;
    }());
    exports.BrowserRepo = BrowserRepo;
});
define("Shared/BrowserUsers", ["require", "exports", "Shared/BrowserRepo"], function (require, exports, BrowserRepo_1) {
    "use strict";
    var BrowserUsers = (function () {
        function BrowserUsers(window) {
            this.repo = new BrowserRepo_1.BrowserRepo("users", window);
        }
        BrowserUsers.prototype.getUsers = function () {
            return this.repo.get();
        };
        BrowserUsers.prototype.saveUsers = function (users) {
            return this.repo.save(users);
        };
        return BrowserUsers;
    }());
    exports.BrowserUsers = BrowserUsers;
});
define("Shared/InMemoryBrowserUsers", ["require", "exports", "Shared/Users", "Shared/BrowserUsers"], function (require, exports, Users_1, BrowserUsers_1) {
    "use strict";
    var InMemoryBrowserUsers = (function () {
        function InMemoryBrowserUsers(window) {
            this.cache = new Users_1.InMemoryUsers();
            this.repo = new BrowserUsers_1.BrowserUsers(window);
        }
        InMemoryBrowserUsers.prototype.updateUser = function (user) {
            var _this = this;
            var prom = this.cache.updateUser(user);
            prom.then(function (users) {
                _this.repo.saveUsers(users);
            });
            return prom;
        };
        InMemoryBrowserUsers.prototype.addUser = function (user) {
            var _this = this;
            var prom = this.cache.addUser(user);
            prom.then(function (users) {
                _this.repo.saveUsers(users);
            });
            return prom;
        };
        InMemoryBrowserUsers.prototype.getUsers = function () {
            var _this = this;
            var prom = this.repo.getUsers();
            prom.then(function (users) {
                _this.cache.setUsers(users);
            });
            return prom;
        };
        InMemoryBrowserUsers.prototype.getUser = function (id) {
            var result = this.cache.getUser(id);
            return Promise.resolve(result);
        };
        InMemoryBrowserUsers.prototype.setUsers = function (users) {
            var promCache = this.cache.setUsers(users);
            var promRepo = this.repo.saveUsers(users);
            return promCache;
        };
        return InMemoryBrowserUsers;
    }());
    exports.InMemoryBrowserUsers = InMemoryBrowserUsers;
});
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

//# sourceMappingURL=compiled.js.map
