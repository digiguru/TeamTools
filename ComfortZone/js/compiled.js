var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            this.userRepo = new Users_2.InMemoryUsers(); //DI this
            this.userZone = document.getElementById('users');
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
                    var unvotedUsers = users.filter(function (x) {
                        return !x.voted;
                    });
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
                .duration(function () {
                return 800;
            })
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
            console.log("HIDE userEntry");
            d3.select(this.userZone)
                .transition()
                .duration(function () {
                return 800;
            })
                .style("fill-opacity", 0)
                .attr("transform", "matrix(2,0,0,2,-400,-90)");
            d3.select("g#users")
                .selectAll("rect")
                .on("mouseup", function (e) {
                console.log("NOCLICK User - This was clicked, but ignored", this);
            });
            return Timed_1.Timed.for(800);
        };
        FormUserChoice.prototype.rebind = function (users) {
            return this.d3Users
                .selectAll("circle")
                .data(users);
        };
        FormUserChoice.prototype.clickUser = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                console.log("CLICK - User - up  UserChocieForm");
                //const name = this.getAttribute("data-name");
                var id = this.getAttribute("data-id");
                var event = new CustomEvent('selectUser', { "detail": { "id": id } });
                document.dispatchEvent(event);
                console.log("This was clicked", that);
            };
        };
        FormUserChoice.prototype.overUser = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                d3.select(this.parentNode)
                    .selectAll("text")
                    .transition()
                    .duration(250)
                    .style("fill", function () {
                    return "#00D7FE";
                });
            };
        };
        FormUserChoice.prototype.leaveUser = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                d3.select(this.parentNode)
                    .selectAll("text")
                    .transition()
                    .duration(function () {
                    return 250;
                })
                    .style("fill", function () {
                    return "grey";
                });
            };
        };
        FormUserChoice.prototype.eachUser = function () {
            var that = this;
            return function (e, i) {
                //Event.add(['mousedown'], this.stage, this.chooseUser);
                //Event.add(["mouseover"], this, thisStage.checkOverUsers);
                var d3Item = d3.select(this);
                d3Item.append("rect")
                    .attr("y", function (e) {
                    return 60 + (i * 90);
                })
                    .attr("x", 0)
                    .attr("width", 800)
                    .attr("height", 90)
                    .attr("data-name", e.name)
                    .attr("data-id", e.id)
                    .on("mouseover", that.overUser())
                    .on("mouseleave", that.leaveUser());
                d3Item.append("text")
                    .attr("class", "username")
                    .attr("y", function (e) {
                    return 30 + ((i + 1) * 90);
                })
                    .attr("x", 60)
                    .attr("data-name", e.name)
                    .style("font-size", 60)
                    .style("font-family", "Share Tech Mono")
                    .text(function (j) {
                    return e.name;
                });
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
                .attr("id", function (e) {
                return e.id;
            })
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
//import Polar = require('Polar');
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
//});
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
            this.chaos = document.getElementById('chaos');
            this.stretch = document.getElementById('stretch');
            this.comfort = document.getElementById('comfort');
            var centerX = Number(this.comfort.getAttribute('cx'));
            var centerY = Number(this.comfort.getAttribute('cy'));
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
            //<circle id="stretch" r="300" cx="400" cy="400" />
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
            _this.clickArea = document.getElementById('clickable');
            _this.setupOverActivity();
            return _this;
        }
        GraphComfortEntry.prototype.setupOverActivity = function () {
            var that = this;
            d3.select("#stage").on("mousemove", this.graphMove()); //this.checkArea);
        };
        GraphComfortEntry.prototype.setupClickActivity = function () {
            console.log("SETUP graph click");
            d3.select("#stage").on("mouseup", this.graphUp());
            d3.select("#stage").on("mousedown", this.graphDown());
        };
        GraphComfortEntry.prototype.graphMove = function () {
            /// 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = d3.mouse(this);
                var distance = Point_2.Point.distance(that.centerPoint, Point_2.Point.fromCoords(coord));
                var area = GraphComfortEntry.calculateDistance(distance);
                that.highlight(area);
            };
        };
        GraphComfortEntry.prototype.graphUp = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = Point_2.Point.fromCoords(d3.mouse(this));
                var distance = Point_2.Point.distance(that.centerPoint, coord);
                var area = GraphComfortEntry.calculateDistance(distance);
                that.saveTheInteraction(area, distance);
            };
        };
        GraphComfortEntry.prototype.graphDown = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = Point_2.Point.fromCoords(d3.mouse(this));
                var el = SVG_1.SVG.circle(8, coord.x, coord.y, "dropper");
                that.addDropper(el);
            };
        };
        GraphComfortEntry.prototype.highlight = function (area) {
            //<circle id="stretch" r="300" cx="400" cy="400" />
            //<circle id="comfort" r="100" cx="400" cy="400" />
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
                .duration(function () {
                return 250;
            })
                .style("fill", function () {
                if (this.getAttribute("id") === area) {
                    return "rgb(0, 180, 219)";
                }
                return "#00D7FE";
            });
        };
        GraphComfortEntry.prototype.addDropper = function (el) {
            this.dropper = el;
            document.getElementById('stage').insertBefore(el, this.clickArea);
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
            //TODO: Put in the line below
            var event = new CustomEvent('saveGraph', {
                "detail": {
                    "area": area,
                    "distance": distance,
                    "currentUser": this.currentUser
                }
            });
            document.dispatchEvent(event);
            //mediator.saveGraph();
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
            //this.setupHistory();
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
                .attr("id", function (d) {
                return d.user.name;
            });
            var totalPoints = graphData.length;
            var radian = 6.2831853072; //360 * Math.PI / 180;
            var polarDivision = radian / totalPoints;
            d3.select("g#history")
                .selectAll("circle")
                .transition()
                .duration(function () {
                return 800;
            })
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
            var thisUserChoice = this.userChoiceHistory.filter(function (x) {
                return x.user.id === user.id;
            });
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
            //const prom = new Promsie()
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
    baseUrl: '/'
});
require(['ComfortZone/Mediator', 'Shared/User', 'Shared/InMemoryBrowserUsers'], function (m, u, b) {
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
    //;")
    console.log(mediator);
});
/*
Commands you can throw into the mediator....

mediator.setUsers([
   {name:"Nigel Hall",id:"1xx0"},
   {name:"Fred Hall",id:"1xx1"},
   {name:"Bob Hall",id:"1xx2"}
]);

mediator.addUser({name:"Mandy", id:"981298129"})

*/
//import {Mediator} from 'Mediator';
//import {User} from 'User';
//const stage = new Comfort.Stage();
//const mediator = new Mediator();
/*mediator.setUsers([
   
]);*/
//export mediator;
define("ComfortZone/ComfortUserChoiceHistory", ["require", "exports"], function (require, exports) {
    "use strict";
    var ComfortUserChoiceHistory = (function () {
        function ComfortUserChoiceHistory() {
        }
        return ComfortUserChoiceHistory;
    }());
    exports.ComfortUserChoiceHistory = ComfortUserChoiceHistory;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL1NoYXJlZC9DYWNoZS50cyIsIi4uL1NoYXJlZC9Vc2VyLnRzIiwiLi4vU2hhcmVkL1VzZXJDb25zdHJ1Y3Rvci50cyIsIi4uL1NoYXJlZC9Vc2Vycy50cyIsIi4uL1NoYXJlZC9Ccm93c2VyUmVwby50cyIsIi4uL1NoYXJlZC9Ccm93c2VyVXNlcnMudHMiLCIuLi9TaGFyZWQvSW5NZW1vcnlCcm93c2VyVXNlcnMudHMiLCJDb21mb3J0VXNlckNob2ljZS50cyIsIi4uL1NoYXJlZC9CcmVhZGNydW1iLnRzIiwiLi4vU2hhcmVkL0JyZWFkY3J1bWJDb250cm9sLnRzIiwiLi4vU2hhcmVkL1RpbWVkLnRzIiwiLi4vU2hhcmVkL0Zvcm1Vc2VyQ2hvaWNlLnRzIiwiQ29tZm9ydFpvbmVzLnRzIiwiLi4vU2hhcmVkL1BvbGFyLnRzIiwiLi4vU2hhcmVkL1BvaW50LnRzIiwiR3JhcGhDb21mb3J0QmFzZS50cyIsIi4uL1NoYXJlZC9TVkcudHMiLCJHcmFwaENvbWZvcnRFbnRyeS50cyIsIkdyYXBoQ29tZm9ydEhpc3RvcnkudHMiLCJNZWRpYXRvci50cyIsImNvbWZvcnQudHMiLCJDb21mb3J0VXNlckNob2ljZUhpc3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQVlBO1FBR0k7WUFDSSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBRUQsNkJBQU0sR0FBTixVQUFPLElBQXFCO1lBQ3hCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFD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QSxBQUdDLElBQUE7SUFIWSw0REFBd0IiLCJmaWxlIjoianMvY29tcGlsZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIElJbmRleGFibGVPYmplY3Qge1xuICAgIGlkOnN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQ2FjaGU8VD4ge1xuICAgIHVwZGF0ZShpdGVtOlQpIDogVGhlbmFibGU8VFtdPjtcbiAgICBhZGQoaXRlbTpUKSA6IFRoZW5hYmxlPFRbXT47XG4gICAgZ2V0KCkgOiBUaGVuYWJsZTxUW10+O1xuICAgIGdldEJ5SWQoaWQ6c3RyaW5nKSA6IFRoZW5hYmxlPFQ+O1xuICAgIHNldChpdGVtczpUW10pIDogVGhlbmFibGU8VFtdPjtcbn1cblxuZXhwb3J0IGNsYXNzIEdlbmVyaWNDYWNoZSBpbXBsZW1lbnRzIElDYWNoZTxJSW5kZXhhYmxlT2JqZWN0PiB7XG4gICAgc3RvcmU6SUluZGV4YWJsZU9iamVjdFtdO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0b3JlID0gW107XG4gICAgfVxuICAgIFxuICAgIHVwZGF0ZShpdGVtOklJbmRleGFibGVPYmplY3QpIDogVGhlbmFibGU8SUluZGV4YWJsZU9iamVjdFtdPiB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdG9yZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IHRoaXMuc3RvcmVbaV0uaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlW2ldID0gaXRlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuc3RvcmUpO1xuICAgIH1cblxuICAgIGFkZChpdGVtOklJbmRleGFibGVPYmplY3QpIDogVGhlbmFibGU8SUluZGV4YWJsZU9iamVjdFtdPiB7XG4gICAgICAgIHRoaXMuc3RvcmUucHVzaChpdGVtKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0b3JlKTtcbiAgICB9XG5cbiAgICBnZXQoKSA6IFRoZW5hYmxlPElJbmRleGFibGVPYmplY3RbXT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuc3RvcmUpO1xuICAgIH1cbiAgICBcbiAgICBnZXRCeUlkKGlkOnN0cmluZykgOiBUaGVuYWJsZTxJSW5kZXhhYmxlT2JqZWN0PiB7XG4gICAgICAgIGNvbnN0IHN0b3JlID0gdGhpcy5zdG9yZS5maWx0ZXIoZnVuY3Rpb24oeDpJSW5kZXhhYmxlT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4geC5pZCA9PT0gaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZihzdG9yZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoc3RvcmVbMF0pO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IEVycm9yKFwiQ2Fubm90IGZpbmQgaXRlbSBieSBJRDogXCIgKyBpZCk7XG4gICAgfVxuICAgIFxuICAgIHNldChpdGVtczpJSW5kZXhhYmxlT2JqZWN0W10pIDogVGhlbmFibGU8SUluZGV4YWJsZU9iamVjdFtdPiB7XG4gICAgICAgIHRoaXMuc3RvcmUgPSBpdGVtcztcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0b3JlKTs7XG4gICAgfVxufSIsImltcG9ydCB7SUluZGV4YWJsZU9iamVjdH0gZnJvbSAnLi9DYWNoZSc7XG5leHBvcnQgY2xhc3MgVXNlciBpbXBsZW1lbnRzIElJbmRleGFibGVPYmplY3Qge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBpZDogc3RyaW5nO1xuICAgIHZvdGVkOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKG5hbWU6c3RyaW5nLCBpZDpzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnZvdGVkID0gZmFsc2U7XG4gICAgfVxufSIsImltcG9ydCB7VXNlcn0gZnJvbSAnLi9Vc2VyJztcblxuZXhwb3J0IGNsYXNzIFVzZXJDb25zdHJ1Y3RvciB7XG4gICAgc3RhdGljIG5vdEVtcHR5KGlucHV0KSB7XG4gICAgICAgIHJldHVybiAoaW5wdXQgIT09IFwiXCIpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlVXNlcnNCeU5hbWVzKG5hbWVzOkFycmF5PHN0cmluZz4pIDogVXNlcltdIHtcbiAgICAgICAgY29uc3QgZmlsdGVyZWQgPSBuYW1lcy5maWx0ZXIoVXNlckNvbnN0cnVjdG9yLm5vdEVtcHR5KTtcbiAgICAgICAgY29uc3QgdXNlcnMgPSBmaWx0ZXJlZC5tYXAoKHYsIGkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVVzZXIodixpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB1c2VyczsgXG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGVVc2VyKG5hbWU6c3RyaW5nLCBpbmRleDpudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVc2VyKG5hbWUsIFwidXNlclwiK2luZGV4KTtcbiAgICB9XG59IiwiaW1wb3J0IHtVc2VyfSBmcm9tICcuL1VzZXInO1xuaW1wb3J0IHtHZW5lcmljQ2FjaGV9IGZyb20gJy4vQ2FjaGUnO1xuaW1wb3J0IHtJVXNlclJlcG99IGZyb20gJy4vSVVzZXJzJztcbmltcG9ydCB7VXNlckNvbnN0cnVjdG9yfSBmcm9tICcuL1VzZXJDb25zdHJ1Y3Rvcic7XG5cbmV4cG9ydCBjbGFzcyBJbk1lbW9yeVVzZXJzIGltcGxlbWVudHMgSVVzZXJSZXBvIHtcbiAgICBjYWNoZSA6IEdlbmVyaWNDYWNoZTtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jYWNoZSA9IG5ldyBHZW5lcmljQ2FjaGUoKTtcbiAgICAgICAgdmFyIHVzZXJzID0gVXNlckNvbnN0cnVjdG9yLmNyZWF0ZVVzZXJzQnlOYW1lcyhbXG4gICAgICAgICAgICBcIkFkYW0gSGFsbFwiLFxuICAgICAgICAgICAgXCJCaWxsaWUgRGF2ZXlcIixcbiAgICAgICAgICAgIFwiTGF1cmEgUm93ZVwiLFxuICAgICAgICAgICAgXCJTaW1vbiBEYXdzb25cIlxuICAgICAgICBdKTsgXG4gICAgICAgIHRoaXMuc2V0VXNlcnModXNlcnMpO1xuICAgIH1cblxuICAgIFxuXG4gICAgYWRkVXNlcih1c2VyOlVzZXIpIDogVGhlbmFibGU8VXNlcltdPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlLmFkZCh1c2VyKTtcbiAgICB9XG4gICAgXG4gICAgYWRkVXNlckJ5TmFtZShuYW1lOnN0cmluZykgOiBUaGVuYWJsZTxVc2VyW10+IHsvL0Rvbid0IHdhbnQgdGhpcz9cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGUuYWRkKFVzZXJDb25zdHJ1Y3Rvci5jcmVhdGVVc2VyKG5hbWUsIDkpKTtcbiAgICB9XG5cbiAgICB1cGRhdGVVc2VyKHVzZXI6VXNlcikgOiBUaGVuYWJsZTxVc2VyW10+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGUudXBkYXRlKHVzZXIpO1xuICAgIH1cbiAgICBcblxuICAgIGdldFVzZXJzKCkgOiBUaGVuYWJsZTxBcnJheTxVc2VyPj4gIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0KCk7XG4gICAgfVxuXG4gICAgZ2V0VXNlcihpZDpzdHJpbmcpIDogVGhlbmFibGU8VXNlcj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXRCeUlkKGlkKTtcbiAgICB9XG5cbiAgICBzYXZlVXNlcih1c2VyOlVzZXIpIDogVGhlbmFibGU8VXNlcltdPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlLnVwZGF0ZSh1c2VyKTtcbiAgICB9XG5cbiAgICBzZXRVc2Vycyh1c2VyczpVc2VyW10pIDogVGhlbmFibGU8VXNlcltdPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlLnNldCh1c2Vycyk7XG4gICAgfVxuXG4gICAgXG59IiwiaW1wb3J0IHtJQWxsUmVwb3N0aW9yeX0gZnJvbSAnLi9JVXNlcnMnO1xuXG5leHBvcnQgY2xhc3MgQnJvd3NlclJlcG88VD4gaW1wbGVtZW50cyBJQWxsUmVwb3N0aW9yeTxUPiB7XG4gICAga2V5IDogc3RyaW5nO1xuICAgIGJyIDogV2luZG93O1xuICAgIGNvbnN0cnVjdG9yIChrZXk6c3RyaW5nLCB3aW5kb3c6V2luZG93KSB7XG4gICAgICAgIHRoaXMuYnIgPSB3aW5kb3c7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIH1cbiAgICBnZXQoKSA6IFRoZW5hYmxlPFQ+IHtcbiAgICAgICAgY29uc3QgdGV4dCA6IHN0cmluZyA9IHRoaXMuYnIubG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5rZXkpO1xuICAgICAgICBjb25zdCBqc29uIDogVCA9IEpTT04ucGFyc2UodGV4dCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoanNvbik7XG4gICAgfVxuICAgIHNhdmUodGhpbmc6VCkgOiAgVGhlbmFibGU8VD57XG4gICAgICAgIGNvbnN0IHRleHQgPSBKU09OLnN0cmluZ2lmeSh0aGluZyk7XG4gICAgICAgIHRoaXMuYnIubG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5rZXksIHRleHQpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaW5nKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQge1VzZXJ9IGZyb20gJy4vVXNlcic7XG5pbXBvcnQge0Jyb3dzZXJSZXBvfSBmcm9tICcuL0Jyb3dzZXJSZXBvJztcbmltcG9ydCB7SUFsbFJlcG9zdGlvcnksIElBbGxVc2VyUmVwb3N0aW9yeX0gZnJvbSAnLi9JVXNlcnMnO1xuXG5cbmV4cG9ydCBjbGFzcyBCcm93c2VyVXNlcnMgaW1wbGVtZW50cyBJQWxsVXNlclJlcG9zdGlvcnkge1xuICAgIHJlcG8gOiBJQWxsUmVwb3N0aW9yeTxVc2VyW10+O1xuICAgIGNvbnN0cnVjdG9yKHdpbmRvdzpXaW5kb3cpIHtcbiAgICAgICAgdGhpcy5yZXBvID0gbmV3IEJyb3dzZXJSZXBvPFVzZXJbXT4oXCJ1c2Vyc1wiLCB3aW5kb3cpO1xuICAgIH1cblxuICAgIGdldFVzZXJzKCkgOiBUaGVuYWJsZTxVc2VyW10+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwby5nZXQoKTtcbiAgICB9XG5cbiAgICBzYXZlVXNlcnModXNlcnM6VXNlcltdKSA6ICBUaGVuYWJsZTxVc2VyW10+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwby5zYXZlKHVzZXJzKTtcbiAgICB9IFxufSIsIlxuaW1wb3J0IHtVc2VyfSBmcm9tICcuL1VzZXInO1xuaW1wb3J0IHtJbk1lbW9yeVVzZXJzfSBmcm9tICcuL1VzZXJzJztcbmltcG9ydCB7QnJvd3NlclVzZXJzfSBmcm9tICcuL0Jyb3dzZXJVc2Vycyc7XG5pbXBvcnQge0lBbGxVc2VyUmVwb3N0aW9yeSwgSVVzZXJSZXBvfSBmcm9tICcuL0lVc2Vycyc7XG5cbmV4cG9ydCBjbGFzcyBJbk1lbW9yeUJyb3dzZXJVc2VycyBpbXBsZW1lbnRzIElVc2VyUmVwbyAge1xuICAgIGNhY2hlOkluTWVtb3J5VXNlcnM7XG4gICAgcmVwbzpJQWxsVXNlclJlcG9zdGlvcnk7XG4gICAgY29uc3RydWN0b3Iod2luZG93OldpbmRvdykge1xuICAgICAgICB0aGlzLmNhY2hlID0gbmV3IEluTWVtb3J5VXNlcnMoKTtcbiAgICAgICAgdGhpcy5yZXBvID0gbmV3IEJyb3dzZXJVc2Vycyh3aW5kb3cpO1xuICAgIH1cbiAgICB1cGRhdGVVc2VyKHVzZXI6VXNlcikgOiBUaGVuYWJsZTxVc2VyW10+IHtcbiAgICAgICAgY29uc3QgcHJvbSA9IHRoaXMuY2FjaGUudXBkYXRlVXNlcih1c2VyKTtcbiAgICAgICAgcHJvbS50aGVuKHVzZXJzID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVwby5zYXZlVXNlcnModXNlcnMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb207XG4gICAgfVxuICAgIGFkZFVzZXIodXNlcjpVc2VyKSA6IFRoZW5hYmxlPFVzZXJbXT4ge1xuICAgICAgICBjb25zdCBwcm9tID0gdGhpcy5jYWNoZS5hZGRVc2VyKHVzZXIpO1xuICAgICAgICBwcm9tLnRoZW4odXNlcnMgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXBvLnNhdmVVc2Vycyh1c2Vycyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbTtcbiAgICB9XG4gICAgZ2V0VXNlcnMoKSA6IFRoZW5hYmxlPFVzZXJbXT4ge1xuICAgICAgICBjb25zdCBwcm9tID0gdGhpcy5yZXBvLmdldFVzZXJzKCk7XG4gICAgICAgIHByb20udGhlbih1c2VycyA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlLnNldFVzZXJzKHVzZXJzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9tO1xuICAgIH1cbiAgICBnZXRVc2VyKGlkOnN0cmluZykgOiBUaGVuYWJsZTxVc2VyPiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuY2FjaGUuZ2V0VXNlcihpZCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICB9XG4gICAgc2V0VXNlcnModXNlcnM6VXNlcltdKSA6IFRoZW5hYmxlPFVzZXJbXT4ge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcHJvbUNhY2hlID0gdGhpcy5jYWNoZS5zZXRVc2Vycyh1c2Vycyk7XG4gICAgICAgIGNvbnN0IHByb21SZXBvID0gdGhpcy5yZXBvLnNhdmVVc2Vycyh1c2Vycyk7XG4gICAgICAgIHJldHVybiBwcm9tQ2FjaGU7XG4gICAgfVxufSIsImltcG9ydCB7VXNlcn0gZnJvbSAnLi4vU2hhcmVkL1VzZXInO1xuXG5leHBvcnQgY2xhc3MgQ29tZm9ydFVzZXJDaG9pY2Uge1xuICAgIHVzZXIgOiBVc2VyO1xuICAgIGRpc3RhbmNlIDogbnVtYmVyO1xuICAgIGFyZWEgOiBTdHJpbmc7XG4gICAgY29uc3RydWN0b3IodXNlciA6IFVzZXIsIGRpc3RhbmNlIDogbnVtYmVyLCBhcmVhIDogU3RyaW5nKSB7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICAgICAgdGhpcy5hcmVhID0gYXJlYTtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIEJyZWFkY3J1bWIge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBjb21tYW5kOiBzdHJpbmc7XG4gICAgcGFyYW1zOiBhbnk7XG4gICAgZW5hYmxlZDogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3RvcihuYW1lOnN0cmluZywgY29tbWFuZDpzdHJpbmcsIHBhcmFtczphbnkpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gY29tbWFuZDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cbn0iLCJcbmltcG9ydCB7QnJlYWRjcnVtYn0gZnJvbSAnLi9CcmVhZGNydW1iJztcbmV4cG9ydCBjbGFzcyBCcmVhZGNydW1iQ29udHJvbCB7XG4gICAgaXRlbXMgPSBuZXcgQXJyYXk8QnJlYWRjcnVtYj4oKTtcbiAgICBwdWJsaWMgYWRkQnJlYWRjcnVtYihuYW1lOnN0cmluZywgY29tbWFuZDpzdHJpbmcsIHBhcmFtczphbnkpIHtcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKG5ldyBCcmVhZGNydW1iKG5hbWUsIGNvbW1hbmQsIHBhcmFtcykpO1xuICAgIH1cbn0iLCJcbiAgICAgICAgXG5leHBvcnQgY2xhc3MgVGltZWQge1xuICAgIHB1YmxpYyBzdGF0aWMgZm9yKG1pbGxpc2Vjb25kczpudW1iZXIpIDpUaGVuYWJsZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgcDogVGhlbmFibGU8TnVtYmVyPiA9IG5ldyBQcm9taXNlKChyZXNvbHZlKT0+e1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG1pbGxpc2Vjb25kcyk7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0sIG1pbGxpc2Vjb25kcyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG59IiwiaW1wb3J0IHtVc2VyfSBmcm9tICcuL1VzZXInO1xuaW1wb3J0IHtUaW1lZH0gZnJvbSAnLi9UaW1lZCc7XG5pbXBvcnQge0lVc2VyUmVwbywgSW5NZW1vcnlVc2Vyc30gZnJvbSAnLi9Vc2Vycyc7XG5cbmV4cG9ydCBjbGFzcyBGb3JtVXNlckNob2ljZSB7XG4gICAgdXNlclpvbmUgOiBIVE1MRWxlbWVudDtcbiAgICB1c2VyUmVwbyA6IElVc2VyUmVwbztcbiAgICBkM1VzZXJzIDogZDMuU2VsZWN0aW9uPGFueT47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy51c2VyUmVwbyA9IG5ldyBJbk1lbW9yeVVzZXJzKCk7IC8vREkgdGhpc1xuICAgICAgICB0aGlzLnVzZXJab25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJzJyk7XG4gICAgICAgIHRoaXMuZDNVc2VycyA9IGQzLnNlbGVjdChcImcjdXNlcnNcIik7XG4gICAgICAgIHRoaXMudXNlclJlcG8uZ2V0VXNlcnMoKS50aGVuKCh1c2VycykgPT4ge1xuICAgICAgICAgICAgaWYodXNlcnMgJiYgdXNlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cFVzZXJzKHVzZXJzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRVc2VyKGlkKSA6IFRoZW5hYmxlPFVzZXI+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlclJlcG8uZ2V0VXNlcihpZCk7XG4gICAgfVxuXG4gICAgcHVibGljIG1hcmtVc2VyRG9uZSAodXNlcjpVc2VyKSB7XG4gICAgICAgIHVzZXIudm90ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnVzZXJSZXBvLnVwZGF0ZVVzZXIodXNlcikudGhlbih1c2VycyA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlYmluZCh1c2Vycyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWZ0ZXJTaG93KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVORFNIT1cgVXNlckNob2NpZUZvcm1cIik7XG4gICAgICAgIHRoaXMuZDNVc2Vyc1xuICAgICAgICAgICAgLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgICAgICAgIC5vbihcIm1vdXNldXBcIiwgdGhpcy5jbGlja1VzZXIoKSk7XG4gICAgfVxuICAgIHB1YmxpYyBoYXNNb3JlVXNlcnMoKSA6IFRoZW5hYmxlPGJvb2xlYW4+IHsgLy9Nb3ZlIHRvIHVzZXIgcmVwbz9cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXNlclJlcG8uZ2V0VXNlcnMoKS50aGVuKHVzZXJzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB1bnZvdGVkVXNlcnMgPSB1c2Vycy5maWx0ZXIoZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIXgudm90ZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZih1bnZvdGVkVXNlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG4gICAgcHVibGljIHNob3coKTpUaGVuYWJsZTxudW1iZXI+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTSE9XIFVzZXJDaG9jaWVGb3JtXCIpO1xuICAgICAgICBkMy5zZWxlY3QodGhpcy51c2VyWm9uZSlcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDgwMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwxKVxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJtYXRyaXgoMSwwLDAsMSwwLDApXCIpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kM1VzZXJzLnNlbGVjdEFsbChcImdcIikuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZihlLnZvdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcInVzZXItZ3JvdXAtY29tcGxldGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ1c2VyLWdyb3VwXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gVGltZWQuZm9yKDgwMCkudGhlbih0aGlzLmFmdGVyU2hvdy5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgcHVibGljIGhpZGUgKCk6VGhlbmFibGU8bnVtYmVyPiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSElERSB1c2VyRW50cnlcIik7XG4gICAgICAgIGQzLnNlbGVjdCh0aGlzLnVzZXJab25lKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gODAwO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLDApXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcIm1hdHJpeCgyLDAsMCwyLC00MDAsLTkwKVwiKTtcbiAgICAgICAgZDMuc2VsZWN0KFwiZyN1c2Vyc1wiKVxuICAgICAgICAgICAgLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgICAgICAgIC5vbihcIm1vdXNldXBcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTk9DTElDSyBVc2VyIC0gVGhpcyB3YXMgY2xpY2tlZCwgYnV0IGlnbm9yZWRcIiwgdGhpcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFRpbWVkLmZvcig4MDApO1xuICAgICAgICBcbiAgICB9XG4gICAgcHJpdmF0ZSByZWJpbmQodXNlcnM6VXNlcltdKTogZDMuc2VsZWN0aW9uLlVwZGF0ZTxVc2VyPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmQzVXNlcnNcbiAgICAgICAgICAgICAgICAuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgLmRhdGEodXNlcnMpO1xuICAgIH1cbiAgICBwcml2YXRlIGNsaWNrVXNlciAoKSB7XG4gICAgICAgIC8vICd0aGF0JyBpcyB0aGUgaW5zdGFuY2Ugb2YgZ3JhcGggXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZDpVc2VyLCBpOm51bWJlcikge1xuICAgICAgICAgICAgLy8gJ3RoaXMnIGlzIHRoZSBET00gZWxlbWVudCBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ0xJQ0sgLSBVc2VyIC0gdXAgIFVzZXJDaG9jaWVGb3JtXCIpO1xuICAgICAgICAgICAgLy9jb25zdCBuYW1lID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLW5hbWVcIik7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcblxuICAgICAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdzZWxlY3RVc2VyJywgeyBcImRldGFpbFwiOiB7XCJpZFwiOiBpZH0gfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhpcyB3YXMgY2xpY2tlZFwiLCB0aGF0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIG92ZXJVc2VyICgpIHtcbiAgICAgICAgLy8gJ3RoYXQnIGlzIHRoZSBpbnN0YW5jZSBvZiBncmFwaCBcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkOlVzZXIsIGk6bnVtYmVyKSB7XG4gICAgICAgICAgICAvLyAndGhpcycgaXMgdGhlIERPTSBlbGVtZW50IFxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSlcbiAgICAgICAgICAgIC8vY29uc3QgZDN6b25lcyA9IGQzLnNlbGVjdChcImcjdXNlcnNcIilcbiAgICAgICAgICAgICAgICAuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oMjUwKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIiMwMEQ3RkVcIjsgIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgbGVhdmVVc2VyKCkge1xuICAgICAgICAvLyAndGhhdCcgaXMgdGhlIGluc3RhbmNlIG9mIGdyYXBoIFxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGQ6VXNlciwgaTpudW1iZXIpIHtcbiAgICAgICAgICAgIC8vICd0aGlzJyBpcyB0aGUgRE9NIGVsZW1lbnQgXG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlKVxuICAgICAgICAgICAgLy9jb25zdCBkM3pvbmVzID0gZDMuc2VsZWN0KFwiZyN1c2Vyc1wiKVxuICAgICAgICAgICAgICAgIC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI1MDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImdyZXlcIjsgICAgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBlYWNoVXNlciAoKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSwgaSkge1xuICAgICAgICAgICAgLy9FdmVudC5hZGQoWydtb3VzZWRvd24nXSwgdGhpcy5zdGFnZSwgdGhpcy5jaG9vc2VVc2VyKTtcbiAgICAgICAgICAgIC8vRXZlbnQuYWRkKFtcIm1vdXNlb3ZlclwiXSwgdGhpcywgdGhpc1N0YWdlLmNoZWNrT3ZlclVzZXJzKTtcbiAgICAgICAgICAgIGNvbnN0IGQzSXRlbSA9IGQzLnNlbGVjdCh0aGlzKTtcblxuICAgICAgICAgICAgZDNJdGVtLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gNjAgKyAoaSAqIDkwKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgODAwKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDkwKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZGF0YS1uYW1lXCIsIGUubmFtZSlcbiAgICAgICAgICAgICAgICAuYXR0cihcImRhdGEtaWRcIiwgZS5pZClcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgdGhhdC5vdmVyVXNlcigpKVxuICAgICAgICAgICAgICAgIC5vbihcIm1vdXNlbGVhdmVcIiwgdGhhdC5sZWF2ZVVzZXIoKSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGQzSXRlbS5hcHBlbmQoXCJ0ZXh0XCIpICAgICAgXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInVzZXJuYW1lXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDMwICsgKChpICsgMSkgKiA5MCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgNjApXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkYXRhLW5hbWVcIiwgZS5uYW1lKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCA2MClcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LWZhbWlseVwiLCBcIlNoYXJlIFRlY2ggTW9ub1wiKVxuICAgICAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKGopIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUubmFtZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgYWRkVXNlcih1c2VyOlVzZXIpIHtcbiAgICAgICAgdGhpcy51c2VyUmVwby5hZGRVc2VyKHVzZXIpLnRoZW4odXNlcnMgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXR1cFVzZXJzKHVzZXJzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXRVc2Vycyh1c2VyczpBcnJheTxVc2VyPikge1xuICAgICAgICB0aGlzLmRlc3Ryb3lVc2VycygpO1xuICAgICAgICB0aGlzLnVzZXJSZXBvLnNldFVzZXJzKHVzZXJzKS50aGVuKCh1c2VycykgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXR1cFVzZXJzKHVzZXJzKTtcbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHJpdmF0ZSBkZXN0cm95VXNlcnMoKSB7XG4gICAgICAgIGQzLnNlbGVjdChcImcjdXNlcnNcIikuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldHVwVXNlcnMgKHVzZXJzOlVzZXJbXSkge1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMucmViaW5kKHVzZXJzKTtcbiAgICAgICAgaXRlbXMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUuaWQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVhY2godGhpcy5lYWNoVXNlcigpKTtcbiAgICB9XG5cbiAgICBcbn0iLCJcbmV4cG9ydCBjbGFzcyBDb21mb3J0Wm9uZXMge1xuICAgIG5hbWUgOiBzdHJpbmc7XG4gICAgcmFkaXVzOiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCByYWRpdXM6IG51bWJlcikge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1czsgXG4gICAgfVxufSIsIlxuXG5leHBvcnQgY2xhc3MgUG9sYXIge1xuICAgIHJhZGl1czpudW1iZXI7XG4gICAgYW5nbGU6bnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKHJhZGl1czpudW1iZXIsIGFuZ2xlOm51bWJlcikge1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICAgICAgdGhpcy5hbmdsZSA9IGFuZ2xlO1xuICAgIH1cbn1cbiIsIi8vaW1wb3J0IFBvbGFyID0gcmVxdWlyZSgnUG9sYXInKTtcblxuaW1wb3J0IHtQb2xhcn0gZnJvbSAnLi9Qb2xhcic7XG5leHBvcnQgY2xhc3MgUG9pbnQge1xuICAgIHggOiBudW1iZXI7XG4gICAgeSA6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHg6bnVtYmVyLCB5Om51bWJlcikge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbUNvb3Jkcyhjb29yZHM6QXJyYXk8bnVtYmVyPikge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KGNvb3Jkc1swXSxjb29yZHNbMV0pO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGZyb21PZmZzZXQocG9pbnQ6UG9pbnQsIG9yaWdpbjpQb2ludCk6UG9pbnQge1xuICAgICAgICBjb25zdCBkeCA9IHBvaW50LnggLSBvcmlnaW4ueDtcbiAgICAgICAgY29uc3QgZHkgPSBwb2ludC55IC0gb3JpZ2luLnk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoZHgsZHkpO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIHRvT2Zmc2V0KHBvaW50OlBvaW50LCBvcmlnaW46UG9pbnQpOlBvaW50IHtcbiAgICAgICAgY29uc3QgZHggPSBwb2ludC54ICsgb3JpZ2luLng7XG4gICAgICAgIGNvbnN0IGR5ID0gcG9pbnQueSArIG9yaWdpbi55O1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KGR4LGR5KTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBkaXN0YW5jZShwb2ludDpQb2ludCAsIG9yaWdpbjpQb2ludCk6bnVtYmVyIHtcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gUG9pbnQuZnJvbU9mZnNldChwb2ludCwgb3JpZ2luKTtcbiAgICAgICAgcmV0dXJuIFBvaW50LmRpc3RhbmNlRnJvbU9mZnNldChvZmZzZXQpO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlRnJvbU9mZnNldChvZmZzZXQ6UG9pbnQpOm51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQob2Zmc2V0LnggKiBvZmZzZXQueCArIG9mZnNldC55ICogb2Zmc2V0LnkpO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIHRvQ2FydGVzaWFuTm9PZmZzZXQocG9sYXI6UG9sYXIpOlBvaW50IHtcbiAgICAgICAgY29uc3QgeCA9IHBvbGFyLnJhZGl1cyAqIE1hdGguY29zKHBvbGFyLmFuZ2xlKTtcbiAgICAgICAgY29uc3QgeSA9IHBvbGFyLnJhZGl1cyAqIE1hdGguc2luKHBvbGFyLmFuZ2xlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh4LCB5KTsgXG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgdG9DYXJ0ZXNpYW4ocG9sYXI6UG9sYXIsb3JpZ2luOlBvaW50KTpQb2ludCB7XG4gICAgICAgIGNvbnN0IHBvaW50ID0gUG9pbnQudG9DYXJ0ZXNpYW5Ob09mZnNldChwb2xhcik7XG4gICAgICAgIHJldHVybiBQb2ludC50b09mZnNldChwb2ludCxvcmlnaW4pOyBcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyB0b1BvbGFyKHBvaW50OlBvaW50LCBvcmlnaW46UG9pbnQpOlBvbGFyIHtcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gUG9pbnQuZnJvbU9mZnNldChwb2ludCwgb3JpZ2luKTtcbiAgICAgICAgY29uc3QgcmFkaXVzID0gUG9pbnQuZGlzdGFuY2VGcm9tT2Zmc2V0KG9mZnNldCk7XG4gICAgICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5hdGFuMihvZmZzZXQueSwgb2Zmc2V0LngpO1xuICAgICAgICByZXR1cm4gbmV3IFBvbGFyKHJhZGl1cywgYW5nbGUpO1xuICAgIH1cbn1cbi8vfSk7XG4iLCJpbXBvcnQge1RpbWVkfSBmcm9tICcuLi9TaGFyZWQvVGltZWQnO1xuaW1wb3J0IHtDb21mb3J0Wm9uZXN9IGZyb20gJy4vQ29tZm9ydFpvbmVzJztcbmltcG9ydCB7UG9pbnR9IGZyb20gJy4uL1NoYXJlZC9Qb2ludCc7XG5cblxuZXhwb3J0IGNsYXNzIEdyYXBoQ29tZm9ydEJhc2Uge1xuICAgIGNoYW9zIDogSFRNTEVsZW1lbnQ7XG4gICAgc3RyZXRjaCA6IEhUTUxFbGVtZW50O1xuICAgIGNvbWZvcnQgOiBIVE1MRWxlbWVudDtcbiAgICBjZW50ZXJQb2ludCA6IFBvaW50O1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnNldHVwQXJlYSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBBcmVhICgpIHtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBjb25zdCB6b25lcyA9IFtuZXcgQ29tZm9ydFpvbmVzKFwic3RyZXRjaFwiLDMwMCksIG5ldyBDb21mb3J0Wm9uZXMoXCJjb21mb3J0XCIsMTAwKV07XG4gICAgICAgIGNvbnN0IGQzem9uZXMgPSBkMy5zZWxlY3QoXCJnI3pvbmVzXCIpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuZGF0YSh6b25lcyk7XG5cbiAgICAgICAgZDN6b25lcy5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCA0MDApXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCA0MDApXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIDApXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImFyZWFcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImlkXCIsIGZ1bmN0aW9uKGQ6Q29tZm9ydFpvbmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLm5hbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG5cbiAgICAgICAgdGhpcy5jaGFvcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFvcycpO1xuICAgICAgICB0aGlzLnN0cmV0Y2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RyZXRjaCcpO1xuICAgICAgICB0aGlzLmNvbWZvcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29tZm9ydCcpO1xuICAgICAgICBjb25zdCBjZW50ZXJYID0gTnVtYmVyKHRoaXMuY29tZm9ydC5nZXRBdHRyaWJ1dGUoJ2N4JykpO1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gTnVtYmVyKHRoaXMuY29tZm9ydC5nZXRBdHRyaWJ1dGUoJ2N5JykpO1xuICAgICAgICB0aGlzLmNlbnRlclBvaW50ID0gbmV3IFBvaW50KGNlbnRlclgsY2VudGVyWSk7XG4gICAgICAgIFxuXG4gICAgfVxuICAgIHB1YmxpYyBoaWRlKCk6VGhlbmFibGU8bnVtYmVyPiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSElERSBjb21mb3J0R1JBUEhcIik7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkM3pvbmVzID0gZDMuc2VsZWN0KFwiZyN6b25lc1wiKSAgICBcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIDApO1xuXG4gICAgICAgIGNvbnN0IGQzZHJvcHMgPSBkMy5zZWxlY3QoXCIjc3RhZ2VcIilcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCJjaXJjbGUuZHJvcHBlclwiKSAgIFxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kZWxheSgyNTApXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDI1MClcbiAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgMCk7XG4gICAgICAgIHJldHVybiBUaW1lZC5mb3IoMTAwMCk7XG4gICAgICAgICAgICAgICAgXG4gICAgfVxuICAgIHB1YmxpYyBzaG93QmFzZSgpOlRoZW5hYmxlPG51bWJlcj4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNIT1cgZ3JhcGhcIik7XG4gICAgICAgIGNvbnN0IGQzem9uZXMgPSBkMy5zZWxlY3QoXCJnI3pvbmVzXCIpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIDApXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgLmRlbGF5KGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuIGkgKiAxMDA7IH0pXG4gICAgICAgICAgICAgICAgLmVhc2UoXCJlbGFzdGljXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIGZ1bmN0aW9uKGQ6Q29tZm9ydFpvbmVzKSB7IFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5yYWRpdXM7IFxuICAgICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBUaW1lZC5mb3IoMTAwMCk7XG4gICAgICAgIFxuICAgIH1cblxufSIsIlxuZXhwb3J0IGNsYXNzIFNWRyB7XG4gICAgc3RhdGljIGVsZW1lbnQodGFnTmFtZSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgdGFnTmFtZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNpcmNsZShyLCB4LCB5LCBjbGFzc05hbWUpIHtcbiAgICAgICAgY29uc3QgZWwgPSBTVkcuZWxlbWVudChcImNpcmNsZVwiKTtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiclwiLCByKTtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiY3hcIiwgeCk7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImN5XCIsIHkpO1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjbGFzc05hbWUpO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIC8vPGNpcmNsZSBpZD1cInN0cmV0Y2hcIiByPVwiMzAwXCIgY3g9XCI0MDBcIiBjeT1cIjQwMFwiIC8+XG5cbiAgICB9XG59IiwiaW1wb3J0IHtVc2VyfSBmcm9tICcuLi9TaGFyZWQvVXNlcic7XG5pbXBvcnQge0dyYXBoQ29tZm9ydEJhc2V9IGZyb20gJy4vR3JhcGhDb21mb3J0QmFzZSc7XG5pbXBvcnQge1BvaW50fSBmcm9tICcuLi9TaGFyZWQvUG9pbnQnO1xuaW1wb3J0IHtTVkd9IGZyb20gJy4uL1NoYXJlZC9TVkcnO1xuXG5leHBvcnQgY2xhc3MgR3JhcGhDb21mb3J0RW50cnkgZXh0ZW5kcyBHcmFwaENvbWZvcnRCYXNlIHtcbiAgICBjbGlja0FyZWEgOiBIVE1MRWxlbWVudDtcbiAgICBjdXJyZW50VXNlcjpVc2VyO1xuICAgIGRyb3BwZXIgOiBTVkdBRWxlbWVudDtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jbGlja0FyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xpY2thYmxlJyk7XG4gICAgICAgIHRoaXMuc2V0dXBPdmVyQWN0aXZpdHkoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0dXBPdmVyQWN0aXZpdHkgKCkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgZDMuc2VsZWN0KFwiI3N0YWdlXCIpLm9uKFwibW91c2Vtb3ZlXCIsIHRoaXMuZ3JhcGhNb3ZlKCkpOy8vdGhpcy5jaGVja0FyZWEpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBDbGlja0FjdGl2aXR5ICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTRVRVUCBncmFwaCBjbGlja1wiKTtcbiAgICAgICAgZDMuc2VsZWN0KFwiI3N0YWdlXCIpLm9uKFwibW91c2V1cFwiLCB0aGlzLmdyYXBoVXAoKSk7XG4gICAgICAgIGQzLnNlbGVjdChcIiNzdGFnZVwiKS5vbihcIm1vdXNlZG93blwiLCB0aGlzLmdyYXBoRG93bigpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdyYXBoTW92ZSgpIHtcbiAgICAgICAgLy8vICd0aGF0JyBpcyB0aGUgaW5zdGFuY2Ugb2YgZ3JhcGggXG4gICAgICAgIGNvbnN0IHRoYXQgOiBHcmFwaENvbWZvcnRFbnRyeSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkOnZvaWQsIGk6bnVtYmVyKSB7XG4gICAgICAgICAgICAvLyAndGhpcycgaXMgdGhlIERPTSBlbGVtZW50IFxuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBkMy5tb3VzZSh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gUG9pbnQuZGlzdGFuY2UodGhhdC5jZW50ZXJQb2ludCwgUG9pbnQuZnJvbUNvb3Jkcyhjb29yZCkpO1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IEdyYXBoQ29tZm9ydEVudHJ5LmNhbGN1bGF0ZURpc3RhbmNlKGRpc3RhbmNlKTtcbiAgICAgICAgICAgIHRoYXQuaGlnaGxpZ2h0KGFyZWEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBncmFwaFVwKCkge1xuICAgICAgICAvLyAndGhhdCcgaXMgdGhlIGluc3RhbmNlIG9mIGdyYXBoIFxuICAgICAgICBjb25zdCB0aGF0IDogR3JhcGhDb21mb3J0RW50cnkgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZDp2b2lkLCBpIDpudW1iZXIpIHtcbiAgICAgICAgICAgIC8vICd0aGlzJyBpcyB0aGUgRE9NIGVsZW1lbnQgXG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IFBvaW50LmZyb21Db29yZHMoZDMubW91c2UodGhpcykpO1xuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBQb2ludC5kaXN0YW5jZSh0aGF0LmNlbnRlclBvaW50LCBjb29yZCk7XG4gICAgICAgICAgICBjb25zdCBhcmVhID0gR3JhcGhDb21mb3J0RW50cnkuY2FsY3VsYXRlRGlzdGFuY2UoZGlzdGFuY2UpOyAgICAgICAgICBcbiAgICAgICAgICAgIHRoYXQuc2F2ZVRoZUludGVyYWN0aW9uKGFyZWEsIGRpc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ3JhcGhEb3duKCkge1xuICAgICAgICAvLyAndGhhdCcgaXMgdGhlIGluc3RhbmNlIG9mIGdyYXBoIFxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGQ6dm9pZCwgaTpudW1iZXIpIHtcbiAgICAgICAgICAgIC8vICd0aGlzJyBpcyB0aGUgRE9NIGVsZW1lbnQgXG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IFBvaW50LmZyb21Db29yZHMoZDMubW91c2UodGhpcykpO1xuICAgICAgICAgICAgY29uc3QgZWwgPSBTVkcuY2lyY2xlKDgsIGNvb3JkLngsIGNvb3JkLnksIFwiZHJvcHBlclwiKTtcbiAgICAgICAgICAgIHRoYXQuYWRkRHJvcHBlcihlbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaGlnaGxpZ2h0IChhcmVhIDogc3RyaW5nKSB7XG4gICAgICAgIC8vPGNpcmNsZSBpZD1cInN0cmV0Y2hcIiByPVwiMzAwXCIgY3g9XCI0MDBcIiBjeT1cIjQwMFwiIC8+XG4gICAgICAgIC8vPGNpcmNsZSBpZD1cImNvbWZvcnRcIiByPVwiMTAwXCIgY3g9XCI0MDBcIiBjeT1cIjQwMFwiIC8+XG5cbiAgICBcbiAgICAgICAgY29uc3QgZDN6b25lcyA9IGQzLnNlbGVjdChcInN2Z1wiKVxuICAgICAgICAgICAgLnNlbGVjdEFsbChcIi5hcmVhXCIpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmRlbGF5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSBhcmVhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTAwO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmVhc2UoXCJjdWJpY1wiKVxuICAgICAgICAgICAgICAgIC5kdXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI1MDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IGFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcInJnYigwLCAxODAsIDIxOSlcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIjMDBEN0ZFXCI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH1cbiAgICBcblxuICAgIHB1YmxpYyBhZGREcm9wcGVyIChlbCA6IFNWR0FFbGVtZW50KSAge1xuICAgICAgICB0aGlzLmRyb3BwZXIgPSBlbDtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YWdlJykuaW5zZXJ0QmVmb3JlKGVsLCB0aGlzLmNsaWNrQXJlYSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjYWxjdWxhdGVEaXN0YW5jZShkaXN0YW5jZSkge1xuICAgICAgICBpZihkaXN0YW5jZSA8IDEwMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiY29tZm9ydFwiO1xuICAgICAgICB9IGVsc2UgaWYgKGRpc3RhbmNlIDwgMzAwKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJzdHJldGNoXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJjaGFvc1wiO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgcmVtb3ZlSW50ZXJhY3Rpb25zICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSRU1PVkUgYWN0aXZpdGVpcyBmcm9tIEdyYXBoQ29tZm9ydEVudHJ5XCIpO1xuICAgICAgICBkMy5zZWxlY3QoXCIjc3RhZ2VcIikub24oXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVTkNMSUNLIC0gR3JhcGh1cCAtIE5vIGxvbmdlciBpbnRlcmFjdGl2ZSBzdGFnZVwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGQzLnNlbGVjdChcIiNzdGFnZVwiKS5vbihcIm1vdXNlZG93blwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVU5DTElDSyAtIEdyYXBoZG93biAtIE5vIGxvbmdlciBpbnRlcmFjdGl2ZSBzdGFnZVwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGQzLnNlbGVjdChcIiNzdGFnZVwiKS5vbihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVU5Nb3ZlIC0gbW91c2Vtb3ZlIC0gTm8gbG9uZ2VyIGludGVyYWN0aXZlIHN0YWdlXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfVxuICAgIHB1YmxpYyBzYXZlVGhlSW50ZXJhY3Rpb24gKGFyZWE6c3RyaW5nLCBkaXN0YW5jZTpudW1iZXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJzYXZlVGhlSW50ZXJhY3Rpb25cIik7XG4gICAgICAgIHRoaXMucmVtb3ZlSW50ZXJhY3Rpb25zKCk7XG5cbiAgICAgICAgLy9UT0RPOiBQdXQgaW4gdGhlIGxpbmUgYmVsb3dcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdzYXZlR3JhcGgnLCB7XG4gICAgICAgICAgICBcImRldGFpbFwiOiB7XG4gICAgICAgICAgICAgICAgXCJhcmVhXCI6YXJlYSxcbiAgICAgICAgICAgICAgICBcImRpc3RhbmNlXCI6ZGlzdGFuY2UsXG4gICAgICAgICAgICAgICAgXCJjdXJyZW50VXNlclwiOnRoaXMuY3VycmVudFVzZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAvL21lZGlhdG9yLnNhdmVHcmFwaCgpO1xuICAgIH1cbiAgICBwdWJsaWMgc2hvdyh1c2VyOlVzZXIpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgICAgIGNvbnN0IFRoZW5hYmxlID0gdGhpcy5zaG93QmFzZSgpO1xuICAgICAgICB0aGlzLnNldHVwT3ZlckFjdGl2aXR5KCk7XG4gICAgICAgIHJldHVybiBUaGVuYWJsZS50aGVuKHRoaXMuc2V0dXBDbGlja0FjdGl2aXR5LmJpbmQodGhpcykpO1xuICAgIH1cblxufSIsImltcG9ydCB7Q29tZm9ydFVzZXJDaG9pY2V9IGZyb20gJy4vQ29tZm9ydFVzZXJDaG9pY2UnO1xuaW1wb3J0IHtHcmFwaENvbWZvcnRCYXNlfSBmcm9tICcuL0dyYXBoQ29tZm9ydEJhc2UnO1xuaW1wb3J0IHtQb2ludH0gZnJvbSAnLi4vU2hhcmVkL1BvaW50JztcbmltcG9ydCB7UG9sYXJ9IGZyb20gJy4uL1NoYXJlZC9Qb2xhcic7XG5cblxuZXhwb3J0IGNsYXNzIEdyYXBoQ29tZm9ydEhpc3RvcnkgZXh0ZW5kcyBHcmFwaENvbWZvcnRCYXNlIHtcbiAgICBcbiAgICBwdWJsaWMgZ3JhcGhEYXRhID0gbmV3IEFycmF5PENvbWZvcnRVc2VyQ2hvaWNlPigpO1xuICAgIHB1YmxpYyBkM1BvaW50cztcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTsgXG4gICAgICAgIC8vdGhpcy5zZXR1cEhpc3RvcnkoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvdyhncmFwaERhdGEgOiBBcnJheTxDb21mb3J0VXNlckNob2ljZT4pOlRoZW5hYmxlPG51bWJlcj4ge1xuICAgICAgICB0aGlzLmdyYXBoRGF0YSA9IGdyYXBoRGF0YTtcbiAgICAgICAgY29uc3QgVGhlbmFibGUgPSB0aGlzLnNob3dCYXNlKCk7XG4gICAgICAgIGQzLnNlbGVjdChcImcjaGlzdG9yeVwiKVxuICAgICAgICAgICAgLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLmRhdGEodGhpcy5ncmFwaERhdGEpXG4gICAgICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCA0MDApXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCA0MDApXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIDEwKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJwb2ludFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24oZDpDb21mb3J0VXNlckNob2ljZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC51c2VyLm5hbWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHRvdGFsUG9pbnRzID0gZ3JhcGhEYXRhLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmFkaWFuID0gNi4yODMxODUzMDcyOy8vMzYwICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgY29uc3QgcG9sYXJEaXZpc2lvbiA9IHJhZGlhbiAvIHRvdGFsUG9pbnRzO1xuICAgICAgICBkMy5zZWxlY3QoXCJnI2hpc3RvcnlcIilcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gODAwO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgZnVuY3Rpb24oZGF0YTpDb21mb3J0VXNlckNob2ljZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IHBvbGFyRGl2aXNpb24gKiBpbmRleDtcbiAgICAgICAgICAgICAgICByZXR1cm4gUG9pbnQudG9DYXJ0ZXNpYW4obmV3IFBvbGFyKGRhdGEuZGlzdGFuY2UsIGFuZ2xlKSwgbmV3IFBvaW50KDQwMCw0MDApKS54O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgZnVuY3Rpb24oZGF0YTpDb21mb3J0VXNlckNob2ljZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IHBvbGFyRGl2aXNpb24gKiBpbmRleDtcbiAgICAgICAgICAgICAgICByZXR1cm4gUG9pbnQudG9DYXJ0ZXNpYW4obmV3IFBvbGFyKGRhdGEuZGlzdGFuY2UsIGFuZ2xlKSwgbmV3IFBvaW50KDQwMCw0MDApKS55O1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICBUaGVuYWJsZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNIT1dFRCBiYXNlIGdyYXBoIC0gbm93IHdoYXQ/XCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFRoZW5hYmxlO1xuICAgIH1cblxuICAgIHB1YmxpYyBoaWRlKCk6VGhlbmFibGU8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn0iLCJpbXBvcnQge0NvbWZvcnRVc2VyQ2hvaWNlfSBmcm9tICcuL0NvbWZvcnRVc2VyQ2hvaWNlJztcbmltcG9ydCB7QnJlYWRjcnVtYkNvbnRyb2x9IGZyb20gJy4uL1NoYXJlZC9CcmVhZGNydW1iQ29udHJvbCc7XG5pbXBvcnQge1VzZXJ9IGZyb20gJy4uL1NoYXJlZC9Vc2VyJztcbmltcG9ydCB7Rm9ybVVzZXJDaG9pY2V9IGZyb20gJy4uL1NoYXJlZC9Gb3JtVXNlckNob2ljZSc7XG5pbXBvcnQge0dyYXBoQ29tZm9ydEVudHJ5fSBmcm9tICcuL0dyYXBoQ29tZm9ydEVudHJ5JztcbmltcG9ydCB7R3JhcGhDb21mb3J0SGlzdG9yeX0gZnJvbSAnLi9HcmFwaENvbWZvcnRIaXN0b3J5JztcblxuXG5leHBvcnQgY2xhc3MgTWVkaWF0b3Ige1xuXG4gICAgdXNlckNob2ljZUhpc3RvcnkgOiBBcnJheTxDb21mb3J0VXNlckNob2ljZT47XG4gICAgZm9ybVVzZXJDaG9pY2UgOiBGb3JtVXNlckNob2ljZTtcbiAgICBncmFwaENvbWZvcnRFbnRyeSA6IEdyYXBoQ29tZm9ydEVudHJ5O1xuICAgIGdyYXBoQ29tZm9ydEhpc3Rvcnk6IEdyYXBoQ29tZm9ydEhpc3Rvcnk7XG4gICAgYnJlYWRjcnVtYkNvbnRyb2w6IEJyZWFkY3J1bWJDb250cm9sO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNUQVJUIGV2ZXJ5dGhpbmdcIik7XG4gICAgICAgIHRoaXMudXNlckNob2ljZUhpc3RvcnkgPSBuZXcgQXJyYXk8Q29tZm9ydFVzZXJDaG9pY2U+KCk7XG4gICAgICAgIHRoaXMuZm9ybVVzZXJDaG9pY2UgPSBuZXcgRm9ybVVzZXJDaG9pY2UoKTtcbiAgICAgICAgdGhpcy5icmVhZGNydW1iQ29udHJvbCA9IG5ldyBCcmVhZGNydW1iQ29udHJvbCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkbyhjb21tYW5kOnN0cmluZywgcGFyYW1zOmFueSkge1xuICAgICAgICBzd2l0Y2ggKGNvbW1hbmQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgXCJhZGRVc2VyXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRVc2VyKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2V0VXNlcnNcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXJzKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2F2ZUNvbWZvcnRGZWVkYmFja1wiOlxuICAgICAgICAgICAgICAgIGNvbnN0IGFyZWEgPSBwYXJhbXMuYXJlYTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHBhcmFtcy5udW1iZXI7XG4gICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IHBhcmFtcy51c2VyO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZUdyYXBoKGFyZWEsIGRpc3RhbmNlLCB1c2VyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJzaG93VXNlckNob2ljZVwiOlxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1VzZXJDaG9pY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJzaG93R3JhcGhDb21mb3J0SGlzdG9yeVwiOlxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0dyYXBoQ29tZm9ydEhpc3RvcnkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJzaG93R3JhcGhDb21mb3J0Q2hvaWNlXCI6XG4gICAgICAgICAgICAgICAgY29uc3QgY29tZm9ydHVzZXI6VXNlciA9IHBhcmFtcztcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dHcmFwaENvbWZvcnRFbnRyeShjb21mb3J0dXNlcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgYWRkVXNlcih1c2VyOlVzZXIpIHtcbiAgICAgICAgdGhpcy5mb3JtVXNlckNob2ljZS5hZGRVc2VyKHVzZXIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRVc2Vycyh1c2VyczpBcnJheTxVc2VyPikge1xuICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlLnNldFVzZXJzKHVzZXJzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvd1VzZXJDaG9pY2UoKSB7XG4gICAgICAgIHRoaXMuZm9ybVVzZXJDaG9pY2Uuc2hvdygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvd0dyYXBoQ29tZm9ydEVudHJ5KHVzZXI6VXNlcikge1xuICAgICAgICBpZighdGhpcy5ncmFwaENvbWZvcnRFbnRyeSkge1xuICAgICAgICAgICAgdGhpcy5ncmFwaENvbWZvcnRFbnRyeSA9IG5ldyBHcmFwaENvbWZvcnRFbnRyeSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3JhcGhDb21mb3J0RW50cnkuc2hvdyh1c2VyKTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNob3dDb21mb3J0SGlzdG9yeShoaXN0b3J5KSB7XG4gICAgICAgIHZhciBhZnRlckhpZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgaWYoIXRoaXMuZ3JhcGhDb21mb3J0SGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhDb21mb3J0RW50cnkgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhDb21mb3J0SGlzdG9yeSA9IG5ldyBHcmFwaENvbWZvcnRIaXN0b3J5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdyYXBoQ29tZm9ydEhpc3Rvcnkuc2hvdyhoaXN0b3J5KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICBpZiAodGhpcy5ncmFwaENvbWZvcnRFbnRyeSkge1xuICAgICAgICAgICAgdGhpcy5ncmFwaENvbWZvcnRFbnRyeS5oaWRlKCkudGhlbihhZnRlckhpZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy5mb3JtVXNlckNob2ljZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVVzZXJDaG9pY2UuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWZ0ZXJIaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG93R3JhcGhDb21mb3J0SGlzdG9yeSgpIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JhcGhDb21mb3J0SGlzdG9yeSkge1xuICAgICAgICAgICAgdGhpcy5ncmFwaENvbWZvcnRFbnRyeSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmdyYXBoQ29tZm9ydEhpc3RvcnkgPSBuZXcgR3JhcGhDb21mb3J0SGlzdG9yeSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3JhcGhDb21mb3J0SGlzdG9yeS5zaG93KHRoaXMudXNlckNob2ljZUhpc3RvcnkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWxlY3RVc2VyKGlkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQUNUSU9OIHNlbGVjdFVzZXJcIiwgaWQpO1xuICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlLmdldFVzZXIoaWQpLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybVVzZXJDaG9pY2UuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5zaG93R3JhcGhDb21mb3J0RW50cnkodXNlcik7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwdWJsaWMgc2F2ZUdyYXBoKGFyZWE6c3RyaW5nLCBkaXN0YW5jZTpudW1iZXIsIHVzZXI6VXNlcikge1xuICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlLm1hcmtVc2VyRG9uZSh1c2VyKTtcbiAgICAgICAgdGhpcy5hZGRVc2VyQ2hvaWNlSGlzdG9yeShhcmVhLCBkaXN0YW5jZSwgdXNlcik7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkVXNlckNob2ljZUhpc3RvcnkoYXJlYTpzdHJpbmcsIGRpc3RhbmNlOm51bWJlciwgdXNlcjpVc2VyKSB7XG4gICAgICAgIGNvbnN0IHRoaXNVc2VyQ2hvaWNlID0gdGhpcy51c2VyQ2hvaWNlSGlzdG9yeS5maWx0ZXIoZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgcmV0dXJuIHgudXNlci5pZCA9PT0gdXNlci5pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmKHRoaXNVc2VyQ2hvaWNlLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpc1VzZXJDaG9pY2VbMF0uYXJlYSA9IGFyZWE7XG4gICAgICAgICAgICB0aGlzVXNlckNob2ljZVswXS5kaXN0YW5jZSA9IGRpc3RhbmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdXNlckNob2ljZSA9IG5ldyBDb21mb3J0VXNlckNob2ljZSh1c2VyLGRpc3RhbmNlLGFyZWEpO1xuICAgICAgICAgICAgdGhpcy51c2VyQ2hvaWNlSGlzdG9yeS5wdXNoKHVzZXJDaG9pY2UpO1xuICAgICAgICB9XG4gICAgfSAgXG5cbiAgICBwcml2YXRlIG5leHQoKSB7XG4gICAgICAgIC8vY29uc3QgcHJvbSA9IG5ldyBQcm9tc2llKClcbiAgICAgICAgY29uc29sZS5sb2coXCJBQ1RJT04gbmV4dFVzZXJcIiwgdGhpcyk7XG4gICAgICAgIHZhciBhZnRlckhpZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybVVzZXJDaG9pY2UuaGFzTW9yZVVzZXJzKCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXJzIGxlZnQuLi5cIiwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1VzZXJDaG9pY2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5PIHVzZXJzIGxlZnRcIiwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0dyYXBoQ29tZm9ydEhpc3RvcnkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ncmFwaENvbWZvcnRFbnRyeS5oaWRlKCkudGhlbihhZnRlckhpZGUpO1xuICAgIH1cblxuICAgIC8vc2V0dXBVc2Vyc1xuICAgIC8vXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvZDMvZDMuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9lczYtcHJvbWlzZS9lczYtcHJvbWlzZS5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvcmVxdWlyZWpzL3JlcXVpcmUuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9TaGFyZWQvVXNlci50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9TaGFyZWQvSW5NZW1vcnlCcm93c2VyVXNlcnMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQ29tZm9ydFpvbmUvTWVkaWF0b3IudHNcIi8+XG5cblxudmFyIG1lZGlhdG9yLFxuICAgIHVzZXJMb2FkZXI7XG5yZXF1aXJlanMuY29uZmlnKCB7XG4gICAgYmFzZVVybCA6ICcvJ1xufSk7XG5cblxucmVxdWlyZShbJ0NvbWZvcnRab25lL01lZGlhdG9yJywnU2hhcmVkL1VzZXInLCdTaGFyZWQvSW5NZW1vcnlCcm93c2VyVXNlcnMnXSwgZnVuY3Rpb24obSx1LGIpIHtcbiAgICBjb25zb2xlLmxvZyhcIlN0YXJ0aW5nXCIpO1xuICAgIG1lZGlhdG9yID0gbmV3IG0uTWVkaWF0b3IoMjMsMjMpO1xuICAgIGNvbnNvbGUubG9nKG1lZGlhdG9yKTtcbiAgICB1c2VyTG9hZGVyID0gbmV3IGIuSW5NZW1vcnlCcm93c2VyVXNlcnMod2luZG93KTtcbiAgICB1c2VyTG9hZGVyLmdldFVzZXJzKCkudGhlbihmdW5jdGlvbih1c2Vycykge1xuICAgICAgICBpZih1c2Vycykge1xuICAgICAgICAgICAgbWVkaWF0b3Iuc2V0VXNlcnModXNlcnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVkaWF0b3Iuc2V0VXNlcnMoW1xuICAgICAgICAgICAgICAgIG5ldyB1LlVzZXIoXCJBZGFtIEhhbGxcIixcInh4eDFcIiksIFxuICAgICAgICAgICAgICAgIG5ldyB1LlVzZXIoXCJCaWxsaWUgRGF2ZXlcIixcInh4eDJcIiksIFxuICAgICAgICAgICAgICAgIG5ldyB1LlVzZXIoXCJMYXVyYSBSb3dlXCIsXCJ4eHgzXCIpLFxuICAgICAgICAgICAgICAgIG5ldyB1LlVzZXIoXCJTaW1vbiBEYXdzb25cIixcInh4eDRcIilcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNlbGVjdFVzZXJcIiwgZnVuY3Rpb24oZTpDdXN0b21FdmVudCkge1xuICAgICAgICBtZWRpYXRvci5zZWxlY3RVc2VyKGUuZGV0YWlsLmlkKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2F2ZUdyYXBoXCIsIGZ1bmN0aW9uKGU6Q3VzdG9tRXZlbnQpIHtcbiAgICAgICAgdmFyIG8gPSBlLmRldGFpbDtcbiAgICAgICAgbWVkaWF0b3Iuc2F2ZUdyYXBoKG8uYXJlYSxvLmRpc3RhbmNlLG8uY3VycmVudFVzZXIpO1xuICAgIH0pO1xuICAgICAgICAgICAgLy87XCIpXG4gICAgY29uc29sZS5sb2cobWVkaWF0b3IpO1xufSk7XG4vKlxuQ29tbWFuZHMgeW91IGNhbiB0aHJvdyBpbnRvIHRoZSBtZWRpYXRvci4uLi5cblxubWVkaWF0b3Iuc2V0VXNlcnMoW1xuICAge25hbWU6XCJOaWdlbCBIYWxsXCIsaWQ6XCIxeHgwXCJ9LCBcbiAgIHtuYW1lOlwiRnJlZCBIYWxsXCIsaWQ6XCIxeHgxXCJ9LCBcbiAgIHtuYW1lOlwiQm9iIEhhbGxcIixpZDpcIjF4eDJcIn0gXG5dKTtcblxubWVkaWF0b3IuYWRkVXNlcih7bmFtZTpcIk1hbmR5XCIsIGlkOlwiOTgxMjk4MTI5XCJ9KVxuXG4qL1xuXG4vL2ltcG9ydCB7TWVkaWF0b3J9IGZyb20gJ01lZGlhdG9yJztcbi8vaW1wb3J0IHtVc2VyfSBmcm9tICdVc2VyJztcblxuXG4vL2NvbnN0IHN0YWdlID0gbmV3IENvbWZvcnQuU3RhZ2UoKTtcbi8vY29uc3QgbWVkaWF0b3IgPSBuZXcgTWVkaWF0b3IoKTtcbi8qbWVkaWF0b3Iuc2V0VXNlcnMoW1xuICAgXG5dKTsqL1xuLy9leHBvcnQgbWVkaWF0b3I7XG5cbiIsImltcG9ydCB7Q29tZm9ydFVzZXJDaG9pY2V9IGZyb20gJy4vQ29tZm9ydFVzZXJDaG9pY2UnO1xuZXhwb3J0IGNsYXNzIENvbWZvcnRVc2VyQ2hvaWNlSGlzdG9yeSB7XG4gICAgZGF0ZSA6RGF0ZTtcbiAgICBkYXRhIDogQXJyYXk8Q29tZm9ydFVzZXJDaG9pY2U+O1xufSJdfQ==
