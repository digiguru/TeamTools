var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("Breadcrumb", ["require", "exports"], function (require, exports) {
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
define("BreadcrumbControl", ["require", "exports", "Breadcrumb"], function (require, exports, Breadcrumb_1) {
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
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="Polar.ts"/>
//import {Promise} from 'es6-promise';
//import {Point} from 'Point';
//import {Point} from './Point';
//import {Polar} from './Polar';
var mediator;
require(['Mediator', 'User'], function (m, u) {
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
define("User", ["require", "exports"], function (require, exports) {
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
define("ComfortUserChoice", ["require", "exports"], function (require, exports) {
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
define("ComfortUserChoiceHistory", ["require", "exports"], function (require, exports) {
    "use strict";
    var ComfortUserChoiceHistory = (function () {
        function ComfortUserChoiceHistory() {
        }
        return ComfortUserChoiceHistory;
    }());
    exports.ComfortUserChoiceHistory = ComfortUserChoiceHistory;
});
define("ComfortZones", ["require", "exports"], function (require, exports) {
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
define("Timed", ["require", "exports"], function (require, exports) {
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
define("FormUserChoice", ["require", "exports", "Timed"], function (require, exports, Timed_1) {
    "use strict";
    var FormUserChoice = (function () {
        function FormUserChoice() {
            this.users = [];
            this.userZone = document.getElementById('users');
            this.d3Users = d3.select("g#users");
            if (this.users && this.users.length) {
                this.setupUsers();
                this.show();
            }
        }
        FormUserChoice.prototype.getUser = function (id) {
            var users = this.users.filter(function (x) {
                return x.id === id;
            });
            if (users.length) {
                return users[0];
            }
            throw Error("Cannot find user " + id);
        };
        FormUserChoice.prototype.markUserDone = function (user) {
            for (var i = 0; i < this.users.length; i++) {
                if (user.id === this.users[i].id) {
                    user.voted = true;
                }
            }
            this.rebind();
        };
        FormUserChoice.prototype.afterShow = function () {
            console.log("ENDSHOW UserChocieForm");
            this.d3Users
                .selectAll("rect")
                .on("mouseup", this.clickUser());
        };
        FormUserChoice.prototype.hasMoreUsers = function () {
            var unvotedUsers = this.users.filter(function (x) {
                return !x.voted;
            });
            return unvotedUsers.length;
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
        FormUserChoice.prototype.rebind = function () {
            return this.d3Users
                .selectAll("circle")
                .data(this.users);
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
            this.users.push(user);
            this.setupUsers();
        };
        FormUserChoice.prototype.setUsers = function (users) {
            this.destroyUsers();
            this.users = users;
            this.setupUsers();
            this.show();
        };
        FormUserChoice.prototype.destroyUsers = function () {
            d3.select("g#users").selectAll("*").remove();
        };
        FormUserChoice.prototype.setupUsers = function () {
            var items = this.rebind();
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
//import Polar = require('Polar');
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
//});
define("GraphComfortBase", ["require", "exports", "Timed", "ComfortZones", "Point"], function (require, exports, Timed_2, ComfortZones_1, Point_1) {
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
define("SVG", ["require", "exports"], function (require, exports) {
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
define("GraphComfortEntry", ["require", "exports", "GraphComfortBase", "Point", "SVG"], function (require, exports, GraphComfortBase_1, Point_2, SVG_1) {
    "use strict";
    var GraphComfortEntry = (function (_super) {
        __extends(GraphComfortEntry, _super);
        function GraphComfortEntry() {
            _super.call(this);
            this.clickArea = document.getElementById('clickable');
            this.setupOverActivity();
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
define("GraphComfortHistory", ["require", "exports", "GraphComfortBase", "Point", "Polar"], function (require, exports, GraphComfortBase_2, Point_3, Polar_2) {
    "use strict";
    var GraphComfortHistory = (function (_super) {
        __extends(GraphComfortHistory, _super);
        function GraphComfortHistory() {
            _super.call(this);
            this.graphData = new Array();
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
define("Mediator", ["require", "exports", "ComfortUserChoice", "BreadcrumbControl", "FormUserChoice", "GraphComfortEntry", "GraphComfortHistory"], function (require, exports, ComfortUserChoice_1, BreadcrumbControl_1, FormUserChoice_1, GraphComfortEntry_1, GraphComfortHistory_1) {
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
            console.log("ACTION selectUser", id);
            var user = this.formUserChoice.getUser(id);
            this.formUserChoice.hide();
            this.showGraphComfortEntry(user);
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
                if (this.formUserChoice.hasMoreUsers()) {
                    console.log("Users left...", this);
                    this.showUserChoice();
                }
                else {
                    console.log("NO users left", this);
                    this.showGraphComfortHistory();
                }
            }.bind(this);
            this.graphComfortEntry.hide().then(afterHide);
        };
        return Mediator;
    }());
    exports.Mediator = Mediator;
});
//# sourceMappingURL=compiled.js.map