import {ComfortUserChoice} from 'ComfortUserChoice';
import {GraphComfortBase} from 'GraphComfortBase';
import {Point} from '../Shared/Point';
import {Polar} from '../Shared/Polar';


export class GraphComfortHistory extends GraphComfortBase {
    
    public graphData = new Array<ComfortUserChoice>();
    public d3Points;
    constructor() {
        super(); 
        //this.setupHistory();
    }

    public show(graphData : Array<ComfortUserChoice>):Thenable<number> {
        this.graphData = graphData;
        const Thenable = this.showBase();
        d3.select("g#history")
            .selectAll("circle")
            .data(this.graphData)
                .enter()
                .append("circle")
                .attr("cx", 400)
                .attr("cy", 400)
                .attr("r", 10)
                .attr("class", "point")
                .attr("id", function(d:ComfortUserChoice) {
                    return d.user.name;
                });
        const totalPoints = graphData.length;
        const radian = 6.2831853072;//360 * Math.PI / 180;
        const polarDivision = radian / totalPoints;
        d3.select("g#history")
            .selectAll("circle")
            .transition()
            .duration(function() {
                return 800;
            })
            .attr("cx", function(data:ComfortUserChoice, index) {
                const angle = polarDivision * index;
                return Point.toCartesian(new Polar(data.distance, angle), new Point(400,400)).x;
            })
            .attr("cy", function(data:ComfortUserChoice, index) {
                const angle = polarDivision * index;
                return Point.toCartesian(new Polar(data.distance, angle), new Point(400,400)).y;
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