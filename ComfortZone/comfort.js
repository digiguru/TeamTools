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
        GraphComfortBase.prototype.show = function (user) {
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
            this.startDrag = Event.fixScope(function (e) {
                var clickPoint = new Point(e.offsetX, e.offsetY);
                return true;
            }, this);
            this.dragEvent = Event.fixScope(function (e) {
                var clickPoint = new Point(e.offsetX, e.offsetY);
                this.dropper.setAttribute("cx", e.offsetX);
                this.dropper.setAttribute("cy", e.offsetY);
                return true;
            }, this);
            this.dropEvent = Event.fixScope(function (e) {
                var clickPoint = new Point(e.offsetX, e.offsetY);
                this.dropper.setAttribute("cx", e.offsetX);
                this.dropper.setAttribute("cy", e.offsetY);
                this.dropper.setAttribute("class", "dropped");
                return true;
            }, this);
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
            //Event.add(['mousedown'], this.stage, this.addCircle);
            //Event.add(['mousemove'], this.stage, this.checkArea);
            //MouseEvent.drag(this.clickArea, this.startDrag, this.dragEvent, this.dropEvent, this);
            //Setup center
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
                    return "#00D7FE";
                }
                return "grey";
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
        GraphComfortEntry.prototype.removeClickActivity = function () {
            console.log("Remove future interaction");
            d3.select("#stage").on("mouseup", function (a, b, c) {
                console.log("UNCLICK - Graphup - No longer interactive stage");
            });
            d3.select("#stage").on("mousedown", function (a, b, c) {
                console.log("UNCLICK - Graphdown - No longer interactive stage");
            });
        };
        GraphComfortEntry.prototype.saveTheInteraction = function (area, distance) {
            console.log("saveTheInteraction");
            this.removeClickActivity();
            stage.saveGraph(area, distance, this.currentUser);
            //stage.nextUser();
        };
        GraphComfortEntry.prototype.show = function (user) {
            this.currentUser = user;
            var promise = _super.prototype.show.call(this, user);
            return promise.then(this.setupClickActivity.bind(this));
        };
        return GraphComfortEntry;
    }(GraphComfortBase));
    Comfort.GraphComfortEntry = GraphComfortEntry;
    var Polar = (function () {
        function Polar(radius, angle) {
            this.radius = radius;
            this.angle = angle;
        }
        return Polar;
    }());
    Comfort.Polar = Polar;
    var GraphComfortHistory = (function (_super) {
        __extends(GraphComfortHistory, _super);
        function GraphComfortHistory() {
            _super.call(this);
        }
        GraphComfortHistory.prototype.show = function () {
            return null;
        };
        GraphComfortHistory.prototype.hide = function () {
            return null;
        };
        return GraphComfortHistory;
    }(GraphComfortBase));
    Comfort.GraphComfortHistory = GraphComfortHistory;
    var UserChoiceForm = (function () {
        function UserChoiceForm() {
            this.users = [
                new User("Adam Hall", "xxx1"),
                new User("Billie Davey", "xxx2"),
                new User("Laura Rowe", "xxx3")
            ];
            this.userZone = document.getElementById('users');
            this.d3Users = d3.select("g#users");
            this.setupUsers();
            this.show();
        }
        UserChoiceForm.prototype.getUser = function (id) {
            var users = this.users.filter(function (x) {
                return x.id === id;
            });
            if (users.length) {
                return users[0];
            }
            throw Error("Cannot find user " + id);
        };
        UserChoiceForm.prototype.markUserDone = function (user) {
            for (var i = 0; i < this.users.length; i++) {
                if (user.id === this.users[i].id) {
                    user.voted = true;
                }
            }
            this.rebind();
        };
        UserChoiceForm.prototype.afterShow = function () {
            console.log("ENDSHOW UserChocieForm");
            d3.select("g#users")
                .selectAll("rect")
                .on("mouseup", this.clickUser());
        };
        UserChoiceForm.prototype.hasMoreUsers = function () {
            var unvotedUsers = this.users.filter(function (x) {
                return !x.voted;
            });
            return unvotedUsers.length;
        };
        UserChoiceForm.prototype.show = function () {
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
        UserChoiceForm.prototype.hide = function () {
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
        UserChoiceForm.prototype.rebind = function () {
            return this.d3Users
                .selectAll("circle")
                .data(this.users);
        };
        UserChoiceForm.prototype.clickUser = function () {
            /* 'that' is the instance of graph */
            var that = this;
            return function (d, i) {
                /* 'this' is the DOM element */
                console.log("CLICK - User - up  UserChocieForm");
                //const name = this.getAttribute("data-name");
                var id = this.getAttribute("data-id");
                stage.selectUser(id);
                console.log("This was clicked", that);
            };
        };
        UserChoiceForm.prototype.overUser = function () {
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
        UserChoiceForm.prototype.leaveUser = function () {
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
        UserChoiceForm.prototype.eachUser = function () {
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
        UserChoiceForm.prototype.setupUsers = function () {
            var items = this.rebind();
            items.enter().append("g")
                .attr("id", function (e) {
                return e.id;
            })
                .attr("class", "user-group")
                .each(this.eachUser());
        };
        return UserChoiceForm;
    }());
    Comfort.UserChoiceForm = UserChoiceForm;
    var Stage = (function () {
        function Stage() {
            console.log("START everything");
            this.userChoiceHistory = new Array();
            this.graphComfortEntry = new GraphComfortEntry();
            this.userChoiceForm = new UserChoiceForm();
            this.graphComfortHistory = new GraphComfortHistory();
        }
        Stage.prototype.selectUser = function (id) {
            console.log("ACTION selectUser", id);
            var user = this.userChoiceForm.getUser(id);
            this.userChoiceForm.hide();
            this.graphComfortEntry.show(user);
        };
        Stage.prototype.saveGraph = function (area, distance, user) {
            this.userChoiceForm.markUserDone(user);
            this.addUserChoiceHistory(area, distance, user);
            this.next();
        };
        Stage.prototype.addUserChoiceHistory = function (area, distance, user) {
            var userChoice = new ComfortUserChoice(user, distance, area);
            this.userChoiceHistory.push(userChoice);
        };
        Stage.prototype.next = function () {
            //const prom = new Promsie()
            console.log("ACTION nextUser", this);
            this.graphComfortEntry.hide().then(function () {
                if (this.userChoiceForm.hasMoreUsers()) {
                    console.log("Users left...", this);
                    this.userChoiceForm.show();
                }
                else {
                    console.log("NO users left", this);
                    this.userChoiceForm.show();
                    this.graphComfortHistory.show();
                }
            }.bind(this));
        };
        Stage.stage = document.getElementById('stage');
        return Stage;
    }());
    Comfort.Stage = Stage;
    var User = (function () {
        function User(name, id) {
            this.name = name;
            this.id = id;
            this.voted = false;
        }
        return User;
    }());
    Comfort.User = User;
    var Event = (function () {
        function Event() {
        }
        Event.fixScope = function (event, scope) {
            return event.bind(scope);
        };
        Event.add = function (eventNames, element, event) {
            eventNames.forEach(function (eventName) {
                element.addEventListener(eventName, event);
            });
        };
        return Event;
    }());
    var MouseEvent = (function () {
        function MouseEvent() {
        }
        MouseEvent.trigger = function (node, eventType) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent(eventType, true, true);
            node.dispatchEvent(clickEvent);
        };
        MouseEvent.stopDrag = function (element, eventStart, eventDrag, eventDrop, scope) {
        };
        MouseEvent.drag = function (element, eventStart, eventDrag, eventDrop, scope) {
            scope.mode = "none";
            //scope.startDrag = Event.fixScope(function (e) {
            element.addEventListener('mousemove', eventDrag);
            //}, scope);
            //scope.stopDrag = Event.fixScope(function (e) {
            element.removeEventListener('mousemove', eventDrag);
            //}, scope);
            /*
            Event.add(['mousedown'], element, eventStart);
            Event.add(['mousedown'], element, scope.startDrag);
            Event.add(['mouseup'], element, scope.stopDrag);
            Event.add(['mouseup'], element, eventDrop);
            */
        };
        return MouseEvent;
    }());
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
var stage = new Comfort.Stage();
//# sourceMappingURL=comfort.js.map