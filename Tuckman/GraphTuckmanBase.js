define(["require", "exports", "../Shared/Timed", "./TuckmanZones", "../Shared/Point"], function (require, exports, Timed_1, TuckmanZones_1, Point_1) {
    "use strict";
    var GraphTuckmanBase = (function () {
        function GraphTuckmanBase() {
            this.setupArea();
        }
        GraphTuckmanBase.prototype.setupArea = function () {
            this.startPoint = new Point_1.Point(0, 400);
            var zones = [
                new TuckmanZones_1.TuckmanZones("forming", 0, 200),
                new TuckmanZones_1.TuckmanZones("storming", 200, 200),
                new TuckmanZones_1.TuckmanZones("norming", 400, 200),
                new TuckmanZones_1.TuckmanZones("performing", 600, 200)
            ];
            var d3zones = d3.select("g#zones")
                .selectAll("rect")
                .data(zones);
            d3zones.enter().append("rect")
                .attr("x", 0)
                .attr("y", 400)
                .attr("class", "area")
                .attr("id", function (d) {
                return d.name;
            });
            this.forming = document.getElementById('forming');
            this.storming = document.getElementById('storming');
            this.norming = document.getElementById('norming');
            this.performing = document.getElementById('performing');
        };
        GraphTuckmanBase.prototype.hide = function () {
            console.log("HIDE comfortGRAPH");
            var d3zones = d3.select("g#zones")
                .selectAll("rect")
                .transition()
                .duration(1000)
                .attr("x", 0)
                .attr("width", 0);
            var d3drops = d3.select("#stage")
                .selectAll("circle.dropper")
                .transition()
                .delay(250)
                .duration(250)
                .attr("r", 0);
            return Timed_1.Timed.for(1000);
        };
        GraphTuckmanBase.prototype.showBase = function () {
            console.log("SHOW graph");
            var d3zones = d3.select("g#zones")
                .selectAll("rect")
                .attr("x", 0)
                .attr("width", 0)
                .transition()
                .duration(1000)
                .delay(function (d, i) { return i * 100; })
                .ease("elastic")
                .attr("x", function (d) {
                return d.left;
            })
                .attr("width", function (d) {
                return d.width;
            });
            return Timed_1.Timed.for(1000);
        };
        return GraphTuckmanBase;
    }());
    exports.GraphTuckmanBase = GraphTuckmanBase;
});

//# sourceMappingURL=GraphTuckmanBase.js.map
