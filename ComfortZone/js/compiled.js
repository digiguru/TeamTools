var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("ComfortZone/ComfortReact", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var styleStandard = {
        fill: "rgb(0, 215, 254);"
    }, styleHighlight = {
        fill: "rgb(0, 180, 219);"
    };
    var ChaosArea = (function (_super) {
        __extends(ChaosArea, _super);
        function ChaosArea(props) {
            var _this = _super.call(this, props) || this;
            _this._onMouseEnter = _this._onMouseEnter.bind(_this);
            _this._onMouseLeave = _this._onMouseLeave.bind(_this);
            _this.state = { style: styleStandard };
            return _this;
        }
        ChaosArea.prototype._onMouseEnter = function () {
            this.setState({ style: styleHighlight });
        };
        ChaosArea.prototype._onMouseLeave = function () {
            this.setState({ style: styleStandard });
        };
        ChaosArea.prototype.render = function () {
            return React.createElement("g", null,
                React.createElement("rect", { className: "area js-area-standard", id: "chaos", width: "800", height: "800", style: "{this.state.style}" }),
                React.createElement("text", { className: "area-label", id: "label-choas", "text-anchor": "middle", x: "400", y: "50" }, "chaos"));
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
            _this.state = { style: styleStandard };
            return _this;
        }
        StretchArea.prototype._onMouseEnter = function () {
            this.setState({ style: styleHighlight });
        };
        StretchArea.prototype._onMouseLeave = function () {
            this.setState({ style: styleStandard });
        };
        StretchArea.prototype.render = function () {
            return React.createElement("g", null,
                React.createElement("circle", { onMouseEnter: this._onMouseEnter, onMouseLeave: this._onMouseLeave, className: "area js-area-standard", id: "stretch", r: "300.12599083141845", cx: "400", cy: "400", style: "{this.state.style}" }),
                React.createElement("text", { className: "area-label", id: "label-stretch", "text-anchor": "middle", x: "400", y: "200" }, "stretch"));
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
            _this.state = { style: styleStandard };
            return _this;
        }
        ComfortArea.prototype._onMouseEnter = function () {
            this.setState({ style: styleHighlight });
        };
        ComfortArea.prototype._onMouseLeave = function () {
            this.setState({ style: styleStandard });
        };
        ComfortArea.prototype.render = function () {
            return React.createElement("g", null,
                React.createElement("circle", { className: "area js-area-standard", id: "comfort", r: "97.516770592797", cx: "400", cy: "400", style: "{this.state.style}" }),
                React.createElement("text", { className: "area-label", id: "label-comfort", "text-anchor": "middle", x: "400", y: "400" }, "comfort"));
        };
        return ComfortArea;
    }(React.Component));
    exports.ComfortArea = ComfortArea;
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Stage.prototype.render = function () {
            return React.createElement("svg", { id: "stage", width: "800", height: "800" }, this.props.children);
        };
        return Stage;
    }(React.Component));
    exports.Stage = Stage;
    var ComfortReact = (function (_super) {
        __extends(ComfortReact, _super);
        function ComfortReact(props) {
            var _this = _super.call(this, props) || this;
            _this.state = { style: styleStandard };
            return _this;
        }
        ComfortReact.prototype.render = function () {
            return React.createElement(Stage, null,
                React.createElement(ChaosArea, null),
                React.createElement("g", { id: "zones" },
                    React.createElement(StretchArea, null),
                    React.createElement(ComfortArea, null)),
                React.createElement("g", { id: "history" }),
                React.createElement("rect", { id: "clickable", width: "800", height: "800", "fill-opacity": "0.0" }));
        };
        return ComfortReact;
    }(React.Component));
    exports.ComfortReact = ComfortReact;
});
define("ComfortZone/__tests__/ComfortModel", ["require", "exports", "react", "ComfortZone/ComfortReact"], function (require, exports, React, ComfortReact_1) {
    "use strict";
    var renderizer = require('react-test-renderer');
    it('Should show the chaos area', function () {
        debugger;
        var component = renderizer.create(React.createElement(ComfortReact_1.ChaosArea, null));
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        tree.props.onMouseEnter();
        expect(tree).toMatchSnapshot();
        tree.props.onMouseLeave();
        expect(tree).toMatchSnapshot();
    });
    it('Should show the stretch area', function () {
        var component = renderizer.create(React.createElement(ComfortReact_1.Stage, null,
            React.createElement(ComfortReact_1.StretchArea, null)));
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('Should show the comfort area', function () {
        var component = renderizer.create(React.createElement(ComfortReact_1.Stage, null,
            React.createElement(ComfortReact_1.ComfortArea, null)));
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('Should show the comfort model', function () {
        var component = renderizer.create(React.createElement(ComfortReact_1.ComfortReact, null));
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
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
            var store = this.store.filter(function (x) { return x.id === id; });
            if (store.length) {
                return Promise.resolve(store[0]);
            }
            throw Error("Cannot find item by ID: " + id);
        };
        GenericCache.prototype.set = function (items) {
            this.store = items;
            return Promise.resolve(this.store);
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
define("ComfortZone/ComfortUserChoice", ["require", "exports"], function (require, exports) {
    "use strict";
    var ComfortUserChoice = (function () {
        function ComfortUserChoice(user, distance, area) {
            this.user = user;
            this.distance = distance;
            this.area = area;
        }
        return ComfortUserChoice;
    }());
    exports.ComfortUserChoice = ComfortUserChoice;
});
define("Shared/Breadcrumb", ["require", "exports"], function (require, exports) {
    "use strict";
    var Breadcrumb = (function () {
        function Breadcrumb(name, command, params) {
            this.name = name;
            this.command = command;
            this.params = params;
            this.enabled = false;
        }
        return Breadcrumb;
    }());
    exports.Breadcrumb = Breadcrumb;
});
define("Shared/BreadcrumbControl", ["require", "exports", "Shared/Breadcrumb"], function (require, exports, Breadcrumb_1) {
    "use strict";
    var BreadcrumbControl = (function () {
        function BreadcrumbControl() {
            this.items = new Array();
        }
        BreadcrumbControl.prototype.addBreadcrumb = function (name, command, params) {
            this.items.push(new Breadcrumb_1.Breadcrumb(name, command, params));
        };
        return BreadcrumbControl;
    }());
    exports.BreadcrumbControl = BreadcrumbControl;
});
define("Shared/Timed", ["require", "exports"], function (require, exports) {
    "use strict";
    var Timed = (function () {
        function Timed() {
        }
        Timed.for = function (milliseconds) {
            var p = new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(milliseconds);
                }, milliseconds);
            });
            return p;
        };
        return Timed;
    }());
    exports.Timed = Timed;
});
define("Shared/FormUserChoice", ["require", "exports", "Shared/Timed", "Shared/Users"], function (require, exports, Timed_1, Users_2) {
    "use strict";
    var FormUserChoice = (function () {
        function FormUserChoice() {
            var _this = this;
            this.userRepo = new Users_2.InMemoryUsers(); // TODO: DI this
            this.userZone = document.getElementById("users");
            this.d3Users = d3.select("g#users");
            this.userRepo.getUsers().then(function (users) {
                if (users && users.length) {
                    _this.setupUsers(users);
                    _this.show();
                }
            });
        }
        FormUserChoice.prototype.getUser = function (id) {
            return this.userRepo.getUser(id);
        };
        FormUserChoice.prototype.markUserDone = function (user) {
            var _this = this;
            user.voted = true;
            this.userRepo.updateUser(user).then(function (users) {
                _this.rebind(users);
            });
        };
        FormUserChoice.prototype.afterShow = function () {
            console.log("ENDSHOW UserChocieForm");
            this.d3Users
                .selectAll("rect")
                .on("mouseup", this.clickUser());
        };
        FormUserChoice.prototype.hasMoreUsers = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.userRepo.getUsers().then(function (users) {
                    var unvotedUsers = users.filter(function (x) { return !x.voted; });
                    if (unvotedUsers.length) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
            });
        };
        FormUserChoice.prototype.show = function () {
            console.log("SHOW UserChocieForm");
            d3.select(this.userZone)
                .transition()
                .duration(function () { return 800; })
                .style("fill-opacity", 1)
                .attr("transform", "matrix(1,0,0,1,0,0)");
            this.d3Users.selectAll("g").attr("class", function (e) {
                if (e.voted) {
                    return "user-group-complete";
                }
                else {
                    return "user-group";
                }
            });
            return Timed_1.Timed.for(800).then(this.afterShow.bind(this));
        };
        FormUserChoice.prototype.hide = function () {
            var _this = this;
            console.log("HIDE userEntry");
            d3.select(this.userZone)
                .transition()
                .duration(function () { return 800; })
                .style("fill-opacity", 0)
                .attr("transform", "matrix(2,0,0,2,-400,-90)");
            d3.select("g#users")
                .selectAll("rect")
                .on("mouseup", function (e) {
                console.log("NOCLICK User - This was clicked, but ignored", _this);
            });
            return Timed_1.Timed.for(800);
        };
        FormUserChoice.prototype.rebind = function (users) {
            return this.d3Users
                .selectAll("circle")
                .data(users);
        };
        FormUserChoice.prototype.clickUser = function () {
            // "that" is the instance of graph
            var that = this;
            return function (d, i) {
                // "this" is the DOM element
                console.log("CLICK - User - up  UserChocieForm");
                var id = this.getAttribute("data-id");
                var event = new CustomEvent("selectUser", { "detail": { "id": id } });
                document.dispatchEvent(event);
                console.log("This was clicked", that);
            };
        };
        FormUserChoice.prototype.overUser = function () {
            // "that" is the instance of graph
            var that = this;
            return function (d, i) {
                // "this" is the DOM element
                d3.select(this.parentNode)
                    .selectAll("text")
                    .transition()
                    .duration(250)
                    .style("fill", function () { return "#00D7FE"; });
            };
        };
        FormUserChoice.prototype.leaveUser = function () {
            // "that" is the instance of graph
            var that = this;
            return function (d, i) {
                // "this" is the DOM element
                d3.select(this.parentNode)
                    .selectAll("text")
                    .transition()
                    .duration(function () { return 250; })
                    .style("fill", function () { return "grey"; });
            };
        };
        FormUserChoice.prototype.eachUser = function () {
            var that = this;
            return function (e, i) {
                var d3Item = d3.select(this);
                d3Item.append("rect")
                    .attr("y", function (e) { return 60 + (i * 90); })
                    .attr("x", 0)
                    .attr("width", 800)
                    .attr("height", 90)
                    .attr("data-name", e.name)
                    .attr("data-id", e.id)
                    .on("mouseover", that.overUser())
                    .on("mouseleave", that.leaveUser());
                d3Item.append("text")
                    .attr("class", "username")
                    .attr("y", function (e) { return 30 + ((i + 1) * 90); })
                    .attr("x", 60)
                    .attr("data-name", e.name)
                    .style("font-size", 60)
                    .style("font-family", "Share Tech Mono")
                    .text(function (j) { return e.name; });
            };
        };
        FormUserChoice.prototype.addUser = function (user) {
            var _this = this;
            this.userRepo.addUser(user).then(function (users) {
                _this.setupUsers(users);
            });
        };
        FormUserChoice.prototype.setUsers = function (users) {
            var _this = this;
            this.destroyUsers();
            this.userRepo.setUsers(users).then(function (users) {
                _this.setupUsers(users);
                _this.show();
            });
        };
        FormUserChoice.prototype.destroyUsers = function () {
            d3.select("g#users").selectAll("*").remove();
        };
        FormUserChoice.prototype.setupUsers = function (users) {
            var items = this.rebind(users);
            items.enter().append("g")
                .attr("id", function (e) { return e.id; })
                .each(this.eachUser());
        };
        return FormUserChoice;
    }());
    exports.FormUserChoice = FormUserChoice;
});
define("ComfortZone/ComfortZones", ["require", "exports"], function (require, exports) {
    "use strict";
    var ComfortZones = (function () {
        function ComfortZones(name, radius) {
            this.name = name;
            this.radius = radius;
        }
        return ComfortZones;
    }());
    exports.ComfortZones = ComfortZones;
});
define("Shared/Polar", ["require", "exports"], function (require, exports) {
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
define("Shared/Point", ["require", "exports", "Shared/Polar"], function (require, exports, Polar_1) {
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
define("ComfortZone/GraphComfortBase", ["require", "exports", "Shared/Timed", "ComfortZone/ComfortZones", "Shared/Point"], function (require, exports, Timed_2, ComfortZones_1, Point_1) {
    "use strict";
    var GraphComfortBase = (function () {
        function GraphComfortBase() {
            this.setupArea();
        }
        GraphComfortBase.prototype.setupArea = function () {
            var zones = [new ComfortZones_1.ComfortZones("stretch", 300), new ComfortZones_1.ComfortZones("comfort", 100)];
            var d3zones = d3.select("g#zones")
                .selectAll("circle")
                .data(zones);
            d3zones.enter().append("circle")
                .attr("cx", 400)
                .attr("cy", 400)
                .attr("r", 0)
                .attr("class", "area")
                .attr("id", function (d) {
                return d.name;
            });
            this.chaos = document.getElementById("chaos");
            this.stretch = document.getElementById("stretch");
            this.comfort = document.getElementById("comfort");
            var centerX = Number(this.comfort.getAttribute("cx"));
            var centerY = Number(this.comfort.getAttribute("cy"));
            this.centerPoint = new Point_1.Point(centerX, centerY);
        };
        GraphComfortBase.prototype.hide = function () {
            console.log("HIDE comfortGRAPH");
            var d3zones = d3.select("g#zones")
                .selectAll("circle")
                .transition()
                .duration(1000)
                .attr("r", 0);
            var d3drops = d3.select("#stage")
                .selectAll("circle.dropper")
                .transition()
                .delay(250)
                .duration(250)
                .attr("r", 0);
            return Timed_2.Timed.for(1000);
        };
        GraphComfortBase.prototype.showBase = function () {
            console.log("SHOW graph");
            var d3zones = d3.select("g#zones")
                .selectAll("circle")
                .attr("r", 0)
                .transition()
                .duration(1000)
                .delay(function (d, i) { return i * 100; })
                .ease("elastic")
                .attr("r", function (d) {
                return d.radius;
            });
            return Timed_2.Timed.for(1000);
        };
        return GraphComfortBase;
    }());
    exports.GraphComfortBase = GraphComfortBase;
});
define("Shared/SVG", ["require", "exports"], function (require, exports) {
    "use strict";
    var SVG = (function () {
        function SVG() {
        }
        SVG.element = function (tagName) {
            return document.createElementNS("http://www.w3.org/2000/svg", tagName);
        };
        SVG.circle = function (r, x, y, className) {
            var el = SVG.element("circle");
            el.setAttribute("r", r);
            el.setAttribute("cx", x);
            el.setAttribute("cy", y);
            el.setAttribute("class", className);
            return el;
        };
        return SVG;
    }());
    exports.SVG = SVG;
});
define("ComfortZone/GraphComfortEntry", ["require", "exports", "ComfortZone/GraphComfortBase", "Shared/Point", "Shared/SVG"], function (require, exports, GraphComfortBase_1, Point_2, SVG_1) {
    "use strict";
    var GraphComfortEntry = (function (_super) {
        __extends(GraphComfortEntry, _super);
        function GraphComfortEntry() {
            var _this = _super.call(this) || this;
            _this.clickArea = document.getElementById("clickable");
            _this.setupOverActivity();
            return _this;
        }
        GraphComfortEntry.prototype.setupOverActivity = function () {
            var that = this;
            d3.select("#stage").on("mousemove", this.graphMove());
        };
        GraphComfortEntry.prototype.setupClickActivity = function () {
            console.log("SETUP graph click");
            d3.select("#stage").on("mouseup", this.graphUp());
            d3.select("#stage").on("mousedown", this.graphDown());
        };
        GraphComfortEntry.prototype.graphMove = function () {
            /// "that" is the instance of graph
            var that = this;
            return function (d, i) {
                // "this" is the DOM element
                var coord = d3.mouse(this);
                var distance = Point_2.Point.distance(that.centerPoint, Point_2.Point.fromCoords(coord));
                var area = GraphComfortEntry.calculateDistance(distance);
                that.highlight(area);
            };
        };
        GraphComfortEntry.prototype.graphUp = function () {
            // "that" is the instance of graph
            var that = this;
            return function (d, i) {
                // "this" is the DOM element
                var coord = Point_2.Point.fromCoords(d3.mouse(this));
                var distance = Point_2.Point.distance(that.centerPoint, coord);
                var area = GraphComfortEntry.calculateDistance(distance);
                that.saveTheInteraction(area, distance);
            };
        };
        GraphComfortEntry.prototype.graphDown = function () {
            // "that" is the instance of graph
            var that = this;
            return function (d, i) {
                // "this" is the DOM element
                var coord = Point_2.Point.fromCoords(d3.mouse(this));
                var el = SVG_1.SVG.circle(8, coord.x, coord.y, "dropper");
                that.addDropper(el);
            };
        };
        GraphComfortEntry.prototype.highlight = function (area) {
            var d3zones = d3.select("svg")
                .selectAll(".area")
                .transition()
                .delay(function () {
                if (this.getAttribute("id") === area) {
                    return 0;
                }
                return 100;
            })
                .ease("cubic")
                .duration(function () { return 250; })
                .style("fill", function () {
                if (this.getAttribute("id") === area) {
                    return "rgb(0, 180, 219)";
                }
                return "#00D7FE";
            });
        };
        GraphComfortEntry.prototype.addDropper = function (el) {
            this.dropper = el;
            document.getElementById("stage").insertBefore(el, this.clickArea);
        };
        GraphComfortEntry.calculateDistance = function (distance) {
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
        GraphComfortEntry.prototype.removeInteractions = function () {
            console.log("REMOVE activiteis from GraphComfortEntry");
            d3.select("#stage").on("mouseup", function () {
                console.log("UNCLICK - Graphup - No longer interactive stage");
            });
            d3.select("#stage").on("mousedown", function () {
                console.log("UNCLICK - Graphdown - No longer interactive stage");
            });
            d3.select("#stage").on("mousemove", function () {
                console.log("UNMove - mousemove - No longer interactive stage");
            });
        };
        GraphComfortEntry.prototype.saveTheInteraction = function (area, distance) {
            console.log("saveTheInteraction");
            this.removeInteractions();
            // TODO: Put in the line below
            var event = new CustomEvent("saveGraph", {
                "detail": {
                    "area": area,
                    "distance": distance,
                    "currentUser": this.currentUser
                }
            });
            document.dispatchEvent(event);
        };
        GraphComfortEntry.prototype.show = function (user) {
            this.currentUser = user;
            var Thenable = this.showBase();
            this.setupOverActivity();
            return Thenable.then(this.setupClickActivity.bind(this));
        };
        return GraphComfortEntry;
    }(GraphComfortBase_1.GraphComfortBase));
    exports.GraphComfortEntry = GraphComfortEntry;
});
define("ComfortZone/GraphComfortHistory", ["require", "exports", "ComfortZone/GraphComfortBase", "Shared/Point", "Shared/Polar"], function (require, exports, GraphComfortBase_2, Point_3, Polar_2) {
    "use strict";
    var GraphComfortHistory = (function (_super) {
        __extends(GraphComfortHistory, _super);
        function GraphComfortHistory() {
            var _this = _super.call(this) || this;
            _this.graphData = new Array();
            return _this;
        }
        GraphComfortHistory.prototype.show = function (graphData) {
            this.graphData = graphData;
            var Thenable = this.showBase();
            d3.select("g#history")
                .selectAll("circle")
                .data(this.graphData)
                .enter()
                .append("circle")
                .attr("cx", 400)
                .attr("cy", 400)
                .attr("r", 10)
                .attr("class", "point")
                .attr("id", function (d) { return d.user.name; });
            var totalPoints = graphData.length;
            var radian = 6.2831853072; // 360 * Math.PI / 180;
            var polarDivision = radian / totalPoints;
            d3.select("g#history")
                .selectAll("circle")
                .transition()
                .duration(function () { return 800; })
                .attr("cx", function (data, index) {
                var angle = polarDivision * index;
                return Point_3.Point.toCartesian(new Polar_2.Polar(data.distance, angle), new Point_3.Point(400, 400)).x;
            })
                .attr("cy", function (data, index) {
                var angle = polarDivision * index;
                return Point_3.Point.toCartesian(new Polar_2.Polar(data.distance, angle), new Point_3.Point(400, 400)).y;
            });
            Thenable.then(function () {
                console.log("SHOWED base graph - now what?");
            });
            return Thenable;
        };
        GraphComfortHistory.prototype.hide = function () {
            return null;
        };
        return GraphComfortHistory;
    }(GraphComfortBase_2.GraphComfortBase));
    exports.GraphComfortHistory = GraphComfortHistory;
});
define("ComfortZone/Mediator", ["require", "exports", "ComfortZone/ComfortUserChoice", "Shared/BreadcrumbControl", "Shared/FormUserChoice", "ComfortZone/GraphComfortEntry", "ComfortZone/GraphComfortHistory"], function (require, exports, ComfortUserChoice_1, BreadcrumbControl_1, FormUserChoice_1, GraphComfortEntry_1, GraphComfortHistory_1) {
    "use strict";
    var Mediator = (function () {
        function Mediator() {
            console.log("START everything");
            this.userChoiceHistory = new Array();
            this.formUserChoice = new FormUserChoice_1.FormUserChoice();
            this.breadcrumbControl = new BreadcrumbControl_1.BreadcrumbControl();
        }
        Mediator.prototype.do = function (command, params) {
            switch (command) {
                case "addUser":
                    this.addUser(params);
                    break;
                case "setUsers":
                    this.setUsers(params);
                    break;
                case "saveComfortFeedback":
                    var area = params.area;
                    var distance = params.number;
                    var user = params.user;
                    this.saveGraph(area, distance, user);
                    break;
                case "showUserChoice":
                    this.showUserChoice();
                    break;
                case "showGraphComfortHistory":
                    this.showGraphComfortHistory();
                    break;
                case "showGraphComfortChoice":
                    var comfortuser = params;
                    this.showGraphComfortEntry(comfortuser);
                    break;
            }
        };
        Mediator.prototype.addUser = function (user) {
            this.formUserChoice.addUser(user);
        };
        Mediator.prototype.setUsers = function (users) {
            this.formUserChoice.setUsers(users);
        };
        Mediator.prototype.showUserChoice = function () {
            this.formUserChoice.show();
        };
        Mediator.prototype.showGraphComfortEntry = function (user) {
            if (!this.graphComfortEntry) {
                this.graphComfortEntry = new GraphComfortEntry_1.GraphComfortEntry();
            }
            this.graphComfortEntry.show(user);
        };
        Mediator.prototype.showComfortHistory = function (history) {
            var afterHide = function () {
                if (!this.graphComfortHistory) {
                    this.graphComfortEntry = null;
                    this.graphComfortHistory = new GraphComfortHistory_1.GraphComfortHistory();
                }
                this.graphComfortHistory.show(history);
            }.bind(this);
            if (this.graphComfortEntry) {
                this.graphComfortEntry.hide().then(afterHide);
            }
            else {
                if (this.formUserChoice) {
                    this.formUserChoice.hide();
                }
                afterHide();
            }
        };
        Mediator.prototype.showGraphComfortHistory = function () {
            if (!this.graphComfortHistory) {
                this.graphComfortEntry = null;
                this.graphComfortHistory = new GraphComfortHistory_1.GraphComfortHistory();
            }
            this.graphComfortHistory.show(this.userChoiceHistory);
        };
        Mediator.prototype.selectUser = function (id) {
            var _this = this;
            console.log("ACTION selectUser", id);
            this.formUserChoice.getUser(id).then(function (user) {
                _this.formUserChoice.hide();
                _this.showGraphComfortEntry(user);
            });
        };
        Mediator.prototype.saveGraph = function (area, distance, user) {
            this.formUserChoice.markUserDone(user);
            this.addUserChoiceHistory(area, distance, user);
            this.next();
        };
        Mediator.prototype.addUserChoiceHistory = function (area, distance, user) {
            var thisUserChoice = this.userChoiceHistory.filter(function (x) { return x.user.id === user.id; });
            if (thisUserChoice.length) {
                thisUserChoice[0].area = area;
                thisUserChoice[0].distance = distance;
            }
            else {
                var userChoice = new ComfortUserChoice_1.ComfortUserChoice(user, distance, area);
                this.userChoiceHistory.push(userChoice);
            }
        };
        Mediator.prototype.next = function () {
            console.log("ACTION nextUser", this);
            var afterHide = function () {
                var _this = this;
                this.formUserChoice.hasMoreUsers().then(function (result) {
                    if (result) {
                        console.log("Users left...", _this);
                        _this.showUserChoice();
                    }
                    else {
                        console.log("NO users left", _this);
                        _this.showGraphComfortHistory();
                    }
                });
            }.bind(this);
            this.graphComfortEntry.hide().then(afterHide);
        };
        return Mediator;
    }());
    exports.Mediator = Mediator;
});
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../Shared/User.ts"/>
/// <reference path="../Shared/InMemoryBrowserUsers.ts"/>
/// <reference path="../ComfortZone/Mediator.ts"/>
var mediator, userLoader;
requirejs.config({
    baseUrl: "/"
});
require(["ComfortZone/Mediator", "Shared/User", "Shared/InMemoryBrowserUsers"], function (m, u, b) {
    console.log("Starting");
    mediator = new m.Mediator(23, 23);
    console.log(mediator);
    userLoader = new b.InMemoryBrowserUsers(window);
    userLoader.getUsers().then(function (users) {
        if (users) {
            mediator.setUsers(users);
        }
        else {
            mediator.setUsers([
                new u.User("Adam Hall", "xxx1"),
                new u.User("Billie Davey", "xxx2"),
                new u.User("Laura Rowe", "xxx3"),
                new u.User("Simon Dawson", "xxx4")
            ]);
        }
    });
    document.addEventListener("selectUser", function (e) {
        mediator.selectUser(e.detail.id);
    });
    document.addEventListener("saveGraph", function (e) {
        var o = e.detail;
        mediator.saveGraph(o.area, o.distance, o.currentUser);
    });
    console.log(mediator);
});
define("ComfortZone/ComfortUserChoiceHistory", ["require", "exports"], function (require, exports) {
    "use strict";
    var ComfortUserChoiceHistory = (function () {
        function ComfortUserChoiceHistory() {
        }
        return ComfortUserChoiceHistory;
    }());
    exports.ComfortUserChoiceHistory = ComfortUserChoiceHistory;
});

//# sourceMappingURL=compiled.js.map
