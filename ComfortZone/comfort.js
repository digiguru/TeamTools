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
        return Stage;
    }());
    Comfort.Stage = Stage;
})(Comfort || (Comfort = {}));
var stage = new Comfort.Stage();
