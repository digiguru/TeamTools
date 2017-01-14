var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GraphTuckmanBase", "../Shared/Point", "../Shared/SVG"], function (require, exports, GraphTuckmanBase_1, Point_1, SVG_1) {
    "use strict";
    var GraphTuckmanEntry = (function (_super) {
        __extends(GraphTuckmanEntry, _super);
        function GraphTuckmanEntry() {
            var _this = _super.call(this) || this;
            _this.clickArea = document.getElementById('clickable');
            _this.setupOverActivity();
            return _this;
        }
        GraphTuckmanEntry.prototype.setupOverActivity = function () {
            var that = this;
            d3.select("#stage").on("mousemove", this.graphMove()); //this.checkArea);
        };
        GraphTuckmanEntry.prototype.setupClickActivity = function () {
            console.log("SETUP graph click");
            d3.select("#stage").on("mouseup", this.graphUp());
            d3.select("#stage").on("mousedown", this.graphDown());
        };
        GraphTuckmanEntry.prototype.graphMove = function () {
            /// 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = Point_1.Point.fromCoords(d3.mouse(this));
                var distance = coord.x;
                var area = GraphTuckmanEntry.calculateDistance(distance);
                that.highlight(area);
            };
        };
        GraphTuckmanEntry.prototype.graphUp = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = Point_1.Point.fromCoords(d3.mouse(this));
                var distance = coord.x;
                var area = GraphTuckmanEntry.calculateDistance(distance);
                that.saveTheInteraction(area, distance);
            };
        };
        GraphTuckmanEntry.prototype.graphDown = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = Point_1.Point.fromCoords(d3.mouse(this));
                var el = SVG_1.SVG.circle(8, coord.x, coord.y, "dropper");
                that.addDropper(el);
            };
        };
        GraphTuckmanEntry.prototype.highlight = function (area) {
            //<circle id="stretch" r="300" cx="400" cy="400" />
            //<circle id="comfort" r="100" cx="400" cy="400" />
            var d3zones = d3.select("svg")
                .selectAll(".area")
                .transition()
                .delay(function () {
                if (this.getAttribute("id") === area) {
                    return 0;
                }
                return 100;
            })
                .ease("cubic")
                .duration(function () {
                return 250;
            })
                .style("fill", function () {
                if (this.getAttribute("id") === area) {
                    return "rgb(0, 180, 219)";
                }
                return "#00D7FE";
            });
        };
        GraphTuckmanEntry.prototype.addDropper = function (el) {
            this.dropper = el;
            document.getElementById('stage').insertBefore(el, this.clickArea);
        };
        GraphTuckmanEntry.calculateDistance = function (distance) {
            if (distance < 200) {
                return "forming";
            }
            else if (distance < 400) {
                return "storming";
            }
            else if (distance < 600) {
                return "norming";
            }
            else {
                return "performing";
            }
        };
        GraphTuckmanEntry.prototype.removeInteractions = function () {
            console.log("REMOVE activiteis from GraphTuckmanEntry");
            d3.select("#stage").on("mouseup", function () {
                console.log("UNCLICK - Graphup - No longer interactive stage");
            });
            d3.select("#stage").on("mousedown", function () {
                console.log("UNCLICK - Graphdown - No longer interactive stage");
            });
            d3.select("#stage").on("mousemove", function () {
                console.log("UNMove - mousemove - No longer interactive stage");
            });
        };
        GraphTuckmanEntry.prototype.saveTheInteraction = function (area, distance) {
            console.log("saveTheInteraction");
            this.removeInteractions();
            //TODO: Put in the line below
            var event = new CustomEvent('saveGraph', {
                "detail": {
                    "area": area,
                    "distance": distance,
                    "currentUser": this.currentUser
                }
            });
            document.dispatchEvent(event);
            //mediator.saveGraph();
        };
        GraphTuckmanEntry.prototype.show = function (user) {
            this.currentUser = user;
            var Thenable = this.showBase();
            this.setupOverActivity();
            return Thenable.then(this.setupClickActivity.bind(this));
        };
        return GraphTuckmanEntry;
    }(GraphTuckmanBase_1.GraphTuckmanBase));
    exports.GraphTuckmanEntry = GraphTuckmanEntry;
});

//# sourceMappingURL=GraphTuckmanEntry.js.map
