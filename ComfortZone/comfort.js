/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//import {Promise} from 'es6-promise';
var Comfort;
(function (Comfort) {
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
    Comfort.Timed = Timed;
    var User = (function () {
        function User(name, id) {
            this.name = name;
            this.id = id;
            this.voted = false;
        }
        return User;
    }());
    Comfort.User = User;
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
            return new Polar(radius, angle);
        };
        return Point;
    }());
    Comfort.Point = Point;
    var ComfortUserChoiceHistory = (function () {
        function ComfortUserChoiceHistory() {
        }
        return ComfortUserChoiceHistory;
    }());
    Comfort.ComfortUserChoiceHistory = ComfortUserChoiceHistory;
    var ComfortUserChoice = (function () {
        function ComfortUserChoice(user, distance, area) {
            this.user = user;
            this.distance = distance;
            this.area = area;
        }
        return ComfortUserChoice;
    }());
    Comfort.ComfortUserChoice = ComfortUserChoice;
    var Polar = (function () {
        function Polar(radius, angle) {
            this.radius = radius;
            this.angle = angle;
        }
        return Polar;
    }());
    Comfort.Polar = Polar;
    var GraphComfortBase = (function () {
        function GraphComfortBase() {
            this.setupArea();
        }
        GraphComfortBase.prototype.setupArea = function () {
            var zones = [new ComfortZones("stretch", 300), new ComfortZones("comfort", 100)];
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
            this.centerPoint = new Point(centerX, centerY);
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
            return Timed.for(1000);
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
            return Timed.for(1000);
        };
        return GraphComfortBase;
    }());
    Comfort.GraphComfortBase = GraphComfortBase;
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
            /* 'that' is the instance of graph */
            var that = this;
            return function (d, i) {
                /* 'this' is the DOM element */
                var coord = d3.mouse(this);
                var distance = Point.distance(that.centerPoint, Point.fromCoords(coord));
                var area = GraphComfortEntry.calculateDistance(distance);
                that.highlight(area);
            };
        };
        GraphComfortEntry.prototype.graphUp = function () {
            /* 'that' is the instance of graph */
            var that = this;
            return function (d, i) {
                /* 'this' is the DOM element */
                var coord = Point.fromCoords(d3.mouse(this));
                var distance = Point.distance(that.centerPoint, coord);
                var area = GraphComfortEntry.calculateDistance(distance);
                that.saveTheInteraction(area, distance);
            };
        };
        GraphComfortEntry.prototype.graphDown = function () {
            /* 'that' is the instance of graph */
            var that = this;
            return function (d, i) {
                /* 'this' is the DOM element */
                var coord = Point.fromCoords(d3.mouse(this));
                var el = SVG.circle(8, coord.x, coord.y, "dropper");
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
            mediator.saveGraph(area, distance, this.currentUser);
            //stage.nextUser();
        };
        GraphComfortEntry.prototype.show = function (user) {
            this.currentUser = user;
            var promise = this.showBase();
            return promise.then(this.setupClickActivity.bind(this));
        };
        return GraphComfortEntry;
    }(GraphComfortBase));
    Comfort.GraphComfortEntry = GraphComfortEntry;
    var GraphComfortHistory = (function (_super) {
        __extends(GraphComfortHistory, _super);
        function GraphComfortHistory() {
            _super.call(this);
            this.graphData = new Array();
            //this.setupHistory();
        }
        GraphComfortHistory.prototype.show = function (graphData) {
            this.graphData = graphData;
            var promise = this.showBase();
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
                return Point.toCartesian(new Polar(data.distance, angle), new Point(400, 400)).x;
            })
                .attr("cy", function (data, index) {
                var angle = polarDivision * index;
                return Point.toCartesian(new Polar(data.distance, angle), new Point(400, 400)).y;
            });
            promise.then(function () {
                console.log("SHOWED base graph - now what?");
            });
            return promise;
        };
        GraphComfortHistory.prototype.hide = function () {
            return null;
        };
        return GraphComfortHistory;
    }(GraphComfortBase));
    Comfort.GraphComfortHistory = GraphComfortHistory;
    var FormUserChoice = (function () {
        function FormUserChoice() {
            this.users = [];
            this.userZone = document.getElementById('users');
            this.d3Users = d3.select("g#users");
            this.setupUsers();
            this.show();
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
            d3.select("g#users")
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
            return Timed.for(800).then(this.afterShow.bind(this));
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
            return Timed.for(800);
            /*  d3.select(this.userZone)
                .transition()
               .selectAll("text")
                .transition()
                .duration(function() {
                        return 800;
                })
                .style("font-size", 120);*/
        };
        FormUserChoice.prototype.rebind = function () {
            return this.d3Users
                .selectAll("circle")
                .data(this.users);
        };
        FormUserChoice.prototype.clickUser = function () {
            /* 'that' is the instance of graph */
            var that = this;
            return function (d, i) {
                /* 'this' is the DOM element */
                console.log("CLICK - User - up  UserChocieForm");
                //const name = this.getAttribute("data-name");
                var id = this.getAttribute("data-id");
                mediator.selectUser(id);
                console.log("This was clicked", that);
            };
        };
        FormUserChoice.prototype.overUser = function () {
            /* 'that' is the instance of graph */
            var that = this;
            return function (d, i) {
                /* 'this' is the DOM element */
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
            /* 'that' is the instance of graph */
            var that = this;
            return function (d, i) {
                /* 'this' is the DOM element */
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
                /*.on("mouseup", function(e) {
                    const name = this.getAttribute("data-name");
                    stage.selectUser(name);
                });*/
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
            this.users = users;
            this.setupUsers();
        };
        FormUserChoice.prototype.setupUsers = function () {
            var items = this.rebind();
            items.enter().append("g")
                .attr("id", function (e) {
                return e.id;
            })
                .attr("class", "user-group")
                .each(this.eachUser());
        };
        return FormUserChoice;
    }());
    Comfort.FormUserChoice = FormUserChoice;
    var Mediator = (function () {
        function Mediator() {
            console.log("START everything");
            this.userChoiceHistory = new Array();
            this.formUserChoice = new FormUserChoice();
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
                this.graphComfortEntry = new GraphComfortEntry();
            }
            this.graphComfortEntry.show(user);
        };
        Mediator.prototype.showGraphComfortHistory = function () {
            if (!this.graphComfortHistory) {
                this.graphComfortEntry = null;
                this.graphComfortHistory = new GraphComfortHistory();
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
            var userChoice = new ComfortUserChoice(user, distance, area);
            this.userChoiceHistory.push(userChoice);
        };
        Mediator.prototype.next = function () {
            //const prom = new Promsie()
            console.log("ACTION nextUser", this);
            this.graphComfortEntry.hide().then(function () {
                if (this.formUserChoice.hasMoreUsers()) {
                    console.log("Users left...", this);
                    this.formUserChoice.show();
                }
                else {
                    console.log("NO users left", this);
                    //this.formUserChoice.show();
                    this.showGraphComfortHistory();
                }
            }.bind(this));
        };
        return Mediator;
    }());
    Comfort.Mediator = Mediator;
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
    var ComfortZones = (function () {
        function ComfortZones(name, radius) {
            this.name = name;
            this.radius = radius;
        }
        return ComfortZones;
    }());
})(Comfort || (Comfort = {}));
//const stage = new Comfort.Stage();
var mediator = new Comfort.Mediator();
mediator.setUsers([
    new Comfort.User("Adam Hall", "xxx1"),
    new Comfort.User("Billie Davey", "xxx2"),
    new Comfort.User("Laura Rowe", "xxx3")
]);
//# sourceMappingURL=comfort.js.map