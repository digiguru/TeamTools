
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
        this.startDrag = function(e) {
            this.mode = "drag";
            this.clickArea.addEventListener('mousemove', this.dropEvent);
        }
        this.stopDrag = function(e) {
            this.mode = "drop";
            this.clickArea.removeEventListener('mousemove', this.dropEvent);
        }
        this.dropEvent = function(e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            console.log(this.mode, 'distance', Point.distance(this.centerPoint, clickPoint))
            return true;
        };
        this.dropEvent = this.dropEvent.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        ['mousedown','mouseup'].forEach(function(e){
            this.clickArea.addEventListener(e, this.dropEvent);
        }, this);
        this.clickArea.addEventListener('mousedown', this.startDrag);
        this.clickArea.addEventListener('mouseup', this.stopDrag);
        
        this.centerPoint = new Point(comfort.getAttribute('cx'), comfort.getAttribute('cy'));
        console.log('center point', this.centerPoint);
    }
}


const p1 = new Point(5, 5);
const p2 = new Point(10, 10);

console.log(Point.distance(p1, p2));


var stage = new Stage();


