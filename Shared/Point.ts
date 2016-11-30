//import Polar = require('Polar');

import {Polar} from './Polar';
export class Point {
    x : number;
    y : number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }
    static fromCoords(coords:Array<number>) {
        return new Point(coords[0],coords[1]);
    }
    public static fromOffset(point:Point, origin:Point):Point {
        const dx = point.x - origin.x;
        const dy = point.y - origin.y;
        return new Point(dx,dy);
    }
    public static toOffset(point:Point, origin:Point):Point {
        const dx = point.x + origin.x;
        const dy = point.y + origin.y;
        return new Point(dx,dy);
    }
    public static distance(point:Point , origin:Point):number {
        const offset = Point.fromOffset(point, origin);
        return Point.distanceFromOffset(offset);
    }
    public static distanceFromOffset(offset:Point):number {
        return Math.sqrt(offset.x * offset.x + offset.y * offset.y);
    }
    public static toCartesianNoOffset(polar:Polar):Point {
        const x = polar.radius * Math.cos(polar.angle);
        const y = polar.radius * Math.sin(polar.angle);
        return new Point(x, y); 
    }
    public static toCartesian(polar:Polar,origin:Point):Point {
        const point = Point.toCartesianNoOffset(polar);
        return Point.toOffset(point,origin); 
    }
    public static toPolar(point:Point, origin:Point):Polar {
        const offset = Point.fromOffset(point, origin);
        const radius = Point.distanceFromOffset(offset);
        const angle = Math.atan2(offset.y, offset.x);
        return new Polar(radius, angle);
    }
}
//});
