/// <reference path="../typings/d3/d3.d.ts" />

namespace Comfort {

    export class ComfortEntryGraph {
        clickArea;
        chaos;
        stretch;
        comfort;
        public static centerPoint:Point;
        dropper;

        startDrag = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            return true;
        }, this);

        dragEvent = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            this.dropper.setAttribute("cx", e.offsetX);
            this.dropper.setAttribute("cy", e.offsetY);
            return true;
        }, this);
        
        dropEvent = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            this.dropper.setAttribute("cx", e.offsetX);
            this.dropper.setAttribute("cy", e.offsetY);
            this.dropper.setAttribute("class", "dropped");
            return true;
        }, this);
        
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
        
        public stopInteraction () {

        }

        setupArea () {
            this.clickArea = document.getElementById('clickable');
            
            
            let zones = [new ComfortZones("stretch",300), new ComfortZones("comfort",100)];
            let d3zones = d3.select("g#zones")
                .selectAll("circle")
                .data(zones);

            d3zones.enter().append("circle")
                .attr("cx", 400)
                    .attr("cy", 400)
                    .attr("r", 0)
                    .attr("class", "area")
                    .attr("id", function(d:ComfortZones) {
                        return d.name;
                });
            

            this.chaos = document.getElementById('chaos');
            this.stretch = document.getElementById('stretch');
            this.comfort = document.getElementById('comfort');
            ComfortEntryGraph.centerPoint = new Point(this.comfort.getAttribute('cx'), this.comfort.getAttribute('cy'));
            

        }
        addDropper (el) {
            this.dropper = el;
            document.getElementById('stage').insertBefore(el, this.clickArea);
        }
        static calculateDistance(distance) {
            let area = "";
            if(distance < 100) {
                area = "comfort";
            } else if (distance < 300) {
                area = "stretch";
            } else {
                area = "chaos";
            }
            return area;
        }
        setupOverActivity () {
            d3.select("#stage").on("mousemove", function(a,b,c) {
                let coord = d3.mouse(this);
                let distance = Point.distance(ComfortEntryGraph.centerPoint, Point.fromCoords(coord));
                let area = ComfortEntryGraph.calculateDistance(distance);
                ComfortEntryGraph.highlight(area);
            });//this.checkArea);
        }
        public static removeClickActivity () {
            console.log("Remove future interaction");
            d3.select("#stage").on("mouseup", function(a,b,c) {
                console.log("UNCLICK - Graphup - No longer interactive stage");
            });
            d3.select("#stage").on("mousedown", function(a,b,c) {
                console.log("UNCLICK - Graphdown - No longer interactive stage");
            });
            
        }
        public static saveTheInteraction (area, distance) {
            console.log("saveTheInteraction");
            this.removeClickActivity();
            stage.nextUser();
        }
        public hide() {
            console.log("HIDE comfortGRAPH");
            
            let d3zones = d3.select("g#zones")    
                .transition()
                    .duration(1000)
                    .selectAll("circle")
                    .attr("r", 0);
                    
        }
        public show() {
            console.log("SHOW graph");
            let d3zones = d3.select("g#zones")
                .selectAll("circle")
                    .attr("r", 0)
                .transition()
                    .duration(1000)
                    .delay(function(d, i) { return i * 100; })
                    .ease("elastic")
                    .attr("r", function(d:ComfortZones) { 
                        return d.radius; 
                    }) 
                    .each("end", function() {
                        console.log("SHOWEND graph (this would work but unreliable)");
                       //stage.comfortEntryGraph.setupClickActivity();
                        
                    });
            setTimeout(function() {
                stage.comfortEntryGraph.setupClickActivity();    
            }, 1000);
            
        }
            
        setupClickActivity () {
            console.log("SETUP graph click");
            d3.select("#stage").on("mouseup", function(a,b,c) {
                console.log("CLICK graph - up");
                let coord = Point.fromCoords(d3.mouse(this));
                let distance = Point.distance(ComfortEntryGraph.centerPoint, coord);
                let area = ComfortEntryGraph.calculateDistance(distance);
                ComfortEntryGraph.saveTheInteraction(area, distance);

            });

            d3.select("#stage").on("mousedown", function(a,b,c) {
                console.log("CLICK graph - down");
                let coord = Point.fromCoords(d3.mouse(this));
                let el = SVG.circle(8, coord.x, coord.y, "dropper");
                stage.comfortEntryGraph.addDropper(el);
                //allows it to be re-dragged
                //this.stage.appendChild(el);
                stage.nextUser();
            });
            
            
            //Event.add(['mousedown'], this.stage, this.addCircle);
            //Event.add(['mousemove'], this.stage, this.checkArea);
            
            //MouseEvent.drag(this.clickArea, this.startDrag, this.dragEvent, this.dropEvent, this);

            //Setup center
        }

      

        constructor() {
            this.setupArea();
            this.setupOverActivity();
        }

    }
    export class UserChoiceForm {
        userZone;
        
        constructor() {
            this.setupUsers();
            this.show();
        }
        show () {
            console.log("SHOW UserChocieForm");
            d3.select(this.userZone)
                .transition()
                .duration(function() {
                        return 800;
                })
                .style("fill-opacity",1)
                .attr("transform", "matrix(1,0,0,1,0,0)")
                .each("end", function() {
                    console.log("ENDSHOW UserChocieForm");
                    d3.select("g#users")
                        .selectAll("rect")
                        .on("mouseup", function(e) {
                            console.log("CLICK - User - up  UserChocieForm");
                            let name = this.getAttribute("data-name");
                            stage.selectUser(name);
                            console.log("This was clicked", this);
                        });
                });
        }
        hide () {
            console.log("HIDE userEntry");
            d3.select(this.userZone)
                .transition()
                .duration(function() {
                        return 800;
                })
                .style("fill-opacity",0)
                .attr("transform", "matrix(2,0,0,2,-400,-90)");
            d3.select("g#users")
                .selectAll("rect")
                .on("mouseup", function(e) {
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
        }
        setupUsers () {
            this.userZone = document.getElementById('users');
            
            let users = [new User("Adam Hall","xxx1"), new User("Billie Davey","xxx2"), new User("Laura Rowe","xxx3")];
            let thisStage = this;
            let d3users = d3.select("g#users")
                .selectAll("circle")
                .data(users);

            d3users.enter().append("g")
                .attr("id", function(e) {
                    return e.id;
                })
                .attr("class", "user-group")
                .each(function(e, i) {
                    //Event.add(['mousedown'], this.stage, this.chooseUser);
                    //Event.add(["mouseover"], this, thisStage.checkOverUsers);
                    d3.select(this)
                        .append("rect")
                        .attr("y", function(e) {
                            return 60 + (i * 90);
                        })
                        .attr("x", 0)
                        .attr("width", 800)
                        .attr("height", 90)
                        .attr("data-name", function(e) {
                            return e.name;
                        })
                        .on("mouseover", function(e) {
                            d3.select(this.parentNode)
                            //let d3zones = d3.select("g#users")
                                .selectAll("text")
                                .transition()
                                .duration(function() {
                                        return 250;
                                })
                                .style("fill", function() {
                                        return "#00D7FE";
                                        
                                });
                        })
                        .on("mouseleave", function(e) {
                            d3.select(this.parentNode)
                            //let d3zones = d3.select("g#users")
                                .selectAll("text")
                                .transition()
                                .duration(function() {
                                        return 250;
                                })
                                .style("fill", function() {
                                        return "grey";
                                        
                                });
                        })
                        /*.on("mouseup", function(e) {
                            let name = this.getAttribute("data-name");
                            stage.selectUser(name);
                        });*/
                    d3.select(this).append("text")      
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

        
    }
    export class Stage {
        static stage = document.getElementById('stage');
        
        comfortEntryGraph : ComfortEntryGraph;
        userChoiceForm : UserChoiceForm;

        constructor() {
            console.log("START everything");
            this.comfortEntryGraph = new ComfortEntryGraph();
            this.userChoiceForm = new UserChoiceForm();
        }
        
        selectUser(name) {
            console.log("ACTION selectUser", name);
            this.userChoiceForm.hide();
            this.comfortEntryGraph.show();
        }

        public nextUser() {
            console.log("ACTION nextUser", this);
            this.comfortEntryGraph.hide();
            this.userChoiceForm.show();
        }
        

    }
    export class User {
        name: string;
        id: string;
        constructor(name:string, id:string) {
            this.name = name;
            this.id = id;
        }
    }
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
        
        static stopDrag(element, eventStart, eventDrag, eventDrop, scope) {

        }

        static drag(element, eventStart, eventDrag, eventDrop, scope) {
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


