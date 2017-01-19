import {TuckmanUserChoice} from "./TuckmanUserChoice";
import {GraphTuckmanBase} from "./GraphTuckmanBase";
import {Point} from "../Shared/Point";
import {Polar} from "../Shared/Polar";


export class GraphTuckmanHistory extends GraphTuckmanBase {

    public graphData = new Array<TuckmanUserChoice>();
    public d3Points;
    constructor() {
        super();
    }

    public show(graphData: Array<TuckmanUserChoice>): Thenable<number> {
        this.graphData = graphData;
        const Thenable = this.showBase();

        const totalPoints = graphData.length;
        const totalHeight = 800;
        const heightDivision = totalHeight / totalPoints;

        d3.select("g#history")
            .selectAll("circle")
            .data(this.graphData)
                .enter()
                .append("circle")
                .attr("cx", 0)
                .attr("cy", (data: TuckmanUserChoice, index) => (heightDivision * index) + 100)
                .attr("r", 10)
                .attr("class", "point")
                .attr("id", (d: TuckmanUserChoice) => d.user.name);
        d3.select("g#history")
            .selectAll("circle")
            .transition()
            .duration(() => 800)
            .attr("cx", (data: TuckmanUserChoice, index) => data.distance)
            .attr("cy", (data: TuckmanUserChoice, index) => (heightDivision * index) + 100);


        Thenable.then(() => {
            console.log("SHOWED base graph - now what?");
        });
        return Thenable;
    }

    public hide(): Thenable<number> {
        return null;
    }
}