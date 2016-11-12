define(["require", "exports", 'Timed', 'ComfortZones', 'Point'], function (require, exports, Timed_1, ComfortZones_1, Point_1) {
    "use strict";
    var GraphComfortBase = (function () {
        function GraphComfortBase() {
            this.setupArea();
        }
        GraphComfortBase.prototype.setupArea = function () {
            var zones = [new ComfortZones_1.ComfortZones("stretch", 300), new ComfortZones_1.ComfortZones("comfort", 100)];
            var d3zones = d3.select("g#zones")
                .selectAll("circle")
                .data(zones);
            d3zones.enter().append("circle")
                .attr("cx", 400)
                .attr("cy", 400)
                .attr("r", 0)
                .attr("class", "area")
                .attr("id", function (d) {
                return d.name;
            });
            this.chaos = document.getElementById('chaos');
            this.stretch = document.getElementById('stretch');
            this.comfort = document.getElementById('comfort');
            var centerX = Number(this.comfort.getAttribute('cx'));
            var centerY = Number(this.comfort.getAttribute('cy'));
            this.centerPoint = new Point_1.Point(centerX, centerY);
        };
        GraphComfortBase.prototype.hide = function () {
            console.log("HIDE comfortGRAPH");
            var d3zones = d3.select("g#zones")
                .selectAll("circle")
                .transition()
                .duration(1000)
                .attr("r", 0);
            var d3drops = d3.select("#stage")
                .selectAll("circle.dropper")
                .transition()
                .delay(250)
                .duration(250)
                .attr("r", 0);
            return Timed_1.Timed.for(1000);
        };
        GraphComfortBase.prototype.showBase = function () {
            console.log("SHOW graph");
            var d3zones = d3.select("g#zones")
                .selectAll("circle")
                .attr("r", 0)
                .transition()
                .duration(1000)
                .delay(function (d, i) { return i * 100; })
                .ease("elastic")
                .attr("r", function (d) {
                return d.radius;
            });
            return Timed_1.Timed.for(1000);
        };
        return GraphComfortBase;
    }());
    exports.GraphComfortBase = GraphComfortBase;
});
//# sourceMappingURL=GraphComfortBase.js.map