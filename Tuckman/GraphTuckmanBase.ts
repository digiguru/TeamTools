import {Timed} from 'Timed';
import {TuckmanZones} from 'TuckmanZones';
import {Point} from 'Point';


export class GraphTuckmanBase {
    forming : HTMLElement;
    storming : HTMLElement;
    norming : HTMLElement;
    performing : HTMLElement;
    startPoint : Point;
    constructor() {
        this.setupArea();
    }

    private setupArea () {
        
        this.startPoint = new Point(0, 400);

        const zones = [
            new TuckmanZones("forming", 0, 200), 
            new TuckmanZones("storming", 200, 200), 
            new TuckmanZones("norming", 400, 200), 
            new TuckmanZones("performing", 600, 200)
            ];
        const d3zones = d3.select("g#zones")
            .selectAll("rect")
            .data(zones);

        d3zones.enter().append("rect")
                .attr("x", 0)
                .attr("y", 400)
                .attr("class", "area")
                .attr("id", function(d:TuckmanZones) {
                    return d.name;
            });
        

        this.forming = document.getElementById('forming');
        this.storming = document.getElementById('storming');
        this.norming = document.getElementById('norming');
        this.performing = document.getElementById('performing');
        

    }
    public hide():Thenable<number> {
        console.log("HIDE comfortGRAPH");
        
        const d3zones = d3.select("g#zones")    
            .selectAll("rect")
                .transition()
                .duration(1000)
                .attr("x", 0)
                .attr("width", 0);

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
            .selectAll("rect")
                .attr("x", 0)
                .attr("width", 0)
            .transition()
                .duration(1000)
                .delay(function(d, i) { return i * 100; })
                .ease("elastic")
                .attr("x", function(d:TuckmanZones) { 
                    return d.left; 
                })
                .attr("width", function(d:TuckmanZones) { 
                    return d.width; 
                }); 
        
        return Timed.for(1000);
        
    }

}