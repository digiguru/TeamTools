import {Timed} from "../Shared/Timed";
import {ComfortZones} from "./ComfortZones";
import {Point} from "../Shared/Point";


export class GraphComfortBase {
    chaos : HTMLElement;
    stretch : HTMLElement;
    comfort : HTMLElement;
    centerPoint : Point;
    
    constructor() {
        this.setupArea();
    }

    private setupArea () {
        
        
        const zones = [new ComfortZones("stretch",300), new ComfortZones("comfort",100)];
        const d3zones = d3.select("g#zones")
            .selectAll("circle")
            .data(zones);

        d3zones.enter().append("circle")
            .attr("cx", 400)
                .attr("cy", 400)
                .attr("r", 0)
                .attr("class", "area")
                .attr("id", function(d:ComfortZones) {
                    return d.name;
            });
        

        this.chaos = document.getElementById("chaos");
        this.stretch = document.getElementById("stretch");
        this.comfort = document.getElementById("comfort");
        const centerX = Number(this.comfort.getAttribute("cx"));
        const centerY = Number(this.comfort.getAttribute("cy"));
        this.centerPoint = new Point(centerX,centerY);
        

    }
    public hide():Thenable<number> {
        console.log("HIDE comfortGRAPH");
        
        const d3zones = d3.select("g#zones")    
            .selectAll("circle")
                .transition()
                .duration(1000)
                .attr("r", 0);

        const d3drops = d3.select("#stage")
            .selectAll("circle.dropper")   
            .transition()
                .delay(250)
                .duration(250)
                .attr("r", 0);
        return Timed.for(1000);
                
    }
    public showBase():Thenable<number> {
        console.log("SHOW graph");
        const d3zones = d3.select("g#zones")
            .selectAll("circle")
                .attr("r", 0)
            .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 100; })
                .ease("elastic")
                .attr("r", function(d:ComfortZones) { 
                    return d.radius; 
                }); 
        
        return Timed.for(1000);
        
    }

}