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
    export class Stage {
        stage;
        clickArea;
        chaos;
        stretch;
        comfort;
        dropper;
        centerPoint:Point;

        addCircle = Event.fixScope(function (e) {
            let el = SVG.circle(8, e.offsetX, e.offsetY, "dropper");
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

        startDrag = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            console.log('start...', 'distance', Point.distance(this.centerPoint, clickPoint))
            return true;
        }, this);

        dragEvent = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            this.dropper.setAttribute("cx", e.offsetX);
            this.dropper.setAttribute("cy", e.offsetY);
            console.log('..drag...', 'distance', Point.distance(this.centerPoint, clickPoint))
            return true;
        }, this);

        dropEvent = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            this.dropper.setAttribute("cx", e.offsetX);
            this.dropper.setAttribute("cy", e.offsetY);
            this.dropper.setAttribute("class", "dropped");
            console.log('STOP!', 'distance', Point.distance(this.centerPoint, clickPoint))
            return true;
        }, this);

        constructor() {

            //<circle id="stretch" r="300" cx="400" cy="400" />
            //<circle id="comfort" r="100" cx="400" cy="400" />

            let zones = [new ComfortZones("stretch",300), new ComfortZones("comfort",100)];
            let d3zones = d3.select("g")
                .selectAll("circle")
                .data(zones)
                    ;

            d3zones.enter().append("circle")
                .attr("cx", 400)
                    .attr("cy", 400)
                    .attr("r", 0)
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
            /*
            d3.select("g").append("circle")
            .attr("cx", 400)
            .attr("cy", d.y)
            .attr("r", 2.5);
            */
            this.stage = document.getElementById('stage');
            this.clickArea = document.getElementById('clickable');
            this.chaos = document.getElementById('chaos');
            this.stretch = document.getElementById('stretch');
            this.comfort = document.getElementById('comfort');

            Event.add(['mousedown'], this.stage, this.addCircle);

            MouseEvent.drag(this.clickArea, this.startDrag, this.dragEvent, this.dropEvent, this);

            //Setup center
            this.centerPoint = new Point(this.comfort.getAttribute('cx'), this.comfort.getAttribute('cy'));
            console.log('center point', this.centerPoint);
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


