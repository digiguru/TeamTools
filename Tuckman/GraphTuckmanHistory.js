var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GraphTuckmanBase"], function (require, exports, GraphTuckmanBase_1) {
    "use strict";
    var GraphTuckmanHistory = (function (_super) {
        __extends(GraphTuckmanHistory, _super);
        function GraphTuckmanHistory() {
            var _this = _super.call(this) || this;
            _this.graphData = new Array();
            return _this;
            //this.setupHistory();
        }
        GraphTuckmanHistory.prototype.show = function (graphData) {
            this.graphData = graphData;
            var Thenable = this.showBase();
            var totalPoints = graphData.length;
            var totalHeight = 800;
            var heightDivision = totalHeight / totalPoints;
            d3.select("g#history")
                .selectAll("circle")
                .data(this.graphData)
                .enter()
                .append("circle")
                .attr("cx", 0)
                .attr("cy", function (data, index) {
                return (heightDivision * index) + 100;
            })
                .attr("r", 10)
                .attr("class", "point")
                .attr("id", function (d) {
                return d.user.name;
            });
            d3.select("g#history")
                .selectAll("circle")
                .transition()
                .duration(function () {
                return 800;
            })
                .attr("cx", function (data, index) {
                return data.distance;
            })
                .attr("cy", function (data, index) {
                return (heightDivision * index) + 100;
            });
            Thenable.then(function () {
                console.log("SHOWED base graph - now what?");
            });
            return Thenable;
        };
        GraphTuckmanHistory.prototype.hide = function () {
            return null;
        };
        return GraphTuckmanHistory;
    }(GraphTuckmanBase_1.GraphTuckmanBase));
    exports.GraphTuckmanHistory = GraphTuckmanHistory;
});

//# sourceMappingURL=GraphTuckmanHistory.js.map
