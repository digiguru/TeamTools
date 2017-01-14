var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
define("Tuckman/TuckmanZones", ["require", "exports"], function (require, exports) {
    "use strict";
    var TuckmanZones = (function () {
        function TuckmanZones(name, left, width) {
            this.name = name;
            this.left = left;
            this.width = width;
        }
        return TuckmanZones;
    }());
    exports.TuckmanZones = TuckmanZones;
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
define("Tuckman/GraphTuckmanBase", ["require", "exports", "Shared/Timed", "Tuckman/TuckmanZones", "Shared/Point"], function (require, exports, Timed_1, TuckmanZones_1, Point_1) {
    "use strict";
    var GraphTuckmanBase = (function () {
        function GraphTuckmanBase() {
            this.setupArea();
        }
        GraphTuckmanBase.prototype.setupArea = function () {
            this.startPoint = new Point_1.Point(0, 400);
            var zones = [
                new TuckmanZones_1.TuckmanZones("forming", 0, 200),
                new TuckmanZones_1.TuckmanZones("storming", 200, 200),
                new TuckmanZones_1.TuckmanZones("norming", 400, 200),
                new TuckmanZones_1.TuckmanZones("performing", 600, 200)
            ];
            var d3zones = d3.select("g#zones")
                .selectAll("rect")
                .data(zones);
            d3zones.enter().append("rect")
                .attr("x", 0)
                .attr("y", 400)
                .attr("class", "area")
                .attr("id", function (d) {
                return d.name;
            });
            this.forming = document.getElementById('forming');
            this.storming = document.getElementById('storming');
            this.norming = document.getElementById('norming');
            this.performing = document.getElementById('performing');
        };
        GraphTuckmanBase.prototype.hide = function () {
            console.log("HIDE comfortGRAPH");
            var d3zones = d3.select("g#zones")
                .selectAll("rect")
                .transition()
                .duration(1000)
                .attr("x", 0)
                .attr("width", 0);
            var d3drops = d3.select("#stage")
                .selectAll("circle.dropper")
                .transition()
                .delay(250)
                .duration(250)
                .attr("r", 0);
            return Timed_1.Timed.for(1000);
        };
        GraphTuckmanBase.prototype.showBase = function () {
            console.log("SHOW graph");
            var d3zones = d3.select("g#zones")
                .selectAll("rect")
                .attr("x", 0)
                .attr("width", 0)
                .transition()
                .duration(1000)
                .delay(function (d, i) { return i * 100; })
                .ease("elastic")
                .attr("x", function (d) {
                return d.left;
            })
                .attr("width", function (d) {
                return d.width;
            });
            return Timed_1.Timed.for(1000);
        };
        return GraphTuckmanBase;
    }());
    exports.GraphTuckmanBase = GraphTuckmanBase;
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
define("Tuckman/GraphTuckmanEntry", ["require", "exports", "Tuckman/GraphTuckmanBase", "Shared/Point", "Shared/SVG"], function (require, exports, GraphTuckmanBase_1, Point_2, SVG_1) {
    "use strict";
    var GraphTuckmanEntry = (function (_super) {
        __extends(GraphTuckmanEntry, _super);
        function GraphTuckmanEntry() {
            var _this = _super.call(this) || this;
            _this.clickArea = document.getElementById('clickable');
            _this.setupOverActivity();
            return _this;
        }
        GraphTuckmanEntry.prototype.setupOverActivity = function () {
            var that = this;
            d3.select("#stage").on("mousemove", this.graphMove()); //this.checkArea);
        };
        GraphTuckmanEntry.prototype.setupClickActivity = function () {
            console.log("SETUP graph click");
            d3.select("#stage").on("mouseup", this.graphUp());
            d3.select("#stage").on("mousedown", this.graphDown());
        };
        GraphTuckmanEntry.prototype.graphMove = function () {
            /// 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = Point_2.Point.fromCoords(d3.mouse(this));
                var distance = coord.x;
                var area = GraphTuckmanEntry.calculateDistance(distance);
                that.highlight(area);
            };
        };
        GraphTuckmanEntry.prototype.graphUp = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = Point_2.Point.fromCoords(d3.mouse(this));
                var distance = coord.x;
                var area = GraphTuckmanEntry.calculateDistance(distance);
                that.saveTheInteraction(area, distance);
            };
        };
        GraphTuckmanEntry.prototype.graphDown = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = Point_2.Point.fromCoords(d3.mouse(this));
                var el = SVG_1.SVG.circle(8, coord.x, coord.y, "dropper");
                that.addDropper(el);
            };
        };
        GraphTuckmanEntry.prototype.highlight = function (area) {
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
        GraphTuckmanEntry.prototype.addDropper = function (el) {
            this.dropper = el;
            document.getElementById('stage').insertBefore(el, this.clickArea);
        };
        GraphTuckmanEntry.calculateDistance = function (distance) {
            if (distance < 200) {
                return "forming";
            }
            else if (distance < 400) {
                return "storming";
            }
            else if (distance < 600) {
                return "norming";
            }
            else {
                return "performing";
            }
        };
        GraphTuckmanEntry.prototype.removeInteractions = function () {
            console.log("REMOVE activiteis from GraphTuckmanEntry");
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
        GraphTuckmanEntry.prototype.saveTheInteraction = function (area, distance) {
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
        GraphTuckmanEntry.prototype.show = function (user) {
            this.currentUser = user;
            var Thenable = this.showBase();
            this.setupOverActivity();
            return Thenable.then(this.setupClickActivity.bind(this));
        };
        return GraphTuckmanEntry;
    }(GraphTuckmanBase_1.GraphTuckmanBase));
    exports.GraphTuckmanEntry = GraphTuckmanEntry;
});
define("Tuckman/TuckmanUserChoice", ["require", "exports"], function (require, exports) {
    "use strict";
    var TuckmanUserChoice = (function () {
        function TuckmanUserChoice(user, distance, area) {
            this.user = user;
            this.distance = distance;
            this.area = area;
        }
        return TuckmanUserChoice;
    }());
    exports.TuckmanUserChoice = TuckmanUserChoice;
});
define("Tuckman/GraphTuckmanHistory", ["require", "exports", "Tuckman/GraphTuckmanBase"], function (require, exports, GraphTuckmanBase_2) {
    "use strict";
    var GraphTuckmanHistory = (function (_super) {
        __extends(GraphTuckmanHistory, _super);
        function GraphTuckmanHistory() {
            var _this = _super.call(this) || this;
            _this.graphData = new Array();
            return _this;
            //this.setupHistory();
        }
        GraphTuckmanHistory.prototype.show = function (graphData) {
            this.graphData = graphData;
            var Thenable = this.showBase();
            var totalPoints = graphData.length;
            var totalHeight = 800;
            var heightDivision = totalHeight / totalPoints;
            d3.select("g#history")
                .selectAll("circle")
                .data(this.graphData)
                .enter()
                .append("circle")
                .attr("cx", 0)
                .attr("cy", function (data, index) {
                return (heightDivision * index) + 100;
            })
                .attr("r", 10)
                .attr("class", "point")
                .attr("id", function (d) {
                return d.user.name;
            });
            d3.select("g#history")
                .selectAll("circle")
                .transition()
                .duration(function () {
                return 800;
            })
                .attr("cx", function (data, index) {
                return data.distance;
            })
                .attr("cy", function (data, index) {
                return (heightDivision * index) + 100;
            });
            Thenable.then(function () {
                console.log("SHOWED base graph - now what?");
            });
            return Thenable;
        };
        GraphTuckmanHistory.prototype.hide = function () {
            return null;
        };
        return GraphTuckmanHistory;
    }(GraphTuckmanBase_2.GraphTuckmanBase));
    exports.GraphTuckmanHistory = GraphTuckmanHistory;
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
define("Shared/FormUserChoice", ["require", "exports", "Shared/Timed", "Shared/Users"], function (require, exports, Timed_2, Users_1) {
    "use strict";
    var FormUserChoice = (function () {
        function FormUserChoice() {
            var _this = this;
            this.userRepo = new Users_1.InMemoryUsers(); //DI this
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
            return Timed_2.Timed.for(800).then(this.afterShow.bind(this));
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
            return Timed_2.Timed.for(800);
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
define("Tuckman/Mediator", ["require", "exports", "Tuckman/TuckmanUserChoice", "Shared/BreadcrumbControl", "Shared/FormUserChoice", "Tuckman/GraphTuckmanEntry", "Tuckman/GraphTuckmanHistory"], function (require, exports, TuckmanUserChoice_1, BreadcrumbControl_1, FormUserChoice_1, GraphTuckmanEntry_1, GraphTuckmanHistory_1) {
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
                case "saveTuckmanFeedback":
                    var area = params.area;
                    var distance = params.number;
                    var user = params.user;
                    this.saveGraph(area, distance, user);
                    break;
                case "showUserChoice":
                    this.showUserChoice();
                    break;
                case "showGraphTuckmanHistory":
                    this.showGraphTuckmanHistory();
                    break;
                case "showGraphTuckmanChoice":
                    var comfortuser = params;
                    this.showGraphTuckmanEntry(comfortuser);
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
        Mediator.prototype.showGraphTuckmanEntry = function (user) {
            if (!this.graphTuckmanEntry) {
                this.graphTuckmanEntry = new GraphTuckmanEntry_1.GraphTuckmanEntry();
            }
            this.graphTuckmanEntry.show(user);
        };
        Mediator.prototype.showTuckmanHistory = function (history) {
            var afterHide = function () {
                if (!this.graphTuckmanHistory) {
                    this.graphTuckmanEntry = null;
                    this.graphTuckmanHistory = new GraphTuckmanHistory_1.GraphTuckmanHistory();
                }
                this.graphTuckmanHistory.show(history);
            }.bind(this);
            if (this.graphTuckmanEntry) {
                this.graphTuckmanEntry.hide().then(afterHide);
            }
            else {
                if (this.formUserChoice) {
                    this.formUserChoice.hide();
                }
                afterHide();
            }
        };
        Mediator.prototype.showGraphTuckmanHistory = function () {
            if (!this.graphTuckmanHistory) {
                this.graphTuckmanEntry = null;
                this.graphTuckmanHistory = new GraphTuckmanHistory_1.GraphTuckmanHistory();
            }
            this.graphTuckmanHistory.show(this.userChoiceHistory);
        };
        Mediator.prototype.selectUser = function (id) {
            var _this = this;
            console.log("ACTION selectUser", id);
            var user = this.formUserChoice.getUser(id).then(function (user) {
                _this.formUserChoice.hide();
                _this.showGraphTuckmanEntry(user);
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
                var userChoice = new TuckmanUserChoice_1.TuckmanUserChoice(user, distance, area);
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
                        _this.showGraphTuckmanHistory();
                    }
                });
            }.bind(this);
            this.graphTuckmanEntry.hide().then(afterHide);
        };
        return Mediator;
    }());
    exports.Mediator = Mediator;
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
define("Shared/InMemoryBrowserUsers", ["require", "exports", "Shared/Users", "Shared/BrowserUsers"], function (require, exports, Users_2, BrowserUsers_1) {
    "use strict";
    var InMemoryBrowserUsers = (function () {
        function InMemoryBrowserUsers(window) {
            this.cache = new Users_2.InMemoryUsers();
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
/// <reference path="../Shared/User.ts"/>
/// <reference path="../Shared/InMemoryBrowserUsers.ts"/>
/// <reference path="../Tuckman/Mediator.ts"/>
var mediator, userLoader;
requirejs.config({
    baseUrl: '/'
});
require(['Tuckman/Mediator', 'Shared/User', 'Shared/InMemoryBrowserUsers'], function (m, u, b) {
    console.log("Starting");
    mediator = new m.Mediator(23, 23);
    userLoader = new b.InMemoryBrowserUsers(window);
    console.log(mediator);
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
define("Tuckman/TuckmanUserChoiceHistory", ["require", "exports"], function (require, exports) {
    "use strict";
    var TuckmanUserChoiceHistory = (function () {
        function TuckmanUserChoiceHistory() {
        }
        return TuckmanUserChoiceHistory;
    }());
    exports.TuckmanUserChoiceHistory = TuckmanUserChoiceHistory;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL1NoYXJlZC9UaW1lZC50cyIsIlR1Y2ttYW5ab25lcy50cyIsIi4uL1NoYXJlZC9Qb2xhci50cyIsIi4uL1NoYXJlZC9Qb2ludC50cyIsIkdyYXBoVHVja21hbkJhc2UudHMiLCIuLi9TaGFyZWQvQ2FjaGUudHMiLCIuLi9TaGFyZWQvVXNlci50cyIsIi4uL1NoYXJlZC9TVkcudHMiLCJHcmFwaFR1Y2ttYW5FbnRyeS50cyIsIlR1Y2ttYW5Vc2VyQ2hvaWNlLnRzIiwiR3JhcGhUdWNrbWFuSGlzdG9yeS50cyIsIi4uL1NoYXJlZC9CcmVhZGNydW1iLnRzIiwiLi4vU2hhcmVkL0JyZWFkY3J1bWJDb250cm9sLnRzIiwiLi4vU2hhcmVkL1VzZXJDb25zdHJ1Y3Rvci50cyIsIi4uL1NoYXJlZC9Vc2Vycy50cyIsIi4uL1NoYXJlZC9Gb3JtVXNlckNob2ljZS50cyIsIk1lZGlhdG9yLnRzIiwiLi4vU2hhcmVkL0Jyb3dzZXJSZXBvLnRzIiwiLi4vU2hhcmVkL0Jyb3dzZXJVc2Vycy50cyIsIi4uL1NoYXJlZC9Jbk1lbW9yeUJyb3dzZXJVc2Vycy50cyIsInR1Y2ttYW4udHMiLCJUdWNrbWFuVXNlckNob2ljZUhpc3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQUVBO1FBQUE7UUFTQSxDQUFDO1FBUmlCLFNBQUcsR0FBakIsVUFBa0IsWUFBbUI7WUFDakMsSUFBTSxDQUFDLEdBQXFCLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTztnQkFDNUMsVUFBVSxDQUFDO29CQUNQLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDMUIsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7UUFDTCxZQUFDO0lBQUQsQ0FUQSxBQVNDLElBQUE7SUFUWSxzQkFBSzs7OztJQ0RsQjtRQUlJLHNCQUFZLElBQVksRUFBRSxJQUFZLEVBQUUsS0FBYTtZQUNq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QzdEbEI7UUFBQTtRQUdBLENBQUM7UUFBRCwrQkFBQztJQUFELENBSEEsQUFHQyxJQUFBO0lBSFksNERBQXdCIiwiZmlsZSI6ImpzL2NvbXBpbGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4gICAgICAgIFxuZXhwb3J0IGNsYXNzIFRpbWVkIHtcbiAgICBwdWJsaWMgc3RhdGljIGZvcihtaWxsaXNlY29uZHM6bnVtYmVyKSA6VGhlbmFibGU8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHA6IFRoZW5hYmxlPE51bWJlcj4gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PntcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShtaWxsaXNlY29uZHMpOyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9LCBtaWxsaXNlY29uZHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxufSIsIlxuZXhwb3J0IGNsYXNzIFR1Y2ttYW5ab25lcyB7XG4gICAgbmFtZSA6IHN0cmluZztcbiAgICBsZWZ0OiBudW1iZXI7XG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGxlZnQ6IG51bWJlciwgd2lkdGg6IG51bWJlcikge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7IFxuICAgIH1cbn0iLCJcblxuZXhwb3J0IGNsYXNzIFBvbGFyIHtcbiAgICByYWRpdXM6bnVtYmVyO1xuICAgIGFuZ2xlOm51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcihyYWRpdXM6bnVtYmVyLCBhbmdsZTpudW1iZXIpIHtcbiAgICAgICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcbiAgICB9XG59XG4iLCIvL2ltcG9ydCBQb2xhciA9IHJlcXVpcmUoJ1BvbGFyJyk7XG5cbmltcG9ydCB7UG9sYXJ9IGZyb20gJy4vUG9sYXInO1xuZXhwb3J0IGNsYXNzIFBvaW50IHtcbiAgICB4IDogbnVtYmVyO1xuICAgIHkgOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcih4Om51bWJlciwgeTpudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgc3RhdGljIGZyb21Db29yZHMoY29vcmRzOkFycmF5PG51bWJlcj4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludChjb29yZHNbMF0sY29vcmRzWzFdKTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBmcm9tT2Zmc2V0KHBvaW50OlBvaW50LCBvcmlnaW46UG9pbnQpOlBvaW50IHtcbiAgICAgICAgY29uc3QgZHggPSBwb2ludC54IC0gb3JpZ2luLng7XG4gICAgICAgIGNvbnN0IGR5ID0gcG9pbnQueSAtIG9yaWdpbi55O1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KGR4LGR5KTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyB0b09mZnNldChwb2ludDpQb2ludCwgb3JpZ2luOlBvaW50KTpQb2ludCB7XG4gICAgICAgIGNvbnN0IGR4ID0gcG9pbnQueCArIG9yaWdpbi54O1xuICAgICAgICBjb25zdCBkeSA9IHBvaW50LnkgKyBvcmlnaW4ueTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludChkeCxkeSk7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UocG9pbnQ6UG9pbnQgLCBvcmlnaW46UG9pbnQpOm51bWJlciB7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IFBvaW50LmZyb21PZmZzZXQocG9pbnQsIG9yaWdpbik7XG4gICAgICAgIHJldHVybiBQb2ludC5kaXN0YW5jZUZyb21PZmZzZXQob2Zmc2V0KTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBkaXN0YW5jZUZyb21PZmZzZXQob2Zmc2V0OlBvaW50KTpudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KG9mZnNldC54ICogb2Zmc2V0LnggKyBvZmZzZXQueSAqIG9mZnNldC55KTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyB0b0NhcnRlc2lhbk5vT2Zmc2V0KHBvbGFyOlBvbGFyKTpQb2ludCB7XG4gICAgICAgIGNvbnN0IHggPSBwb2xhci5yYWRpdXMgKiBNYXRoLmNvcyhwb2xhci5hbmdsZSk7XG4gICAgICAgIGNvbnN0IHkgPSBwb2xhci5yYWRpdXMgKiBNYXRoLnNpbihwb2xhci5hbmdsZSk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7IFxuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIHRvQ2FydGVzaWFuKHBvbGFyOlBvbGFyLG9yaWdpbjpQb2ludCk6UG9pbnQge1xuICAgICAgICBjb25zdCBwb2ludCA9IFBvaW50LnRvQ2FydGVzaWFuTm9PZmZzZXQocG9sYXIpO1xuICAgICAgICByZXR1cm4gUG9pbnQudG9PZmZzZXQocG9pbnQsb3JpZ2luKTsgXG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgdG9Qb2xhcihwb2ludDpQb2ludCwgb3JpZ2luOlBvaW50KTpQb2xhciB7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IFBvaW50LmZyb21PZmZzZXQocG9pbnQsIG9yaWdpbik7XG4gICAgICAgIGNvbnN0IHJhZGl1cyA9IFBvaW50LmRpc3RhbmNlRnJvbU9mZnNldChvZmZzZXQpO1xuICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguYXRhbjIob2Zmc2V0LnksIG9mZnNldC54KTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2xhcihyYWRpdXMsIGFuZ2xlKTtcbiAgICB9XG59XG4vL30pO1xuIiwiaW1wb3J0IHtUaW1lZH0gZnJvbSAnLi4vU2hhcmVkL1RpbWVkJztcbmltcG9ydCB7VHVja21hblpvbmVzfSBmcm9tICcuL1R1Y2ttYW5ab25lcyc7XG5pbXBvcnQge1BvaW50fSBmcm9tICcuLi9TaGFyZWQvUG9pbnQnO1xuXG5cbmV4cG9ydCBjbGFzcyBHcmFwaFR1Y2ttYW5CYXNlIHtcbiAgICBmb3JtaW5nIDogSFRNTEVsZW1lbnQ7XG4gICAgc3Rvcm1pbmcgOiBIVE1MRWxlbWVudDtcbiAgICBub3JtaW5nIDogSFRNTEVsZW1lbnQ7XG4gICAgcGVyZm9ybWluZyA6IEhUTUxFbGVtZW50O1xuICAgIHN0YXJ0UG9pbnQgOiBQb2ludDtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zZXR1cEFyZWEoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldHVwQXJlYSAoKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnN0YXJ0UG9pbnQgPSBuZXcgUG9pbnQoMCwgNDAwKTtcblxuICAgICAgICBjb25zdCB6b25lcyA9IFtcbiAgICAgICAgICAgIG5ldyBUdWNrbWFuWm9uZXMoXCJmb3JtaW5nXCIsIDAsIDIwMCksIFxuICAgICAgICAgICAgbmV3IFR1Y2ttYW5ab25lcyhcInN0b3JtaW5nXCIsIDIwMCwgMjAwKSwgXG4gICAgICAgICAgICBuZXcgVHVja21hblpvbmVzKFwibm9ybWluZ1wiLCA0MDAsIDIwMCksIFxuICAgICAgICAgICAgbmV3IFR1Y2ttYW5ab25lcyhcInBlcmZvcm1pbmdcIiwgNjAwLCAyMDApXG4gICAgICAgICAgICBdO1xuICAgICAgICBjb25zdCBkM3pvbmVzID0gZDMuc2VsZWN0KFwiZyN6b25lc1wiKVxuICAgICAgICAgICAgLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgICAgICAgIC5kYXRhKHpvbmVzKTtcblxuICAgICAgICBkM3pvbmVzLmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCA0MDApXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImFyZWFcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImlkXCIsIGZ1bmN0aW9uKGQ6VHVja21hblpvbmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLm5hbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG5cbiAgICAgICAgdGhpcy5mb3JtaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm1pbmcnKTtcbiAgICAgICAgdGhpcy5zdG9ybWluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdG9ybWluZycpO1xuICAgICAgICB0aGlzLm5vcm1pbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm9ybWluZycpO1xuICAgICAgICB0aGlzLnBlcmZvcm1pbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGVyZm9ybWluZycpO1xuICAgICAgICBcblxuICAgIH1cbiAgICBwdWJsaWMgaGlkZSgpOlRoZW5hYmxlPG51bWJlcj4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhJREUgY29tZm9ydEdSQVBIXCIpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZDN6b25lcyA9IGQzLnNlbGVjdChcImcjem9uZXNcIikgICAgXG4gICAgICAgICAgICAuc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgMClcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDApO1xuXG4gICAgICAgIGNvbnN0IGQzZHJvcHMgPSBkMy5zZWxlY3QoXCIjc3RhZ2VcIilcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCJjaXJjbGUuZHJvcHBlclwiKSAgIFxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kZWxheSgyNTApXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDI1MClcbiAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgMCk7XG4gICAgICAgIHJldHVybiBUaW1lZC5mb3IoMTAwMCk7XG4gICAgICAgICAgICAgICAgXG4gICAgfVxuICAgIHB1YmxpYyBzaG93QmFzZSgpOlRoZW5hYmxlPG51bWJlcj4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNIT1cgZ3JhcGhcIik7XG4gICAgICAgIGNvbnN0IGQzem9uZXMgPSBkMy5zZWxlY3QoXCJnI3pvbmVzXCIpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMClcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAuZGVsYXkoZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gaSAqIDEwMDsgfSlcbiAgICAgICAgICAgICAgICAuZWFzZShcImVsYXN0aWNcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24oZDpUdWNrbWFuWm9uZXMpIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmxlZnQ7IFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkOlR1Y2ttYW5ab25lcykgeyBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQud2lkdGg7IFxuICAgICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBUaW1lZC5mb3IoMTAwMCk7XG4gICAgICAgIFxuICAgIH1cblxufSIsImV4cG9ydCBpbnRlcmZhY2UgSUluZGV4YWJsZU9iamVjdCB7XG4gICAgaWQ6c3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElDYWNoZTxUPiB7XG4gICAgdXBkYXRlKGl0ZW06VCkgOiBUaGVuYWJsZTxUW10+O1xuICAgIGFkZChpdGVtOlQpIDogVGhlbmFibGU8VFtdPjtcbiAgICBnZXQoKSA6IFRoZW5hYmxlPFRbXT47XG4gICAgZ2V0QnlJZChpZDpzdHJpbmcpIDogVGhlbmFibGU8VD47XG4gICAgc2V0KGl0ZW1zOlRbXSkgOiBUaGVuYWJsZTxUW10+O1xufVxuXG5leHBvcnQgY2xhc3MgR2VuZXJpY0NhY2hlIGltcGxlbWVudHMgSUNhY2hlPElJbmRleGFibGVPYmplY3Q+IHtcbiAgICBzdG9yZTpJSW5kZXhhYmxlT2JqZWN0W107XG4gICAgXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3RvcmUgPSBbXTtcbiAgICB9XG4gICAgXG4gICAgdXBkYXRlKGl0ZW06SUluZGV4YWJsZU9iamVjdCkgOiBUaGVuYWJsZTxJSW5kZXhhYmxlT2JqZWN0W10+IHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN0b3JlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gdGhpcy5zdG9yZVtpXS5pZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmVbaV0gPSBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5zdG9yZSk7XG4gICAgfVxuXG4gICAgYWRkKGl0ZW06SUluZGV4YWJsZU9iamVjdCkgOiBUaGVuYWJsZTxJSW5kZXhhYmxlT2JqZWN0W10+IHtcbiAgICAgICAgdGhpcy5zdG9yZS5wdXNoKGl0ZW0pO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuc3RvcmUpO1xuICAgIH1cblxuICAgIGdldCgpIDogVGhlbmFibGU8SUluZGV4YWJsZU9iamVjdFtdPiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5zdG9yZSk7XG4gICAgfVxuICAgIFxuICAgIGdldEJ5SWQoaWQ6c3RyaW5nKSA6IFRoZW5hYmxlPElJbmRleGFibGVPYmplY3Q+IHtcbiAgICAgICAgY29uc3Qgc3RvcmUgPSB0aGlzLnN0b3JlLmZpbHRlcihmdW5jdGlvbih4OklJbmRleGFibGVPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB4LmlkID09PSBpZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmKHN0b3JlLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShzdG9yZVswXSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgRXJyb3IoXCJDYW5ub3QgZmluZCBpdGVtIGJ5IElEOiBcIiArIGlkKTtcbiAgICB9XG4gICAgXG4gICAgc2V0KGl0ZW1zOklJbmRleGFibGVPYmplY3RbXSkgOiBUaGVuYWJsZTxJSW5kZXhhYmxlT2JqZWN0W10+IHtcbiAgICAgICAgdGhpcy5zdG9yZSA9IGl0ZW1zO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuc3RvcmUpOztcbiAgICB9XG59IiwiaW1wb3J0IHtJSW5kZXhhYmxlT2JqZWN0fSBmcm9tICcuL0NhY2hlJztcbmV4cG9ydCBjbGFzcyBVc2VyIGltcGxlbWVudHMgSUluZGV4YWJsZU9iamVjdCB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgdm90ZWQ6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3IobmFtZTpzdHJpbmcsIGlkOnN0cmluZykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMudm90ZWQgPSBmYWxzZTtcbiAgICB9XG59IiwiXG5leHBvcnQgY2xhc3MgU1ZHIHtcbiAgICBzdGF0aWMgZWxlbWVudCh0YWdOYW1lKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCB0YWdOYW1lKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY2lyY2xlKHIsIHgsIHksIGNsYXNzTmFtZSkge1xuICAgICAgICBjb25zdCBlbCA9IFNWRy5lbGVtZW50KFwiY2lyY2xlXCIpO1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJyXCIsIHIpO1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJjeFwiLCB4KTtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiY3lcIiwgeSk7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgLy88Y2lyY2xlIGlkPVwic3RyZXRjaFwiIHI9XCIzMDBcIiBjeD1cIjQwMFwiIGN5PVwiNDAwXCIgLz5cblxuICAgIH1cbn0iLCJpbXBvcnQge1VzZXJ9IGZyb20gJy4uL1NoYXJlZC9Vc2VyJztcbmltcG9ydCB7R3JhcGhUdWNrbWFuQmFzZX0gZnJvbSAnLi9HcmFwaFR1Y2ttYW5CYXNlJztcbmltcG9ydCB7UG9pbnR9IGZyb20gJy4uL1NoYXJlZC9Qb2ludCc7XG5pbXBvcnQge1NWR30gZnJvbSAnLi4vU2hhcmVkL1NWRyc7XG5cbmV4cG9ydCBjbGFzcyBHcmFwaFR1Y2ttYW5FbnRyeSBleHRlbmRzIEdyYXBoVHVja21hbkJhc2Uge1xuICAgIGNsaWNrQXJlYSA6IEhUTUxFbGVtZW50O1xuICAgIGN1cnJlbnRVc2VyOlVzZXI7XG4gICAgZHJvcHBlciA6IFNWR0FFbGVtZW50O1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNsaWNrQXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGlja2FibGUnKTtcbiAgICAgICAgdGhpcy5zZXR1cE92ZXJBY3Rpdml0eSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXR1cE92ZXJBY3Rpdml0eSAoKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBkMy5zZWxlY3QoXCIjc3RhZ2VcIikub24oXCJtb3VzZW1vdmVcIiwgdGhpcy5ncmFwaE1vdmUoKSk7Ly90aGlzLmNoZWNrQXJlYSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cENsaWNrQWN0aXZpdHkgKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNFVFVQIGdyYXBoIGNsaWNrXCIpO1xuICAgICAgICBkMy5zZWxlY3QoXCIjc3RhZ2VcIikub24oXCJtb3VzZXVwXCIsIHRoaXMuZ3JhcGhVcCgpKTtcbiAgICAgICAgZDMuc2VsZWN0KFwiI3N0YWdlXCIpLm9uKFwibW91c2Vkb3duXCIsIHRoaXMuZ3JhcGhEb3duKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ3JhcGhNb3ZlKCkge1xuICAgICAgICAvLy8gJ3RoYXQnIGlzIHRoZSBpbnN0YW5jZSBvZiBncmFwaCBcbiAgICAgICAgY29uc3QgdGhhdCA6IEdyYXBoVHVja21hbkVudHJ5ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGQ6dm9pZCwgaTpudW1iZXIpIHtcbiAgICAgICAgICAgIC8vICd0aGlzJyBpcyB0aGUgRE9NIGVsZW1lbnQgXG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IFBvaW50LmZyb21Db29yZHMoZDMubW91c2UodGhpcykpO1xuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBjb29yZC54O1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IEdyYXBoVHVja21hbkVudHJ5LmNhbGN1bGF0ZURpc3RhbmNlKGRpc3RhbmNlKTtcbiAgICAgICAgICAgIHRoYXQuaGlnaGxpZ2h0KGFyZWEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBncmFwaFVwKCkge1xuICAgICAgICAvLyAndGhhdCcgaXMgdGhlIGluc3RhbmNlIG9mIGdyYXBoIFxuICAgICAgICBjb25zdCB0aGF0IDogR3JhcGhUdWNrbWFuRW50cnkgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZDp2b2lkLCBpIDpudW1iZXIpIHtcbiAgICAgICAgICAgIC8vICd0aGlzJyBpcyB0aGUgRE9NIGVsZW1lbnQgXG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IFBvaW50LmZyb21Db29yZHMoZDMubW91c2UodGhpcykpO1xuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBjb29yZC54O1xuICAgICAgICAgICAgY29uc3QgYXJlYSA9IEdyYXBoVHVja21hbkVudHJ5LmNhbGN1bGF0ZURpc3RhbmNlKGRpc3RhbmNlKTsgICAgICAgICAgXG4gICAgICAgICAgICB0aGF0LnNhdmVUaGVJbnRlcmFjdGlvbihhcmVhLCBkaXN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdyYXBoRG93bigpIHtcbiAgICAgICAgLy8gJ3RoYXQnIGlzIHRoZSBpbnN0YW5jZSBvZiBncmFwaCBcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkOnZvaWQsIGk6bnVtYmVyKSB7XG4gICAgICAgICAgICAvLyAndGhpcycgaXMgdGhlIERPTSBlbGVtZW50IFxuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBQb2ludC5mcm9tQ29vcmRzKGQzLm1vdXNlKHRoaXMpKTtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gU1ZHLmNpcmNsZSg4LCBjb29yZC54LCBjb29yZC55LCBcImRyb3BwZXJcIik7XG4gICAgICAgICAgICB0aGF0LmFkZERyb3BwZXIoZWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGhpZ2hsaWdodCAoYXJlYSA6IHN0cmluZykge1xuICAgICAgICAvLzxjaXJjbGUgaWQ9XCJzdHJldGNoXCIgcj1cIjMwMFwiIGN4PVwiNDAwXCIgY3k9XCI0MDBcIiAvPlxuICAgICAgICAvLzxjaXJjbGUgaWQ9XCJjb21mb3J0XCIgcj1cIjEwMFwiIGN4PVwiNDAwXCIgY3k9XCI0MDBcIiAvPlxuXG4gICAgXG4gICAgICAgIGNvbnN0IGQzem9uZXMgPSBkMy5zZWxlY3QoXCJzdmdcIilcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCIuYXJlYVwiKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgIC5kZWxheShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gYXJlYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDEwMDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5lYXNlKFwiY3ViaWNcIilcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAyNTA7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSBhcmVhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJyZ2IoMCwgMTgwLCAyMTkpXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiIzAwRDdGRVwiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG4gICAgXG5cbiAgICBwdWJsaWMgYWRkRHJvcHBlciAoZWwgOiBTVkdBRWxlbWVudCkgIHtcbiAgICAgICAgdGhpcy5kcm9wcGVyID0gZWw7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFnZScpLmluc2VydEJlZm9yZShlbCwgdGhpcy5jbGlja0FyZWEpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY2FsY3VsYXRlRGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICAgICAgaWYoZGlzdGFuY2UgPCAyMDApIHtcbiAgICAgICAgICAgIHJldHVybiBcImZvcm1pbmdcIjtcbiAgICAgICAgfSBlbHNlIGlmIChkaXN0YW5jZSA8IDQwMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwic3Rvcm1pbmdcIjtcbiAgICAgICAgfSBlbHNlIGlmIChkaXN0YW5jZSA8IDYwMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwibm9ybWluZ1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwicGVyZm9ybWluZ1wiO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgcmVtb3ZlSW50ZXJhY3Rpb25zICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSRU1PVkUgYWN0aXZpdGVpcyBmcm9tIEdyYXBoVHVja21hbkVudHJ5XCIpO1xuICAgICAgICBkMy5zZWxlY3QoXCIjc3RhZ2VcIikub24oXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVTkNMSUNLIC0gR3JhcGh1cCAtIE5vIGxvbmdlciBpbnRlcmFjdGl2ZSBzdGFnZVwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGQzLnNlbGVjdChcIiNzdGFnZVwiKS5vbihcIm1vdXNlZG93blwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVU5DTElDSyAtIEdyYXBoZG93biAtIE5vIGxvbmdlciBpbnRlcmFjdGl2ZSBzdGFnZVwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGQzLnNlbGVjdChcIiNzdGFnZVwiKS5vbihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVU5Nb3ZlIC0gbW91c2Vtb3ZlIC0gTm8gbG9uZ2VyIGludGVyYWN0aXZlIHN0YWdlXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfVxuICAgIHB1YmxpYyBzYXZlVGhlSW50ZXJhY3Rpb24gKGFyZWE6c3RyaW5nLCBkaXN0YW5jZTpudW1iZXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJzYXZlVGhlSW50ZXJhY3Rpb25cIik7XG4gICAgICAgIHRoaXMucmVtb3ZlSW50ZXJhY3Rpb25zKCk7XG5cbiAgICAgICAgLy9UT0RPOiBQdXQgaW4gdGhlIGxpbmUgYmVsb3dcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdzYXZlR3JhcGgnLCB7XG4gICAgICAgICAgICBcImRldGFpbFwiOiB7XG4gICAgICAgICAgICAgICAgXCJhcmVhXCI6YXJlYSxcbiAgICAgICAgICAgICAgICBcImRpc3RhbmNlXCI6ZGlzdGFuY2UsXG4gICAgICAgICAgICAgICAgXCJjdXJyZW50VXNlclwiOnRoaXMuY3VycmVudFVzZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAvL21lZGlhdG9yLnNhdmVHcmFwaCgpO1xuICAgIH1cbiAgICBwdWJsaWMgc2hvdyh1c2VyOlVzZXIpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgICAgIGNvbnN0IFRoZW5hYmxlID0gdGhpcy5zaG93QmFzZSgpO1xuICAgICAgICB0aGlzLnNldHVwT3ZlckFjdGl2aXR5KCk7XG4gICAgICAgIHJldHVybiBUaGVuYWJsZS50aGVuKHRoaXMuc2V0dXBDbGlja0FjdGl2aXR5LmJpbmQodGhpcykpO1xuICAgIH1cblxufSIsImltcG9ydCB7VXNlcn0gZnJvbSAnLi4vU2hhcmVkL1VzZXInO1xuXG5leHBvcnQgY2xhc3MgVHVja21hblVzZXJDaG9pY2Uge1xuICAgIHVzZXIgOiBVc2VyO1xuICAgIGRpc3RhbmNlIDogbnVtYmVyO1xuICAgIGFyZWEgOiBTdHJpbmc7XG4gICAgY29uc3RydWN0b3IodXNlciA6IFVzZXIsIGRpc3RhbmNlIDogbnVtYmVyLCBhcmVhIDogU3RyaW5nKSB7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICAgICAgdGhpcy5hcmVhID0gYXJlYTtcbiAgICB9XG59IiwiaW1wb3J0IHtUdWNrbWFuVXNlckNob2ljZX0gZnJvbSAnLi9UdWNrbWFuVXNlckNob2ljZSc7XG5pbXBvcnQge0dyYXBoVHVja21hbkJhc2V9IGZyb20gJy4vR3JhcGhUdWNrbWFuQmFzZSc7XG5pbXBvcnQge1BvaW50fSBmcm9tICcuLi9TaGFyZWQvUG9pbnQnO1xuaW1wb3J0IHtQb2xhcn0gZnJvbSAnLi4vU2hhcmVkL1BvbGFyJztcblxuXG5leHBvcnQgY2xhc3MgR3JhcGhUdWNrbWFuSGlzdG9yeSBleHRlbmRzIEdyYXBoVHVja21hbkJhc2Uge1xuICAgIFxuICAgIHB1YmxpYyBncmFwaERhdGEgPSBuZXcgQXJyYXk8VHVja21hblVzZXJDaG9pY2U+KCk7XG4gICAgcHVibGljIGQzUG9pbnRzO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpOyBcbiAgICAgICAgLy90aGlzLnNldHVwSGlzdG9yeSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93KGdyYXBoRGF0YSA6IEFycmF5PFR1Y2ttYW5Vc2VyQ2hvaWNlPik6VGhlbmFibGU8bnVtYmVyPiB7XG4gICAgICAgIHRoaXMuZ3JhcGhEYXRhID0gZ3JhcGhEYXRhO1xuICAgICAgICBjb25zdCBUaGVuYWJsZSA9IHRoaXMuc2hvd0Jhc2UoKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHRvdGFsUG9pbnRzID0gZ3JhcGhEYXRhLmxlbmd0aDtcbiAgICAgICAgY29uc3QgdG90YWxIZWlnaHQgPSA4MDA7XG4gICAgICAgIGNvbnN0IGhlaWdodERpdmlzaW9uID0gdG90YWxIZWlnaHQgLyB0b3RhbFBvaW50cztcbiAgICAgICAgXG4gICAgICAgIGQzLnNlbGVjdChcImcjaGlzdG9yeVwiKVxuICAgICAgICAgICAgLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLmRhdGEodGhpcy5ncmFwaERhdGEpXG4gICAgICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCAwKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgZnVuY3Rpb24oZGF0YTpUdWNrbWFuVXNlckNob2ljZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChoZWlnaHREaXZpc2lvbiAqIGluZGV4KSArIDEwMDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiclwiLCAxMClcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwicG9pbnRcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImlkXCIsIGZ1bmN0aW9uKGQ6VHVja21hblVzZXJDaG9pY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQudXNlci5uYW1lO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICBkMy5zZWxlY3QoXCJnI2hpc3RvcnlcIilcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gODAwO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgZnVuY3Rpb24oZGF0YTpUdWNrbWFuVXNlckNob2ljZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5kaXN0YW5jZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cihcImN5XCIsIGZ1bmN0aW9uKGRhdGE6VHVja21hblVzZXJDaG9pY2UsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChoZWlnaHREaXZpc2lvbiAqIGluZGV4KSArIDEwMDtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgVGhlbmFibGUudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTSE9XRUQgYmFzZSBncmFwaCAtIG5vdyB3aGF0P1wiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBUaGVuYWJsZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGlkZSgpOlRoZW5hYmxlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIEJyZWFkY3J1bWIge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBjb21tYW5kOiBzdHJpbmc7XG4gICAgcGFyYW1zOiBhbnk7XG4gICAgZW5hYmxlZDogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3RvcihuYW1lOnN0cmluZywgY29tbWFuZDpzdHJpbmcsIHBhcmFtczphbnkpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gY29tbWFuZDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cbn0iLCJcbmltcG9ydCB7QnJlYWRjcnVtYn0gZnJvbSAnLi9CcmVhZGNydW1iJztcbmV4cG9ydCBjbGFzcyBCcmVhZGNydW1iQ29udHJvbCB7XG4gICAgaXRlbXMgPSBuZXcgQXJyYXk8QnJlYWRjcnVtYj4oKTtcbiAgICBwdWJsaWMgYWRkQnJlYWRjcnVtYihuYW1lOnN0cmluZywgY29tbWFuZDpzdHJpbmcsIHBhcmFtczphbnkpIHtcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKG5ldyBCcmVhZGNydW1iKG5hbWUsIGNvbW1hbmQsIHBhcmFtcykpO1xuICAgIH1cbn0iLCJpbXBvcnQge1VzZXJ9IGZyb20gJy4vVXNlcic7XG5cbmV4cG9ydCBjbGFzcyBVc2VyQ29uc3RydWN0b3Ige1xuICAgIHN0YXRpYyBub3RFbXB0eShpbnB1dCkge1xuICAgICAgICByZXR1cm4gKGlucHV0ICE9PSBcIlwiKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZVVzZXJzQnlOYW1lcyhuYW1lczpBcnJheTxzdHJpbmc+KSA6IFVzZXJbXSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkID0gbmFtZXMuZmlsdGVyKFVzZXJDb25zdHJ1Y3Rvci5ub3RFbXB0eSk7XG4gICAgICAgIGNvbnN0IHVzZXJzID0gZmlsdGVyZWQubWFwKCh2LCBpKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVVc2VyKHYsaSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdXNlcnM7IFxuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlVXNlcihuYW1lOnN0cmluZywgaW5kZXg6bnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgVXNlcihuYW1lLCBcInVzZXJcIitpbmRleCk7XG4gICAgfVxufSIsImltcG9ydCB7VXNlcn0gZnJvbSAnLi9Vc2VyJztcbmltcG9ydCB7R2VuZXJpY0NhY2hlfSBmcm9tICcuL0NhY2hlJztcbmltcG9ydCB7SVVzZXJSZXBvfSBmcm9tICcuL0lVc2Vycyc7XG5pbXBvcnQge1VzZXJDb25zdHJ1Y3Rvcn0gZnJvbSAnLi9Vc2VyQ29uc3RydWN0b3InO1xuXG5leHBvcnQgY2xhc3MgSW5NZW1vcnlVc2VycyBpbXBsZW1lbnRzIElVc2VyUmVwbyB7XG4gICAgY2FjaGUgOiBHZW5lcmljQ2FjaGU7XG4gICAgXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY2FjaGUgPSBuZXcgR2VuZXJpY0NhY2hlKCk7XG4gICAgICAgIHZhciB1c2VycyA9IFVzZXJDb25zdHJ1Y3Rvci5jcmVhdGVVc2Vyc0J5TmFtZXMoW1xuICAgICAgICAgICAgXCJBZGFtIEhhbGxcIixcbiAgICAgICAgICAgIFwiQmlsbGllIERhdmV5XCIsXG4gICAgICAgICAgICBcIkxhdXJhIFJvd2VcIixcbiAgICAgICAgICAgIFwiU2ltb24gRGF3c29uXCJcbiAgICAgICAgXSk7IFxuICAgICAgICB0aGlzLnNldFVzZXJzKHVzZXJzKTtcbiAgICB9XG5cbiAgICBcblxuICAgIGFkZFVzZXIodXNlcjpVc2VyKSA6IFRoZW5hYmxlPFVzZXJbXT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZS5hZGQodXNlcik7XG4gICAgfVxuICAgIFxuICAgIGFkZFVzZXJCeU5hbWUobmFtZTpzdHJpbmcpIDogVGhlbmFibGU8VXNlcltdPiB7Ly9Eb24ndCB3YW50IHRoaXM/XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlLmFkZChVc2VyQ29uc3RydWN0b3IuY3JlYXRlVXNlcihuYW1lLCA5KSk7XG4gICAgfVxuXG4gICAgdXBkYXRlVXNlcih1c2VyOlVzZXIpIDogVGhlbmFibGU8VXNlcltdPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlLnVwZGF0ZSh1c2VyKTtcbiAgICB9XG4gICAgXG5cbiAgICBnZXRVc2VycygpIDogVGhlbmFibGU8QXJyYXk8VXNlcj4+ICB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlLmdldCgpO1xuICAgIH1cblxuICAgIGdldFVzZXIoaWQ6c3RyaW5nKSA6IFRoZW5hYmxlPFVzZXI+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGUuZ2V0QnlJZChpZCk7XG4gICAgfVxuXG4gICAgc2F2ZVVzZXIodXNlcjpVc2VyKSA6IFRoZW5hYmxlPFVzZXJbXT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZS51cGRhdGUodXNlcik7XG4gICAgfVxuXG4gICAgc2V0VXNlcnModXNlcnM6VXNlcltdKSA6IFRoZW5hYmxlPFVzZXJbXT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZS5zZXQodXNlcnMpO1xuICAgIH1cblxuICAgIFxufSIsImltcG9ydCB7VXNlcn0gZnJvbSAnLi9Vc2VyJztcbmltcG9ydCB7VGltZWR9IGZyb20gJy4vVGltZWQnO1xuaW1wb3J0IHtJVXNlclJlcG8sIEluTWVtb3J5VXNlcnN9IGZyb20gJy4vVXNlcnMnO1xuXG5leHBvcnQgY2xhc3MgRm9ybVVzZXJDaG9pY2Uge1xuICAgIHVzZXJab25lIDogSFRNTEVsZW1lbnQ7XG4gICAgdXNlclJlcG8gOiBJVXNlclJlcG87XG4gICAgZDNVc2VycyA6IGQzLlNlbGVjdGlvbjxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudXNlclJlcG8gPSBuZXcgSW5NZW1vcnlVc2VycygpOyAvL0RJIHRoaXNcbiAgICAgICAgdGhpcy51c2VyWm9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VycycpO1xuICAgICAgICB0aGlzLmQzVXNlcnMgPSBkMy5zZWxlY3QoXCJnI3VzZXJzXCIpO1xuICAgICAgICB0aGlzLnVzZXJSZXBvLmdldFVzZXJzKCkudGhlbigodXNlcnMpID0+IHtcbiAgICAgICAgICAgIGlmKHVzZXJzICYmIHVzZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBVc2Vycyh1c2Vycyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0VXNlcihpZCkgOiBUaGVuYWJsZTxVc2VyPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJSZXBvLmdldFVzZXIoaWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBtYXJrVXNlckRvbmUgKHVzZXI6VXNlcikge1xuICAgICAgICB1c2VyLnZvdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51c2VyUmVwby51cGRhdGVVc2VyKHVzZXIpLnRoZW4odXNlcnMgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWJpbmQodXNlcnMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFmdGVyU2hvdygpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFTkRTSE9XIFVzZXJDaG9jaWVGb3JtXCIpO1xuICAgICAgICB0aGlzLmQzVXNlcnNcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAgICAgICAub24oXCJtb3VzZXVwXCIsIHRoaXMuY2xpY2tVc2VyKCkpO1xuICAgIH1cbiAgICBwdWJsaWMgaGFzTW9yZVVzZXJzKCkgOiBUaGVuYWJsZTxib29sZWFuPiB7IC8vTW92ZSB0byB1c2VyIHJlcG8/XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVzZXJSZXBvLmdldFVzZXJzKCkudGhlbih1c2VycyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdW52b3RlZFVzZXJzID0gdXNlcnMuZmlsdGVyKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICF4LnZvdGVkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYodW52b3RlZFVzZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfVxuICAgIHB1YmxpYyBzaG93KCk6VGhlbmFibGU8bnVtYmVyPiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU0hPVyBVc2VyQ2hvY2llRm9ybVwiKTtcbiAgICAgICAgZDMuc2VsZWN0KHRoaXMudXNlclpvbmUpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA4MDA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsMSlcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwibWF0cml4KDEsMCwwLDEsMCwwKVwiKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZDNVc2Vycy5zZWxlY3RBbGwoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYoZS52b3RlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ1c2VyLWdyb3VwLWNvbXBsZXRlXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidXNlci1ncm91cFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIFRpbWVkLmZvcig4MDApLnRoZW4odGhpcy5hZnRlclNob3cuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIHB1YmxpYyBoaWRlICgpOlRoZW5hYmxlPG51bWJlcj4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhJREUgdXNlckVudHJ5XCIpO1xuICAgICAgICBkMy5zZWxlY3QodGhpcy51c2VyWm9uZSlcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDgwMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwwKVxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJtYXRyaXgoMiwwLDAsMiwtNDAwLC05MClcIik7XG4gICAgICAgIGQzLnNlbGVjdChcImcjdXNlcnNcIilcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAgICAgICAub24oXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5PQ0xJQ0sgVXNlciAtIFRoaXMgd2FzIGNsaWNrZWQsIGJ1dCBpZ25vcmVkXCIsIHRoaXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBUaW1lZC5mb3IoODAwKTtcbiAgICAgICAgXG4gICAgfVxuICAgIHByaXZhdGUgcmViaW5kKHVzZXJzOlVzZXJbXSk6IGQzLnNlbGVjdGlvbi5VcGRhdGU8VXNlcj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kM1VzZXJzXG4gICAgICAgICAgICAgICAgLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgIC5kYXRhKHVzZXJzKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjbGlja1VzZXIgKCkge1xuICAgICAgICAvLyAndGhhdCcgaXMgdGhlIGluc3RhbmNlIG9mIGdyYXBoIFxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGQ6VXNlciwgaTpudW1iZXIpIHtcbiAgICAgICAgICAgIC8vICd0aGlzJyBpcyB0aGUgRE9NIGVsZW1lbnQgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNMSUNLIC0gVXNlciAtIHVwICBVc2VyQ2hvY2llRm9ybVwiKTtcbiAgICAgICAgICAgIC8vY29uc3QgbmFtZSA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1uYW1lXCIpO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG5cbiAgICAgICAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnc2VsZWN0VXNlcicsIHsgXCJkZXRhaWxcIjoge1wiaWRcIjogaWR9IH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoaXMgd2FzIGNsaWNrZWRcIiwgdGhhdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBvdmVyVXNlciAoKSB7XG4gICAgICAgIC8vICd0aGF0JyBpcyB0aGUgaW5zdGFuY2Ugb2YgZ3JhcGggXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZDpVc2VyLCBpOm51bWJlcikge1xuICAgICAgICAgICAgLy8gJ3RoaXMnIGlzIHRoZSBET00gZWxlbWVudCBcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUpXG4gICAgICAgICAgICAvL2NvbnN0IGQzem9uZXMgPSBkMy5zZWxlY3QoXCJnI3VzZXJzXCIpXG4gICAgICAgICAgICAgICAgLnNlbGVjdEFsbChcInRleHRcIilcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKDI1MClcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCIjMDBEN0ZFXCI7ICBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGxlYXZlVXNlcigpIHtcbiAgICAgICAgLy8gJ3RoYXQnIGlzIHRoZSBpbnN0YW5jZSBvZiBncmFwaCBcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkOlVzZXIsIGk6bnVtYmVyKSB7XG4gICAgICAgICAgICAvLyAndGhpcycgaXMgdGhlIERPTSBlbGVtZW50IFxuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSlcbiAgICAgICAgICAgIC8vY29uc3QgZDN6b25lcyA9IGQzLnNlbGVjdChcImcjdXNlcnNcIilcbiAgICAgICAgICAgICAgICAuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZHVyYXRpb24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAyNTA7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJncmV5XCI7ICAgIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgZWFjaFVzZXIgKCkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUsIGkpIHtcbiAgICAgICAgICAgIC8vRXZlbnQuYWRkKFsnbW91c2Vkb3duJ10sIHRoaXMuc3RhZ2UsIHRoaXMuY2hvb3NlVXNlcik7XG4gICAgICAgICAgICAvL0V2ZW50LmFkZChbXCJtb3VzZW92ZXJcIl0sIHRoaXMsIHRoaXNTdGFnZS5jaGVja092ZXJVc2Vycyk7XG4gICAgICAgICAgICBjb25zdCBkM0l0ZW0gPSBkMy5zZWxlY3QodGhpcyk7XG5cbiAgICAgICAgICAgIGQzSXRlbS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDYwICsgKGkgKiA5MCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgMClcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDgwMClcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCA5MClcbiAgICAgICAgICAgICAgICAuYXR0cihcImRhdGEtbmFtZVwiLCBlLm5hbWUpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJkYXRhLWlkXCIsIGUuaWQpXG4gICAgICAgICAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIHRoYXQub3ZlclVzZXIoKSlcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZWxlYXZlXCIsIHRoYXQubGVhdmVVc2VyKCkpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBkM0l0ZW0uYXBwZW5kKFwidGV4dFwiKSAgICAgIFxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ1c2VybmFtZVwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAzMCArICgoaSArIDEpICogOTApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDYwKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZGF0YS1uYW1lXCIsIGUubmFtZSlcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgNjApXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1mYW1pbHlcIiwgXCJTaGFyZSBUZWNoIE1vbm9cIilcbiAgICAgICAgICAgICAgICAudGV4dChmdW5jdGlvbihqKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlLm5hbWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHVibGljIGFkZFVzZXIodXNlcjpVc2VyKSB7XG4gICAgICAgIHRoaXMudXNlclJlcG8uYWRkVXNlcih1c2VyKS50aGVuKHVzZXJzID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBVc2Vycyh1c2Vycyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc2V0VXNlcnModXNlcnM6QXJyYXk8VXNlcj4pIHtcbiAgICAgICAgdGhpcy5kZXN0cm95VXNlcnMoKTtcbiAgICAgICAgdGhpcy51c2VyUmVwby5zZXRVc2Vycyh1c2VycykudGhlbigodXNlcnMpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBVc2Vycyh1c2Vycyk7XG4gICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHByaXZhdGUgZGVzdHJveVVzZXJzKCkge1xuICAgICAgICBkMy5zZWxlY3QoXCJnI3VzZXJzXCIpLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cFVzZXJzICh1c2VyczpVc2VyW10pIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLnJlYmluZCh1c2Vycyk7XG4gICAgICAgIGl0ZW1zLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLmlkO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5lYWNoKHRoaXMuZWFjaFVzZXIoKSk7XG4gICAgfVxuXG4gICAgXG59IiwiaW1wb3J0IHtUdWNrbWFuVXNlckNob2ljZX0gZnJvbSAnLi9UdWNrbWFuVXNlckNob2ljZSc7XG5pbXBvcnQge0JyZWFkY3J1bWJDb250cm9sfSBmcm9tICcuLi9TaGFyZWQvQnJlYWRjcnVtYkNvbnRyb2wnO1xuaW1wb3J0IHtVc2VyfSBmcm9tICcuLi9TaGFyZWQvVXNlcic7XG5pbXBvcnQge0Zvcm1Vc2VyQ2hvaWNlfSBmcm9tICcuLi9TaGFyZWQvRm9ybVVzZXJDaG9pY2UnO1xuaW1wb3J0IHtHcmFwaFR1Y2ttYW5FbnRyeX0gZnJvbSAnLi9HcmFwaFR1Y2ttYW5FbnRyeSc7XG5pbXBvcnQge0dyYXBoVHVja21hbkhpc3Rvcnl9IGZyb20gJy4vR3JhcGhUdWNrbWFuSGlzdG9yeSc7XG5cblxuZXhwb3J0IGNsYXNzIE1lZGlhdG9yIHtcblxuICAgIHVzZXJDaG9pY2VIaXN0b3J5IDogQXJyYXk8VHVja21hblVzZXJDaG9pY2U+O1xuICAgIGZvcm1Vc2VyQ2hvaWNlIDogRm9ybVVzZXJDaG9pY2U7XG4gICAgZ3JhcGhUdWNrbWFuRW50cnkgOiBHcmFwaFR1Y2ttYW5FbnRyeTtcbiAgICBncmFwaFR1Y2ttYW5IaXN0b3J5OiBHcmFwaFR1Y2ttYW5IaXN0b3J5O1xuICAgIGJyZWFkY3J1bWJDb250cm9sOiBCcmVhZGNydW1iQ29udHJvbDtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTVEFSVCBldmVyeXRoaW5nXCIpO1xuICAgICAgICB0aGlzLnVzZXJDaG9pY2VIaXN0b3J5ID0gbmV3IEFycmF5PFR1Y2ttYW5Vc2VyQ2hvaWNlPigpO1xuICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlID0gbmV3IEZvcm1Vc2VyQ2hvaWNlKCk7XG4gICAgICAgIHRoaXMuYnJlYWRjcnVtYkNvbnRyb2wgPSBuZXcgQnJlYWRjcnVtYkNvbnRyb2woKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZG8oY29tbWFuZDpzdHJpbmcsIHBhcmFtczphbnkpIHtcbiAgICAgICAgc3dpdGNoIChjb21tYW5kKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIFwiYWRkVXNlclwiOlxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVXNlcihwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNldFVzZXJzXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVc2VycyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNhdmVUdWNrbWFuRmVlZGJhY2tcIjpcbiAgICAgICAgICAgICAgICBjb25zdCBhcmVhID0gcGFyYW1zLmFyZWE7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBwYXJhbXMubnVtYmVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBwYXJhbXMudXNlcjtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVHcmFwaChhcmVhLCBkaXN0YW5jZSwgdXNlcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2hvd1VzZXJDaG9pY2VcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dVc2VyQ2hvaWNlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2hvd0dyYXBoVHVja21hbkhpc3RvcnlcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dHcmFwaFR1Y2ttYW5IaXN0b3J5KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2hvd0dyYXBoVHVja21hbkNob2ljZVwiOlxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbWZvcnR1c2VyOlVzZXIgPSBwYXJhbXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93R3JhcGhUdWNrbWFuRW50cnkoY29tZm9ydHVzZXIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHVibGljIGFkZFVzZXIodXNlcjpVc2VyKSB7XG4gICAgICAgIHRoaXMuZm9ybVVzZXJDaG9pY2UuYWRkVXNlcih1c2VyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0VXNlcnModXNlcnM6QXJyYXk8VXNlcj4pIHtcbiAgICAgICAgdGhpcy5mb3JtVXNlckNob2ljZS5zZXRVc2Vycyh1c2Vycyk7XG4gICAgfVxuXG4gICAgcHVibGljIHNob3dVc2VyQ2hvaWNlKCkge1xuICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlLnNob3coKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3dHcmFwaFR1Y2ttYW5FbnRyeSh1c2VyOlVzZXIpIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JhcGhUdWNrbWFuRW50cnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhUdWNrbWFuRW50cnkgPSBuZXcgR3JhcGhUdWNrbWFuRW50cnkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyYXBoVHVja21hbkVudHJ5LnNob3codXNlcik7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzaG93VHVja21hbkhpc3RvcnkoaGlzdG9yeSkge1xuICAgICAgICB2YXIgYWZ0ZXJIaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgIGlmKCF0aGlzLmdyYXBoVHVja21hbkhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoVHVja21hbkVudHJ5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoVHVja21hbkhpc3RvcnkgPSBuZXcgR3JhcGhUdWNrbWFuSGlzdG9yeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ncmFwaFR1Y2ttYW5IaXN0b3J5LnNob3coaGlzdG9yeSk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuZ3JhcGhUdWNrbWFuRW50cnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhUdWNrbWFuRW50cnkuaGlkZSgpLnRoZW4oYWZ0ZXJIaWRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMuZm9ybVVzZXJDaG9pY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFmdGVySGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgc2hvd0dyYXBoVHVja21hbkhpc3RvcnkoKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyYXBoVHVja21hbkhpc3RvcnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhUdWNrbWFuRW50cnkgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5ncmFwaFR1Y2ttYW5IaXN0b3J5ID0gbmV3IEdyYXBoVHVja21hbkhpc3RvcnkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyYXBoVHVja21hbkhpc3Rvcnkuc2hvdyh0aGlzLnVzZXJDaG9pY2VIaXN0b3J5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VsZWN0VXNlcihpZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFDVElPTiBzZWxlY3RVc2VyXCIsIGlkKTtcbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMuZm9ybVVzZXJDaG9pY2UuZ2V0VXNlcihpZCkudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtVXNlckNob2ljZS5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLnNob3dHcmFwaFR1Y2ttYW5FbnRyeSh1c2VyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHB1YmxpYyBzYXZlR3JhcGgoYXJlYTpzdHJpbmcsIGRpc3RhbmNlOm51bWJlciwgdXNlcjpVc2VyKSB7XG4gICAgICAgIHRoaXMuZm9ybVVzZXJDaG9pY2UubWFya1VzZXJEb25lKHVzZXIpO1xuICAgICAgICB0aGlzLmFkZFVzZXJDaG9pY2VIaXN0b3J5KGFyZWEsIGRpc3RhbmNlLCB1c2VyKTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRVc2VyQ2hvaWNlSGlzdG9yeShhcmVhOnN0cmluZywgZGlzdGFuY2U6bnVtYmVyLCB1c2VyOlVzZXIpIHtcbiAgICAgICAgY29uc3QgdGhpc1VzZXJDaG9pY2UgPSB0aGlzLnVzZXJDaG9pY2VIaXN0b3J5LmZpbHRlcihmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICByZXR1cm4geC51c2VyLmlkID09PSB1c2VyLmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYodGhpc1VzZXJDaG9pY2UubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzVXNlckNob2ljZVswXS5hcmVhID0gYXJlYTtcbiAgICAgICAgICAgIHRoaXNVc2VyQ2hvaWNlWzBdLmRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyQ2hvaWNlID0gbmV3IFR1Y2ttYW5Vc2VyQ2hvaWNlKHVzZXIsZGlzdGFuY2UsYXJlYSk7XG4gICAgICAgICAgICB0aGlzLnVzZXJDaG9pY2VIaXN0b3J5LnB1c2godXNlckNob2ljZSk7XG4gICAgICAgIH1cbiAgICB9ICBcblxuICAgIHByaXZhdGUgbmV4dCgpIHtcbiAgICAgICAgLy9jb25zdCBwcm9tID0gbmV3IFByb21zaWUoKVxuICAgICAgICBjb25zb2xlLmxvZyhcIkFDVElPTiBuZXh0VXNlclwiLCB0aGlzKTtcbiAgICAgICAgdmFyIGFmdGVySGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5mb3JtVXNlckNob2ljZS5oYXNNb3JlVXNlcnMoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXJzIGxlZnQuLi5cIiwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1VzZXJDaG9pY2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5PIHVzZXJzIGxlZnRcIiwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0dyYXBoVHVja21hbkhpc3RvcnkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmdyYXBoVHVja21hbkVudHJ5LmhpZGUoKS50aGVuKGFmdGVySGlkZSk7XG4gICAgfVxuXG4gICAgLy9zZXR1cFVzZXJzXG4gICAgLy9cbn0iLCJpbXBvcnQge0lBbGxSZXBvc3Rpb3J5fSBmcm9tICcuL0lVc2Vycyc7XG5cbmV4cG9ydCBjbGFzcyBCcm93c2VyUmVwbzxUPiBpbXBsZW1lbnRzIElBbGxSZXBvc3Rpb3J5PFQ+IHtcbiAgICBrZXkgOiBzdHJpbmc7XG4gICAgYnIgOiBXaW5kb3c7XG4gICAgY29uc3RydWN0b3IgKGtleTpzdHJpbmcsIHdpbmRvdzpXaW5kb3cpIHtcbiAgICAgICAgdGhpcy5iciA9IHdpbmRvdztcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgfVxuICAgIGdldCgpIDogVGhlbmFibGU8VD4ge1xuICAgICAgICBjb25zdCB0ZXh0IDogc3RyaW5nID0gdGhpcy5ici5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmtleSk7XG4gICAgICAgIGNvbnN0IGpzb24gOiBUID0gSlNPTi5wYXJzZSh0ZXh0KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShqc29uKTtcbiAgICB9XG4gICAgc2F2ZSh0aGluZzpUKSA6ICBUaGVuYWJsZTxUPntcbiAgICAgICAgY29uc3QgdGV4dCA9IEpTT04uc3RyaW5naWZ5KHRoaW5nKTtcbiAgICAgICAgdGhpcy5ici5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmtleSwgdGV4dCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpbmcpO1xuICAgIH1cblxufSIsImltcG9ydCB7VXNlcn0gZnJvbSAnLi9Vc2VyJztcbmltcG9ydCB7QnJvd3NlclJlcG99IGZyb20gJy4vQnJvd3NlclJlcG8nO1xuaW1wb3J0IHtJQWxsUmVwb3N0aW9yeSwgSUFsbFVzZXJSZXBvc3Rpb3J5fSBmcm9tICcuL0lVc2Vycyc7XG5cblxuZXhwb3J0IGNsYXNzIEJyb3dzZXJVc2VycyBpbXBsZW1lbnRzIElBbGxVc2VyUmVwb3N0aW9yeSB7XG4gICAgcmVwbyA6IElBbGxSZXBvc3Rpb3J5PFVzZXJbXT47XG4gICAgY29uc3RydWN0b3Iod2luZG93OldpbmRvdykge1xuICAgICAgICB0aGlzLnJlcG8gPSBuZXcgQnJvd3NlclJlcG88VXNlcltdPihcInVzZXJzXCIsIHdpbmRvdyk7XG4gICAgfVxuXG4gICAgZ2V0VXNlcnMoKSA6IFRoZW5hYmxlPFVzZXJbXT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBvLmdldCgpO1xuICAgIH1cblxuICAgIHNhdmVVc2Vycyh1c2VyczpVc2VyW10pIDogIFRoZW5hYmxlPFVzZXJbXT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBvLnNhdmUodXNlcnMpO1xuICAgIH0gXG59IiwiXG5pbXBvcnQge1VzZXJ9IGZyb20gJy4vVXNlcic7XG5pbXBvcnQge0luTWVtb3J5VXNlcnN9IGZyb20gJy4vVXNlcnMnO1xuaW1wb3J0IHtCcm93c2VyVXNlcnN9IGZyb20gJy4vQnJvd3NlclVzZXJzJztcbmltcG9ydCB7SUFsbFVzZXJSZXBvc3Rpb3J5LCBJVXNlclJlcG99IGZyb20gJy4vSVVzZXJzJztcblxuZXhwb3J0IGNsYXNzIEluTWVtb3J5QnJvd3NlclVzZXJzIGltcGxlbWVudHMgSVVzZXJSZXBvICB7XG4gICAgY2FjaGU6SW5NZW1vcnlVc2VycztcbiAgICByZXBvOklBbGxVc2VyUmVwb3N0aW9yeTtcbiAgICBjb25zdHJ1Y3Rvcih3aW5kb3c6V2luZG93KSB7XG4gICAgICAgIHRoaXMuY2FjaGUgPSBuZXcgSW5NZW1vcnlVc2VycygpO1xuICAgICAgICB0aGlzLnJlcG8gPSBuZXcgQnJvd3NlclVzZXJzKHdpbmRvdyk7XG4gICAgfVxuICAgIHVwZGF0ZVVzZXIodXNlcjpVc2VyKSA6IFRoZW5hYmxlPFVzZXJbXT4ge1xuICAgICAgICBjb25zdCBwcm9tID0gdGhpcy5jYWNoZS51cGRhdGVVc2VyKHVzZXIpO1xuICAgICAgICBwcm9tLnRoZW4odXNlcnMgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXBvLnNhdmVVc2Vycyh1c2Vycyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbTtcbiAgICB9XG4gICAgYWRkVXNlcih1c2VyOlVzZXIpIDogVGhlbmFibGU8VXNlcltdPiB7XG4gICAgICAgIGNvbnN0IHByb20gPSB0aGlzLmNhY2hlLmFkZFVzZXIodXNlcik7XG4gICAgICAgIHByb20udGhlbih1c2VycyA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlcG8uc2F2ZVVzZXJzKHVzZXJzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9tO1xuICAgIH1cbiAgICBnZXRVc2VycygpIDogVGhlbmFibGU8VXNlcltdPiB7XG4gICAgICAgIGNvbnN0IHByb20gPSB0aGlzLnJlcG8uZ2V0VXNlcnMoKTtcbiAgICAgICAgcHJvbS50aGVuKHVzZXJzID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuc2V0VXNlcnModXNlcnMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb207XG4gICAgfVxuICAgIGdldFVzZXIoaWQ6c3RyaW5nKSA6IFRoZW5hYmxlPFVzZXI+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5jYWNoZS5nZXRVc2VyKGlkKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHQpO1xuICAgIH1cbiAgICBzZXRVc2Vycyh1c2VyczpVc2VyW10pIDogVGhlbmFibGU8VXNlcltdPiB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBwcm9tQ2FjaGUgPSB0aGlzLmNhY2hlLnNldFVzZXJzKHVzZXJzKTtcbiAgICAgICAgY29uc3QgcHJvbVJlcG8gPSB0aGlzLnJlcG8uc2F2ZVVzZXJzKHVzZXJzKTtcbiAgICAgICAgcmV0dXJuIHByb21DYWNoZTtcbiAgICB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvZDMvZDMuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9lczYtcHJvbWlzZS9lczYtcHJvbWlzZS5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvcmVxdWlyZWpzL3JlcXVpcmUuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9TaGFyZWQvVXNlci50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9TaGFyZWQvSW5NZW1vcnlCcm93c2VyVXNlcnMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vVHVja21hbi9NZWRpYXRvci50c1wiLz5cblxuXG52YXIgbWVkaWF0b3IsXG4gICAgdXNlckxvYWRlcjtcbnJlcXVpcmVqcy5jb25maWcoIHtcbiAgICBiYXNlVXJsIDogJy8nXG59KTtcbnJlcXVpcmUoWydUdWNrbWFuL01lZGlhdG9yJywnU2hhcmVkL1VzZXInLCdTaGFyZWQvSW5NZW1vcnlCcm93c2VyVXNlcnMnXSwgZnVuY3Rpb24obSx1LGIpIHtcbiAgICBjb25zb2xlLmxvZyhcIlN0YXJ0aW5nXCIpO1xuICAgIG1lZGlhdG9yID0gbmV3IG0uTWVkaWF0b3IoMjMsMjMpO1xuICAgIHVzZXJMb2FkZXIgPSBuZXcgYi5Jbk1lbW9yeUJyb3dzZXJVc2Vycyh3aW5kb3cpO1xuICAgIGNvbnNvbGUubG9nKG1lZGlhdG9yKTtcbiAgICB1c2VyTG9hZGVyLmdldFVzZXJzKCkudGhlbihmdW5jdGlvbih1c2Vycykge1xuICAgICAgICBpZih1c2Vycykge1xuICAgICAgICAgICAgbWVkaWF0b3Iuc2V0VXNlcnModXNlcnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVkaWF0b3Iuc2V0VXNlcnMoW1xuICAgICAgICAgICAgICAgIG5ldyB1LlVzZXIoXCJBZGFtIEhhbGxcIixcInh4eDFcIiksIFxuICAgICAgICAgICAgICAgIG5ldyB1LlVzZXIoXCJCaWxsaWUgRGF2ZXlcIixcInh4eDJcIiksIFxuICAgICAgICAgICAgICAgIG5ldyB1LlVzZXIoXCJMYXVyYSBSb3dlXCIsXCJ4eHgzXCIpLFxuICAgICAgICAgICAgICAgIG5ldyB1LlVzZXIoXCJTaW1vbiBEYXdzb25cIixcInh4eDRcIilcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzZWxlY3RVc2VyXCIsIGZ1bmN0aW9uKGU6Q3VzdG9tRXZlbnQpIHtcbiAgICAgICAgbWVkaWF0b3Iuc2VsZWN0VXNlcihlLmRldGFpbC5pZCk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNhdmVHcmFwaFwiLCBmdW5jdGlvbihlOkN1c3RvbUV2ZW50KSB7XG4gICAgICAgIHZhciBvID0gZS5kZXRhaWw7XG4gICAgICAgIG1lZGlhdG9yLnNhdmVHcmFwaChvLmFyZWEsby5kaXN0YW5jZSxvLmN1cnJlbnRVc2VyKTtcbiAgICB9KTtcbiAgICAgICAgICAgIC8vO1wiKVxuICAgIGNvbnNvbGUubG9nKG1lZGlhdG9yKTtcbn0pO1xuLypcbkNvbW1hbmRzIHlvdSBjYW4gdGhyb3cgaW50byB0aGUgbWVkaWF0b3IuLi4uXG5cbm1lZGlhdG9yLnNldFVzZXJzKFtcbiAgIHtuYW1lOlwiTmlnZWwgSGFsbFwiLGlkOlwiMXh4MFwifSwgXG4gICB7bmFtZTpcIkZyZWQgSGFsbFwiLGlkOlwiMXh4MVwifSwgXG4gICB7bmFtZTpcIkJvYiBIYWxsXCIsaWQ6XCIxeHgyXCJ9IFxuXSk7XG5cbm1lZGlhdG9yLmFkZFVzZXIoe25hbWU6XCJNYW5keVwiLCBpZDpcIjk4MTI5ODEyOVwifSlcblxuKi9cblxuLy9pbXBvcnQge01lZGlhdG9yfSBmcm9tICdNZWRpYXRvcic7XG4vL2ltcG9ydCB7VXNlcn0gZnJvbSAnVXNlcic7XG5cblxuLy9jb25zdCBzdGFnZSA9IG5ldyBDb21mb3J0LlN0YWdlKCk7XG4vL2NvbnN0IG1lZGlhdG9yID0gbmV3IE1lZGlhdG9yKCk7XG4vKm1lZGlhdG9yLnNldFVzZXJzKFtcbiAgIFxuXSk7Ki9cbi8vZXhwb3J0IG1lZGlhdG9yO1xuXG4iLCJpbXBvcnQge1R1Y2ttYW5Vc2VyQ2hvaWNlfSBmcm9tICcuL1R1Y2ttYW5Vc2VyQ2hvaWNlJztcblxuZXhwb3J0IGNsYXNzIFR1Y2ttYW5Vc2VyQ2hvaWNlSGlzdG9yeSB7XG4gICAgZGF0ZSA6RGF0ZTtcbiAgICBkYXRhIDogQXJyYXk8VHVja21hblVzZXJDaG9pY2U+O1xufSJdfQ==
