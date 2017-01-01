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
            _super.call(this);
            this.clickArea = document.getElementById('clickable');
            this.setupOverActivity();
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
            _super.call(this);
            this.graphData = new Array();
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
define("Shared/Users", ["require", "exports", "Shared/User", "Shared/Cache"], function (require, exports, User_1, Cache_1) {
    "use strict";
    var InMemoryUsers = (function () {
        function InMemoryUsers() {
            this.cache = new Cache_1.GenericCache();
            this.setUsersByName([
                "Adam Hall",
                "Billie Davey",
                "Laura Rowe",
                "Simon Dawson"
            ]);
        }
        InMemoryUsers.prototype.createUser = function (name, index) {
            return new User_1.User(name, "user" + index);
        };
        InMemoryUsers.prototype.addUser = function (user) {
            return this.cache.add(user);
        };
        InMemoryUsers.prototype.addUserByName = function (name) {
            return this.cache.add(this.createUser(name, 9));
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
        InMemoryUsers.prototype.setUsersByName = function (names) {
            var _this = this;
            var users = names.map(function (v, i) {
                return _this.createUser(v, i);
            });
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
                        reject(false);
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
                if (this.formUserChoice.hasMoreUsers()) {
                    console.log("Users left...", this);
                    this.showUserChoice();
                }
                else {
                    console.log("NO users left", this);
                    this.showGraphTuckmanHistory();
                }
            }.bind(this);
            this.graphTuckmanEntry.hide().then(afterHide);
        };
        return Mediator;
    }());
    exports.Mediator = Mediator;
});
define("Tuckman/TuckmanUserChoiceHistory", ["require", "exports"], function (require, exports) {
    "use strict";
    var TuckmanUserChoiceHistory = (function () {
        function TuckmanUserChoiceHistory() {
        }
        return TuckmanUserChoiceHistory;
    }());
    exports.TuckmanUserChoiceHistory = TuckmanUserChoiceHistory;
});
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
var mediator;
requirejs.config({
    baseUrl: '/'
});
require(['Tuckman/Mediator', 'Shared/User'], function (m, u) {
    console.log("Starting");
    mediator = new m.Mediator(23, 23);
    console.log(mediator);
    mediator.setUsers([
        new u.User("Adam Hall", "xxx1"),
        new u.User("Billie Davey", "xxx2"),
        new u.User("Laura Rowe", "xxx3"),
        new u.User("Simon Dawson", "xxx4")
    ]);
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
//# sourceMappingURL=compiled.js.map