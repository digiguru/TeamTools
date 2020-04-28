import {Point} from "../Models/Point";

export class SVGEvents {

    public static getDistance(x: number, y: number, target: SVGElement) {
        return Point.distance(new Point(x, y), SVGEvents.getCenter(target));
    }
    public static getCenter(target: SVGElement) {
        const rect = target.getBoundingClientRect();
        return new Point(
            rect.left + (rect.width / 2),
            rect.top + (rect.height / 2)
        );
    }
}