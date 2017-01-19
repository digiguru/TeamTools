import {User} from "../Shared/User";
import {GraphTuckmanBase} from "./GraphTuckmanBase";
import {Point} from "../Shared/Point";
import {SVG} from "../Shared/SVG";

export class GraphTuckmanEntry extends GraphTuckmanBase {
    clickArea: HTMLElement;
    currentUser: User;
    dropper: SVGAElement;

    constructor() {
        super();
        this.clickArea = document.getElementById("clickable");
        this.setupOverActivity();
    }

    public setupOverActivity () {
        const that = this;
        d3.select("#stage").on("mousemove", this.graphMove());
    }

    private setupClickActivity () {
        console.log("SETUP graph click");
        d3.select("#stage").on("mouseup", this.graphUp());
        d3.select("#stage").on("mousedown", this.graphDown());
    }

    private graphMove() {
        // "that" is the instance of graph
        const that: GraphTuckmanEntry = this;
        return function(d: void, i: number) {
            // "this" is the DOM element
            const coord = Point.fromCoords(d3.mouse(this));
            const distance = coord.x;
            const area = GraphTuckmanEntry.calculateDistance(distance);
            that.highlight(area);
        };
    }

    private graphUp() {
        // "that" is the instance of graph
        const that: GraphTuckmanEntry = this;
        return function(d: void, i: number) {
            // "this" is the DOM element
            const coord = Point.fromCoords(d3.mouse(this));
            const distance = coord.x;
            const area = GraphTuckmanEntry.calculateDistance(distance);
            that.saveTheInteraction(area, distance);
        };
    }

    private graphDown() {
        // "that" is the instance of graph
        const that = this;
        return function(d: void, i: number) {
            // "this" is the DOM element
            const coord = Point.fromCoords(d3.mouse(this));
            const el = SVG.circle(8, coord.x, coord.y, "dropper");
            that.addDropper(el);
        };
    }

    public highlight (area: string) {
        const d3zones = d3.select("svg")
            .selectAll(".area")
            .transition()
                .delay(function() {
                    if (this.getAttribute("id") === area) {
                        return 0;
                    }
                    return 100;
                })
                .ease("cubic")
                .duration(() => 250)
                .style("fill", function() {
                    if (this.getAttribute("id") === area) {
                        return "rgb(0, 180, 219)";
                    }
                    return "#00D7FE";
                });

    }


    public addDropper (el: SVGAElement)  {
        this.dropper = el;
        document.getElementById("stage").insertBefore(el, this.clickArea);
    }

    public static calculateDistance(distance) {
        if (distance < 200) {
            return "forming";
        } else if (distance < 400) {
            return "storming";
        } else if (distance < 600) {
            return "norming";
        } else {
            return "performing";
        }
    }


    public removeInteractions () {
        console.log("REMOVE activiteis from GraphTuckmanEntry");
        d3.select("#stage").on("mouseup", () => {
            console.log("UNCLICK - Graphup - No longer interactive stage");
        });
        d3.select("#stage").on("mousedown", () => {
            console.log("UNCLICK - Graphdown - No longer interactive stage");
        });
        d3.select("#stage").on("mousemove", () => {
            console.log("UNMove - mousemove - No longer interactive stage");
        });
    }

    public saveTheInteraction (area: string, distance: number) {
        console.log("saveTheInteraction");
        this.removeInteractions();

        // TODO: Put in the line below
        const event = new CustomEvent("saveGraph", {
            "detail": {
                "area": area,
                "distance": distance,
                "currentUser": this.currentUser
            }
        });
        document.dispatchEvent(event);
    }
    public show(user: User) {
        this.currentUser = user;
        const Thenable = this.showBase();
        this.setupOverActivity();
        return Thenable.then(this.setupClickActivity.bind(this));
    }

}