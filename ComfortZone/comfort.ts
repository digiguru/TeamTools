/// <reference path="../typings/d3/d3.d.ts" />

namespace Comfort {
    class Event {
        static fixScope(event, scope) {
            return event.bind(scope);
        }
        static add(eventNames, element, event) {
            eventNames.forEach(function (eventName) {
                element.addEventListener(eventName, event);
            });
        }

    }
    class MouseEvent {
        static trigger(node, eventType) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent(eventType, true, true);
            node.dispatchEvent(clickEvent);
        }
        static drag(element, eventStart, eventDrag, eventDrop, scope) {
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
        }
    }
    class Point {
        x : number;
        y : number;

        constructor(x : number, y : number) {
            this.x = x;
            this.y = y;
        }
        static fromCoords(coords:Array<number>) {
            return new Point(coords[0],coords[1]);
        }
        static distance(a:Point , b:Point) {
            const dx = a.x - b.x;
            const dy = a.y - b.y;

            return Math.sqrt(dx * dx + dy * dy);
        }
    }
    class SVG {
        static element(tagName) {
            return document.createElementNS("http://www.w3.org/2000/svg", tagName);
        }

        static circle(r, x, y, className) {
            let el = SVG.element("circle");
            el.setAttribute("r", r);
            el.setAttribute("cx", x);
            el.setAttribute("cy", y);
            el.setAttribute("class", className);
            return el;
            //<circle id="stretch" r="300" cx="400" cy="400" />

        }
    }
    export class ComfortChoiceStage {
        
    }
    export class Stage {
        stage;
        clickArea;
        chaos;
        stretch;
        comfort;
        dropper;
        public static centerPoint:Point;
        area = "";

        userZone;
        
        checkOverUsers = Event.fixScope(function (j, e) {
            let d3zones = d3.select("g#users")
            .selectAll("text")
            .transition()
            .duration(function() {
                    return 250;
                })
            .style("fill", function() {
                    if(this.getAttribute("data-name") === j.attr("data-name")) {
                        return "#00D7FE";
                    }
                    return "grey";
                });
        }, this);



       

        startDrag = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            console.log('start...', 'distance', Point.distance(Stage.centerPoint, clickPoint))
            return true;
        }, this);

        dragEvent = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            this.dropper.setAttribute("cx", e.offsetX);
            this.dropper.setAttribute("cy", e.offsetY);
            console.log('..drag...', 'distance', Point.distance(Stage.centerPoint, clickPoint))
            return true;
        }, this);

        dropEvent = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            this.dropper.setAttribute("cx", e.offsetX);
            this.dropper.setAttribute("cy", e.offsetY);
            this.dropper.setAttribute("class", "dropped");
            console.log('STOP!', 'distance', Point.distance(Stage.centerPoint, clickPoint))
            return true;
        }, this);

        constructor() {
            
            
            this.setupArea();
            this.setupAreaEvents(); 
            this.setupUsers();
            this.setupUserEvents();



        }
        setupUsers () {
            this.userZone = document.getElementById('users');
            
            let users = [new User("Adam Hall"), new User("Billie Davey"), new User("Laura Rowe")];
            let thisStage = this;
            let d3users = d3.select("g#users")
                .selectAll("circle")
                .data(users);
//text x="0" y="35" font-family="Verdana" font-size="35"
            d3users.enter().append("rect")
                .attr("y", function(e, i) {
                    return 60 + (i * 90);
                })
                .attr("x", 0)
                .attr("width", 800)
                .attr("height", 90)
                .attr("data-name", function(e) {
                    return e.name;
                })
                
                .each(function(e, i) {
                    //Event.add(['mousedown'], this.stage, this.chooseUser);
                    Event.add(["mouseover"], this, thisStage.checkOverUsers);

                    d3.select(this.parentNode).append("text")      
                        .attr("class", "username")
                        .attr("y", function(e) {
                            return 30 + ((i + 1) * 90);
                        })
                        .attr("x", 60)
                        .attr("data-name", function() {
                            return e.name;
                        })
                        .style("font-size", 60)
                        .style("font-family", "Share Tech Mono")
                        .text(function(j) {
                            return e.name;
                        });
                });
                 
        }
        setupUserEvents () {
            
            //Event.add(['mousedown'], this.stage, this.chooseUser);
            //Event.add(['mousemove'], this.stage, this.checkOverUsers);
            
        }
        setupArea () {
            this.stage = document.getElementById('stage');
            this.clickArea = document.getElementById('clickable');
            
            
            let zones = [new ComfortZones("stretch",300), new ComfortZones("comfort",100)];
            let d3zones = d3.select("g#zones")
                .selectAll("circle")
                .data(zones)
                    ;

            d3zones.enter().append("circle")
                .attr("cx", 400)
                    .attr("cy", 400)
                    .attr("r", 0)
                    .attr("class", "area")
                    .attr("id", function(d:ComfortZones) {
                        return d.name;
                })
                .transition()
                    .duration(1000)
                    .delay(function(d, i) { return i * 100; })
                    .ease("elastic")
                    .attr("r", function(d:ComfortZones) { 
                        return d.radius; 
                    })
                ;

            this.chaos = document.getElementById('chaos');
            this.stretch = document.getElementById('stretch');
            this.comfort = document.getElementById('comfort');

        }
        static addDropper (el) {
            stage.dropper = el;
            stage.stage.insertBefore(el, stage.clickArea);
        }
        setupAreaEvents () {
            d3.select("#stage").on("mousedown", function(a,b,c) {
                console.log(this,a,b,c);
                let coord = Point.fromCoords(d3.mouse(this));
                let el = SVG.circle(8, coord.x, coord.y, "dropper");
                Stage.addDropper(el);
                //allows it to be re-dragged
                //this.stage.appendChild(el);


            });//this.addCircle);
            d3.select("#stage").on("mousemove", function(a,b,c) {
                console.log(this,a,b,c);
                let coord = d3.mouse(this);
                let distance = Point.distance(Stage.centerPoint, Point.fromCoords(coord));
                let area = "";
                if(distance < 100) {
                    area = "comfort";
                } else if (distance < 300) {
                    area = "stretch";
                } else {
                    area = "chaos";
                }
                Stage.highlight(area);
            });//this.checkArea);
            
            //Event.add(['mousedown'], this.stage, this.addCircle);
            //Event.add(['mousemove'], this.stage, this.checkArea);
            MouseEvent.drag(this.clickArea, this.startDrag, this.dragEvent, this.dropEvent, this);

            //Setup center
            Stage.centerPoint = new Point(this.comfort.getAttribute('cx'), this.comfort.getAttribute('cy'));
            console.log('center point', Stage.centerPoint);
        }
        highlightUser (username) {

           
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
        }

        public static highlight ( area ) {
            //<circle id="stretch" r="300" cx="400" cy="400" />
            //<circle id="comfort" r="100" cx="400" cy="400" />

           
            let d3zones = d3.select("svg")
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
                    });
            
        }
        

        

    }
    export class User {
        name: string;
        constructor(name:string) {
            this.name = name;
        }
    }

    class ComfortZones {
        name : string;
        radius: number;
        constructor(name: string, radius: number) {
            this.name = name;
            this.radius = radius; 
        }
    }
}

var stage = new Comfort.Stage();


