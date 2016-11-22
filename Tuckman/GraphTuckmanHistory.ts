import {TuckmanUserChoice} from 'TuckmanUserChoice';
import {GraphTuckmanBase} from 'GraphTuckmanBase';
import {Point} from 'Point';
import {Polar} from 'Polar';


export class GraphTuckmanHistory extends GraphTuckmanBase {
    
    public graphData = new Array<TuckmanUserChoice>();
    public d3Points;
    constructor() {
        super(); 
        //this.setupHistory();
    }

    public show(graphData : Array<TuckmanUserChoice>):Thenable<number> {
        this.graphData = graphData;
        const Thenable = this.showBase();
        d3.select("g#history")
            .selectAll("circle")
            .data(this.graphData)
                .enter()
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 400)
                .attr("r", 10)
                .attr("class", "point")
                .attr("id", function(d:TuckmanUserChoice) {
                    return d.user.name;
                });
        const totalPoints = graphData.length;
        const totalHeight = 800;
        const heightDivision = totalHeight / totalPoints;
        d3.select("g#history")
            .selectAll("circle")
            .transition()
            .duration(function() {
                return 800;
            })
            .attr("cx", function(data:TuckmanUserChoice, index) {
                return data.distance;
            })
            .attr("cy", function(data:TuckmanUserChoice, index) {
                return heightDivision * index;
            });


        Thenable.then(function() {
        console.log("SHOWED base graph - now what?");
        });
        return Thenable;
    }

    public hide():Thenable<number> {
        return null;
    }
}