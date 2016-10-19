/// <reference path="../typings/d3/d3.d.ts" />
var Comfort;
(function (Comfort) {
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
            this.setupOverActivity();
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
        ComfortEntryGraph.prototype.stopInteraction = function () {
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
            });
            this.chaos = document.getElementById('chaos');
            this.stretch = document.getElementById('stretch');
            this.comfort = document.getElementById('comfort');
            ComfortEntryGraph.centerPoint = new Point(this.comfort.getAttribute('cx'), this.comfort.getAttribute('cy'));
        };
        ComfortEntryGraph.prototype.addDropper = function (el) {
            this.dropper = el;
            document.getElementById('stage').insertBefore(el, this.clickArea);
        };
        ComfortEntryGraph.calculateDistance = function (distance) {
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
            return area;
        };
        ComfortEntryGraph.prototype.setupOverActivity = function () {
            d3.select("#stage").on("mousemove", function (a, b, c) {
                var coord = d3.mouse(this);
                var distance = Point.distance(ComfortEntryGraph.centerPoint, Point.fromCoords(coord));
                var area = ComfortEntryGraph.calculateDistance(distance);
                ComfortEntryGraph.highlight(area);
            }); //this.checkArea);
        };
        ComfortEntryGraph.removeClickActivity = function () {
            console.log("Remove future interaction");
            d3.select("#stage").on("mouseup", function (a, b, c) {
                console.log("UNCLICK - Graphup - No longer interactive stage");
            });
            d3.select("#stage").on("mousedown", function (a, b, c) {
                console.log("UNCLICK - Graphdown - No longer interactive stage");
            });
        };
        ComfortEntryGraph.saveTheInteraction = function (area, distance) {
            console.log("saveTheInteraction");
            this.removeClickActivity();
            stage.nextUser();
        };
        ComfortEntryGraph.prototype.hide = function () {
            console.log("HIDE comfortGRAPH");
            var d3zones = d3.select("g#zones")
                .transition()
                .duration(1000)
                .selectAll("circle")
                .attr("r", 0);
        };
        ComfortEntryGraph.prototype.show = function () {
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
            })
                .each("end", function () {
                console.log("SHOWEND graph (this would work but unreliable)");
                //stage.comfortEntryGraph.setupClickActivity();
            });
            setTimeout(function () {
                stage.comfortEntryGraph.setupClickActivity();
            }, 1000);
        };
        ComfortEntryGraph.prototype.setupClickActivity = function () {
            console.log("SETUP graph click");
            d3.select("#stage").on("mouseup", function (a, b, c) {
                console.log("CLICK graph - up");
                var coord = Point.fromCoords(d3.mouse(this));
                var distance = Point.distance(ComfortEntryGraph.centerPoint, coord);
                var area = ComfortEntryGraph.calculateDistance(distance);
                ComfortEntryGraph.saveTheInteraction(area, distance);
            });
            d3.select("#stage").on("mousedown", function (a, b, c) {
                console.log("CLICK graph - down");
                var coord = Point.fromCoords(d3.mouse(this));
                var el = SVG.circle(8, coord.x, coord.y, "dropper");
                stage.comfortEntryGraph.addDropper(el);
                //allows it to be re-dragged
                //this.stage.appendChild(el);
                stage.nextUser();
            });
            //Event.add(['mousedown'], this.stage, this.addCircle);
            //Event.add(['mousemove'], this.stage, this.checkArea);
            //MouseEvent.drag(this.clickArea, this.startDrag, this.dragEvent, this.dropEvent, this);
            //Setup center
        };
        return ComfortEntryGraph;
    }());
    Comfort.ComfortEntryGraph = ComfortEntryGraph;
    var UserChoiceForm = (function () {
        function UserChoiceForm() {
            this.setupUsers();
            this.show();
        }
        UserChoiceForm.prototype.show = function () {
            console.log("SHOW UserChocieForm");
            d3.select(this.userZone)
                .transition()
                .duration(function () {
                return 800;
            })
                .style("fill-opacity", 1)
                .attr("transform", "matrix(1,0,0,1,0,0)")
                .each("end", function () {
                console.log("ENDSHOW UserChocieForm");
                d3.select("g#users")
                    .selectAll("rect")
                    .on("mouseup", function (e) {
                    console.log("CLICK - User - up  UserChocieForm");
                    var name = this.getAttribute("data-name");
                    stage.selectUser(name);
                    console.log("This was clicked", this);
                });
            });
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
            /*  d3.select(this.userZone)
                .transition()
               .selectAll("text")
                .transition()
                .duration(function() {
                        return 800;
                })
                .style("font-size", 120);*/
        };
        UserChoiceForm.prototype.setupUsers = function () {
            this.userZone = document.getElementById('users');
            var users = [new User("Adam Hall", "xxx1"), new User("Billie Davey", "xxx2"), new User("Laura Rowe", "xxx3")];
            var thisStage = this;
            var d3users = d3.select("g#users")
                .selectAll("circle")
                .data(users);
            d3users.enter().append("g")
                .attr("id", function (e) {
                return e.id;
            })
                .attr("class", "user-group")
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
                    d3.select(this.parentNode)
                        .selectAll("text")
                        .transition()
                        .duration(function () {
                        return 250;
                    })
                        .style("fill", function () {
                        return "#00D7FE";
                    });
                })
                    .on("mouseleave", function (e) {
                    d3.select(this.parentNode)
                        .selectAll("text")
                        .transition()
                        .duration(function () {
                        return 250;
                    })
                        .style("fill", function () {
                        return "grey";
                    });
                });
                /*.on("mouseup", function(e) {
                    let name = this.getAttribute("data-name");
                    stage.selectUser(name);
                });*/
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
        return UserChoiceForm;
    }());
    Comfort.UserChoiceForm = UserChoiceForm;
    var Stage = (function () {
        function Stage() {
            console.log("START everything");
            this.comfortEntryGraph = new ComfortEntryGraph();
            this.userChoiceForm = new UserChoiceForm();
        }
        Stage.prototype.selectUser = function (name) {
            console.log("ACTION selectUser", name);
            this.userChoiceForm.hide();
            this.comfortEntryGraph.show();
        };
        Stage.prototype.nextUser = function () {
            console.log("ACTION nextUser", this);
            this.comfortEntryGraph.hide();
            this.userChoiceForm.show();
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