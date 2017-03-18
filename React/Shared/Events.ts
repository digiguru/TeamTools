
import { SVGEvents } from "./SVGEvents";

export class Events {

    public static calculateDistance(distance) {
        if (distance < 100) {
            return "comfort";
        } else if (distance < 300) {
            return "stretch";
        } else {
            return "chaos";
        }
    }

    public static mouseEnter() {
        (<any>this).setState({focus: "in-focus"});
    }

    public static mouseDown() {
        (<any>this).setState({focus: "active"});
    }

    public static mouseUp(a) {
        const target: SVGElement = a.target;
        const center = SVGEvents.getCenter(target);
        const distance = SVGEvents.getDistance(a.clientX, a.clientY, target);
        (<any>this).setState({focus: "not-in-focus"});
    }

    public static mouseLeave() {
        (<any>this).setState({focus: "not-in-focus"});
    }

}

