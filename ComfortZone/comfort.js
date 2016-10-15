/// <reference path="../typings/d3/d3.d.ts" />
var Comfort;
(function (Comfort) {
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
        MouseEvent.drag = function (element, eventStart, eventDrag, eventDrop, scope) {
            scope.mode = "none";
            scope.startDrag = Event.fixScope(function (e) {
                element.addEventListener('mousemove', eventDrag);
            }, scope);
            scope.stopDrag = Event.fixScope(function (e) {
                element.removeEventListener('mousemove', eventDrag);
            }, scope);
            Event.add(['mousedown'], element, eventStart);
            Event.add(['mousedown'], element, scope.startDrag);
            Event.add(['mouseup'], element, scope.stopDrag);
            Event.add(['mouseup'], element, eventDrop);
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
        Point.distance = function (a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            return Math.sqrt(dx * dx + dy * dy);
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
    var ComfortEntryGraph = (function () {
        function ComfortEntryGraph() {
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
            this.setupArea();
            this.setupAreaEvents();
        }
        ComfortEntryGraph.highlight = function (area) {
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
        ComfortEntryGraph.prototype.setupArea = function () {
            this.clickArea = document.getElementById('clickable');
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
            })
                .transition()
                .duration(1000)
                .delay(function (d, i) { return i * 100; })
                .ease("elastic")
                .attr("r", function (d) {
                return d.radius;
            });
            this.chaos = document.getElementById('chaos');
            this.stretch = document.getElementById('stretch');
            this.comfort = document.getElementById('comfort');
        };
        ComfortEntryGraph.prototype.addDropper = function (el) {
            this.dropper = el;
            document.getElementById('stage').insertBefore(el, this.clickArea);
        };
        ComfortEntryGraph.prototype.setupAreaEvents = function () {
            d3.select("#stage").on("mousedown", function (a, b, c) {
                var coord = Point.fromCoords(d3.mouse(this));
                var el = SVG.circle(8, coord.x, coord.y, "dropper");
                stage.comfortEntryGraph.addDropper(el);
                //allows it to be re-dragged
                //this.stage.appendChild(el);
            }); //this.addCircle);
            d3.select("#stage").on("mousemove", function (a, b, c) {
                var coord = d3.mouse(this);
                var distance = Point.distance(ComfortEntryGraph.centerPoint, Point.fromCoords(coord));
                var area = "";
                if (distance < 100) {
                    area = "comfort";
                }
                else if (distance < 300) {
                    area = "stretch";
                }
                else {
                    area = "chaos";
                }
                ComfortEntryGraph.highlight(area);
            }); //this.checkArea);
            //Event.add(['mousedown'], this.stage, this.addCircle);
            //Event.add(['mousemove'], this.stage, this.checkArea);
            MouseEvent.drag(this.clickArea, this.startDrag, this.dragEvent, this.dropEvent, this);
            //Setup center
            ComfortEntryGraph.centerPoint = new Point(this.comfort.getAttribute('cx'), this.comfort.getAttribute('cy'));
        };
        return ComfortEntryGraph;
    }());
    Comfort.ComfortEntryGraph = ComfortEntryGraph;
    var UserChoiceForm = (function () {
        function UserChoiceForm() {
            this.setupUsers();
            this.setupUserEvents();
        }
        UserChoiceForm.prototype.setupUsers = function () {
            this.userZone = document.getElementById('users');
            var users = [new User("Adam Hall", "xxx1"), new User("Billie Davey", "xxx2"), new User("Laura Rowe", "xxx3")];
            var thisStage = this;
            var d3users = d3.select("g#users")
                .selectAll("circle")
                .data(users);
            //text x="0" y="35" font-family="Verdana" font-size="35"
            d3users.enter().append("g")
                .attr("id", function (e) {
                return e.id;
            })
                .each(function (e, i) {
                //Event.add(['mousedown'], this.stage, this.chooseUser);
                //Event.add(["mouseover"], this, thisStage.checkOverUsers);
                d3.select(this)
                    .append("rect")
                    .attr("y", function (e) {
                    return 60 + (i * 90);
                })
                    .attr("x", 0)
                    .attr("width", 800)
                    .attr("height", 90)
                    .attr("data-name", function (e) {
                    return e.name;
                })
                    .on("mouseover", function (e) {
                    d3.select(this)
                        .transition()
                        .duration(function () {
                        return 250;
                    })
                        .style("fill", function () {
                        return "#00D7FE";
                    });
                })
                    .on("mouseleave", function (e) {
                    d3.select(this)
                        .transition()
                        .duration(function () {
                        return 250;
                    })
                        .style("fill", function () {
                        return "grey";
                    });
                });
                d3.select(this).append("text")
                    .attr("class", "username")
                    .attr("y", function (e) {
                    return 30 + ((i + 1) * 90);
                })
                    .attr("x", 60)
                    .attr("data-name", function () {
                    return e.name;
                })
                    .style("font-size", 60)
                    .style("font-family", "Share Tech Mono")
                    .text(function (j) {
                    return e.name;
                });
            });
        };
        UserChoiceForm.prototype.setupUserEvents = function () {
            //Event.add(['mousedown'], this.stage, this.chooseUser);
            //Event.add(['mousemove'], this.stage, this.checkOverUsers);
        };
        return UserChoiceForm;
    }());
    Comfort.UserChoiceForm = UserChoiceForm;
    var Stage = (function () {
        function Stage() {
            this.comfortEntryGraph = new ComfortEntryGraph();
            this.userChoiceForm = new UserChoiceForm();
        }
        Stage.prototype.highlightUser = function (username) {
            /*let d3zones = d3.select("svg")
                .selectAll(".area")
                .transition()
                    .delay(function() {
                        if(this.getAttribute("id") === area) {
                            return 0;
                        }
                        return 100;
                    })
                    .ease("cubic")
                    .duration(function() {
                        return 250;
                    })
                    
                    .style("fill", function() {
                        if(this.getAttribute("id") === area) {
                             return "#00D7FE";
                        }
                        return "grey";
                    });*/
        };
        Stage.stage = document.getElementById('stage');
        return Stage;
    }());
    Comfort.Stage = Stage;
    var User = (function () {
        function User(name, id) {
            this.name = name;
            this.id = id;
        }
        return User;
    }());
    Comfort.User = User;
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