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
class Stage {
    constructor() {
        this.clickArea = document.getElementById('clickable');
        this.chaos = document.getElementById('chaos');
        this.stretch = document.getElementById('stretch');
        this.comfort = document.getElementById('comfort');
        this.mode = "nothing";
        //Drop event
        this.dropEvent = Event.fixScope(function(e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            console.log(this.mode, 'distance', Point.distance(this.centerPoint, clickPoint))
            return true;
        }, this);
        
        Event.add(['mousedown','mouseup'], this.clickArea, this.dropEvent, this);
        
        //DragNDrop
        this.startDrag = Event.fixScope(function(e) {
            this.mode = "drag";
            this.clickArea.addEventListener('mousemove', this.dropEvent);
        }, this);
        this.stopDrag = Event.fixScope(function(e) {
            this.mode = "drop";
            this.clickArea.removeEventListener('mousemove', this.dropEvent);
        }, this);
        
        Event.add(['mousedown'], this.clickArea, this.startDrag, this);
        Event.add(['mouseup'], this.clickArea, this.stopDrag, this);
        
        //Setup center
        this.centerPoint = new Point(comfort.getAttribute('cx'), comfort.getAttribute('cy'));
        console.log('center point', this.centerPoint);
    }
}


const p1 = new Point(5, 5);
const p2 = new Point(10, 10);

console.log(Point.distance(p1, p2));


var stage = new Stage();


