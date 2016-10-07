class Event {
    static fixScope(event, scope) {
        return event.bind(scope);
    }
    static add(eventNames, element, event) {
        eventNames.forEach(function(eventName){
            element.addEventListener(eventName, event);
        });
    }
    
}
class MouseEvent {
    static trigger (node, eventType) {
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }
    static drag(element, eventStart, eventDrag, eventDrop, scope) {
        scope.mode = "none";

        scope.startDrag = Event.fixScope(function(e) {
            element.addEventListener('mousemove', eventDrag);
        }, scope);
        
        scope.stopDrag = Event.fixScope(function(e) {
            element.removeEventListener('mousemove', eventDrag);
        }, scope);
        
        Event.add(['mousedown'], element, eventStart, scope);
        Event.add(['mousedown'], element, scope.startDrag, scope);
        Event.add(['mouseup'], element, scope.stopDrag, scope);
        Event.add(['mouseup'], element, eventDrop, scope);
    }
}
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.sqrt(dx*dx + dy*dy);
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
class Stage {
   
    constructor() {
        this.stage = document.getElementById('stage');
        this.clickArea = document.getElementById('clickable');
        this.chaos = document.getElementById('chaos');
        this.stretch = document.getElementById('stretch');
        this.comfort = document.getElementById('comfort');
        this.dropper;
        
        this.addCircle = Event.fixScope(function(e) {
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

        this.startDrag = Event.fixScope(function(e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            console.log('start...', 'distance', Point.distance(this.centerPoint, clickPoint))
            return true;
        }, this);
        
        this.dragEvent = Event.fixScope(function(e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            this.dropper.setAttribute("cx", e.offsetX);
            this.dropper.setAttribute("cy", e.offsetY);          
            console.log('..drag...', 'distance', Point.distance(this.centerPoint, clickPoint))
            return true;
        }, this);
        
        this.dropEvent = Event.fixScope(function(e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            this.dropper.setAttribute("cx", e.offsetX);
            this.dropper.setAttribute("cy", e.offsetY); 
            this.dropper.setAttribute("class", "dropped");
            console.log('STOP!', 'distance', Point.distance(this.centerPoint, clickPoint))
            return true;
        }, this);

        
        Event.add(['mousedown'], this.stage, this.addCircle, this);
            
        MouseEvent.drag(this.clickArea, this.startDrag, this.dragEvent, this.dropEvent, this);
       
        //Setup center
        this.centerPoint = new Point(comfort.getAttribute('cx'), comfort.getAttribute('cy'));
        console.log('center point', this.centerPoint);
    }



}


const p1 = new Point(5, 5);
const p2 = new Point(10, 10);

console.log(Point.distance(p1, p2));


var stage = new Stage();


