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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LFdBQVc7aUJBQ2pDO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5Qix1QkFBdUI7UUFDM0IsQ0FBQztRQUNNLGdDQUFJLEdBQVgsVUFBWSxJQUFTO1lBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUN6QixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUVMLHdCQUFDO0lBQUQsQ0ExSUEsQUEwSUMsQ0ExSXNDLG1DQUFnQixHQTBJdEQ7SUExSVksOENBQWlCIiwiZmlsZSI6IkdyYXBoVHVja21hbkVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtVc2VyfSBmcm9tICcuLi9TaGFyZWQvVXNlcic7XG5pbXBvcnQge0dyYXBoVHVja21hbkJhc2V9IGZyb20gJy4vR3JhcGhUdWNrbWFuQmFzZSc7XG5pbXBvcnQge1BvaW50fSBmcm9tICcuLi9TaGFyZWQvUG9pbnQnO1xuaW1wb3J0IHtTVkd9IGZyb20gJy4uL1NoYXJlZC9TVkcnO1xuXG5leHBvcnQgY2xhc3MgR3JhcGhUdWNrbWFuRW50cnkgZXh0ZW5kcyBHcmFwaFR1Y2ttYW5CYXNlIHtcbiAgICBjbGlja0FyZWEgOiBIVE1MRWxlbWVudDtcbiAgICBjdXJyZW50VXNlcjpVc2VyO1xuICAgIGRyb3BwZXIgOiBTVkdBRWxlbWVudDtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jbGlja0FyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xpY2thYmxlJyk7XG4gICAgICAgIHRoaXMuc2V0dXBPdmVyQWN0aXZpdHkoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0dXBPdmVyQWN0aXZpdHkgKCkge1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgZDMuc2VsZWN0KFwiI3N0YWdlXCIpLm9uKFwibW91c2Vtb3ZlXCIsIHRoaXMuZ3JhcGhNb3ZlKCkpOy8vdGhpcy5jaGVja0FyZWEpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBDbGlja0FjdGl2aXR5ICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTRVRVUCBncmFwaCBjbGlja1wiKTtcbiAgICAgICAgZDMuc2VsZWN0KFwiI3N0YWdlXCIpLm9uKFwibW91c2V1cFwiLCB0aGlzLmdyYXBoVXAoKSk7XG4gICAgICAgIGQzLnNlbGVjdChcIiNzdGFnZVwiKS5vbihcIm1vdXNlZG93blwiLCB0aGlzLmdyYXBoRG93bigpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdyYXBoTW92ZSgpIHtcbiAgICAgICAgLy8vICd0aGF0JyBpcyB0aGUgaW5zdGFuY2Ugb2YgZ3JhcGggXG4gICAgICAgIGNvbnN0IHRoYXQgOiBHcmFwaFR1Y2ttYW5FbnRyeSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkOnZvaWQsIGk6bnVtYmVyKSB7XG4gICAgICAgICAgICAvLyAndGhpcycgaXMgdGhlIERPTSBlbGVtZW50IFxuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBQb2ludC5mcm9tQ29vcmRzKGQzLm1vdXNlKHRoaXMpKTtcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gY29vcmQueDtcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSBHcmFwaFR1Y2ttYW5FbnRyeS5jYWxjdWxhdGVEaXN0YW5jZShkaXN0YW5jZSk7XG4gICAgICAgICAgICB0aGF0LmhpZ2hsaWdodChhcmVhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ3JhcGhVcCgpIHtcbiAgICAgICAgLy8gJ3RoYXQnIGlzIHRoZSBpbnN0YW5jZSBvZiBncmFwaCBcbiAgICAgICAgY29uc3QgdGhhdCA6IEdyYXBoVHVja21hbkVudHJ5ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGQ6dm9pZCwgaSA6bnVtYmVyKSB7XG4gICAgICAgICAgICAvLyAndGhpcycgaXMgdGhlIERPTSBlbGVtZW50IFxuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBQb2ludC5mcm9tQ29vcmRzKGQzLm1vdXNlKHRoaXMpKTtcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gY29vcmQueDtcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSBHcmFwaFR1Y2ttYW5FbnRyeS5jYWxjdWxhdGVEaXN0YW5jZShkaXN0YW5jZSk7ICAgICAgICAgIFxuICAgICAgICAgICAgdGhhdC5zYXZlVGhlSW50ZXJhY3Rpb24oYXJlYSwgZGlzdGFuY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBncmFwaERvd24oKSB7XG4gICAgICAgIC8vICd0aGF0JyBpcyB0aGUgaW5zdGFuY2Ugb2YgZ3JhcGggXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZDp2b2lkLCBpOm51bWJlcikge1xuICAgICAgICAgICAgLy8gJ3RoaXMnIGlzIHRoZSBET00gZWxlbWVudCBcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gUG9pbnQuZnJvbUNvb3JkcyhkMy5tb3VzZSh0aGlzKSk7XG4gICAgICAgICAgICBjb25zdCBlbCA9IFNWRy5jaXJjbGUoOCwgY29vcmQueCwgY29vcmQueSwgXCJkcm9wcGVyXCIpO1xuICAgICAgICAgICAgdGhhdC5hZGREcm9wcGVyKGVsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBoaWdobGlnaHQgKGFyZWEgOiBzdHJpbmcpIHtcbiAgICAgICAgLy88Y2lyY2xlIGlkPVwic3RyZXRjaFwiIHI9XCIzMDBcIiBjeD1cIjQwMFwiIGN5PVwiNDAwXCIgLz5cbiAgICAgICAgLy88Y2lyY2xlIGlkPVwiY29tZm9ydFwiIHI9XCIxMDBcIiBjeD1cIjQwMFwiIGN5PVwiNDAwXCIgLz5cblxuICAgIFxuICAgICAgICBjb25zdCBkM3pvbmVzID0gZDMuc2VsZWN0KFwic3ZnXCIpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKFwiLmFyZWFcIilcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZGVsYXkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IGFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxMDA7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZWFzZShcImN1YmljXCIpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjUwO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gYXJlYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwicmdiKDAsIDE4MCwgMjE5KVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIiMwMEQ3RkVcIjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfVxuICAgIFxuXG4gICAgcHVibGljIGFkZERyb3BwZXIgKGVsIDogU1ZHQUVsZW1lbnQpICB7XG4gICAgICAgIHRoaXMuZHJvcHBlciA9IGVsO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhZ2UnKS5pbnNlcnRCZWZvcmUoZWwsIHRoaXMuY2xpY2tBcmVhKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNhbGN1bGF0ZURpc3RhbmNlKGRpc3RhbmNlKSB7XG4gICAgICAgIGlmKGRpc3RhbmNlIDwgMjAwKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJmb3JtaW5nXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlzdGFuY2UgPCA0MDApIHtcbiAgICAgICAgICAgIHJldHVybiBcInN0b3JtaW5nXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlzdGFuY2UgPCA2MDApIHtcbiAgICAgICAgICAgIHJldHVybiBcIm5vcm1pbmdcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcInBlcmZvcm1pbmdcIjtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcHVibGljIHJlbW92ZUludGVyYWN0aW9ucyAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUkVNT1ZFIGFjdGl2aXRlaXMgZnJvbSBHcmFwaFR1Y2ttYW5FbnRyeVwiKTtcbiAgICAgICAgZDMuc2VsZWN0KFwiI3N0YWdlXCIpLm9uKFwibW91c2V1cFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVU5DTElDSyAtIEdyYXBodXAgLSBObyBsb25nZXIgaW50ZXJhY3RpdmUgc3RhZ2VcIik7XG4gICAgICAgIH0pO1xuICAgICAgICBkMy5zZWxlY3QoXCIjc3RhZ2VcIikub24oXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVOQ0xJQ0sgLSBHcmFwaGRvd24gLSBObyBsb25nZXIgaW50ZXJhY3RpdmUgc3RhZ2VcIik7XG4gICAgICAgIH0pO1xuICAgICAgICBkMy5zZWxlY3QoXCIjc3RhZ2VcIikub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVOTW92ZSAtIG1vdXNlbW92ZSAtIE5vIGxvbmdlciBpbnRlcmFjdGl2ZSBzdGFnZVwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH1cbiAgICBwdWJsaWMgc2F2ZVRoZUludGVyYWN0aW9uIChhcmVhOnN0cmluZywgZGlzdGFuY2U6bnVtYmVyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZVRoZUludGVyYWN0aW9uXCIpO1xuICAgICAgICB0aGlzLnJlbW92ZUludGVyYWN0aW9ucygpO1xuXG4gICAgICAgIC8vVE9ETzogUHV0IGluIHRoZSBsaW5lIGJlbG93XG4gICAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnc2F2ZUdyYXBoJywge1xuICAgICAgICAgICAgXCJkZXRhaWxcIjoge1xuICAgICAgICAgICAgICAgIFwiYXJlYVwiOmFyZWEsXG4gICAgICAgICAgICAgICAgXCJkaXN0YW5jZVwiOmRpc3RhbmNlLFxuICAgICAgICAgICAgICAgIFwiY3VycmVudFVzZXJcIjp0aGlzLmN1cnJlbnRVc2VyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgLy9tZWRpYXRvci5zYXZlR3JhcGgoKTtcbiAgICB9XG4gICAgcHVibGljIHNob3codXNlcjpVc2VyKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgICAgICBjb25zdCBUaGVuYWJsZSA9IHRoaXMuc2hvd0Jhc2UoKTtcbiAgICAgICAgdGhpcy5zZXR1cE92ZXJBY3Rpdml0eSgpO1xuICAgICAgICByZXR1cm4gVGhlbmFibGUudGhlbih0aGlzLnNldHVwQ2xpY2tBY3Rpdml0eS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbn0iXX0=
