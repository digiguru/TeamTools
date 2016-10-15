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
    var Stage = (function () {
        function Stage() {
            this.area = "";
            this.checkArea = Event.fixScope(function (e) {
                var thisPoint = new Point(e.offsetX, e.offsetY);
                var distance = Point.distance(this.centerPoint, thisPoint);
                if (distance < 100) {
                    this.area = "comfort";
                }
                else if (distance < 300) {
                    this.area = "stretch";
                }
                else {
                    this.area = "chaos";
                }
                this.highlight(this.area);
            }, this);
            this.chooseUser = Event.fixScope(function (e) {
            }, this);
            this.checkOverUsers = Event.fixScope(function (e) {
            }, this);
            this.addCircle = Event.fixScope(function (e) {
                var el = SVG.circle(8, e.offsetX, e.offsetY, "dropper");
                /*this.reDragDropped = Event.fixScope(function(e) {
                    this.dropper = el;
                    this.dropper.setAttribute("class", "dropper");
                    this.stage.addEventListener('mousemove', this.dragEvent);
                }, this);
                Event.add(['mousedown'], el, this.reDragDropped, this);
                */
                this.dropper = el;
                //allows it to be dropped forever....
                this.stage.insertBefore(el, this.clickArea);
                //allows it to be re-dragged
                //this.stage.appendChild(el);
            }, this);
            this.startDrag = Event.fixScope(function (e) {
                var clickPoint = new Point(e.offsetX, e.offsetY);
                console.log('start...', 'distance', Point.distance(this.centerPoint, clickPoint));
                return true;
            }, this);
            this.dragEvent = Event.fixScope(function (e) {
                var clickPoint = new Point(e.offsetX, e.offsetY);
                this.dropper.setAttribute("cx", e.offsetX);
                this.dropper.setAttribute("cy", e.offsetY);
                console.log('..drag...', 'distance', Point.distance(this.centerPoint, clickPoint));
                return true;
            }, this);
            this.dropEvent = Event.fixScope(function (e) {
                var clickPoint = new Point(e.offsetX, e.offsetY);
                this.dropper.setAttribute("cx", e.offsetX);
                this.dropper.setAttribute("cy", e.offsetY);
                this.dropper.setAttribute("class", "dropped");
                console.log('STOP!', 'distance', Point.distance(this.centerPoint, clickPoint));
                return true;
            }, this);
            this.setupArea();
            this.setupAreaEvents();
            this.setupUsers();
            this.setupUserEvents();
        }
        Stage.prototype.setupUsers = function () {
            this.userZone = document.getElementById('users');
            var users = [new User("Adam Hall"), new User("Billie Davey"), new User("Laura Rowe")];
            var d3users = d3.select("g#users")
                .selectAll("circle")
                .data(users);
            //text x="0" y="35" font-family="Verdana" font-size="35"
            d3users.enter().append("rect")
                .attr("y", function (e, i) {
                return 60 + (i * 90);
            })
                .attr("x", 0)
                .attr("width", 800)
                .attr("height", 90)
                .attr("data-name", function (e) {
                return e.name;
            })
                .each(function (e, i) {
                d3.select(this.parentNode).append("text")
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
        Stage.prototype.setupUserEvents = function () {
            Event.add(['mousedown'], this.stage, this.chooseUser);
            Event.add(['mousemove'], this.stage, this.checkOverUsers);
        };
        Stage.prototype.setupArea = function () {
            this.stage = document.getElementById('stage');
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
        Stage.prototype.setupAreaEvents = function () {
            Event.add(['mousedown'], this.stage, this.addCircle);
            Event.add(['mousemove'], this.stage, this.checkArea);
            MouseEvent.drag(this.clickArea, this.startDrag, this.dragEvent, this.dropEvent, this);
            //Setup center
            this.centerPoint = new Point(this.comfort.getAttribute('cx'), this.comfort.getAttribute('cy'));
            console.log('center point', this.centerPoint);
        };
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
        Stage.prototype.highlight = function (area) {
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
        return Stage;
    }());
    Comfort.Stage = Stage;
    var User = (function () {
        function User(name) {
            this.name = name;
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