var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GraphComfortBase", "../Shared/Point", "../Shared/SVG"], function (require, exports, GraphComfortBase_1, Point_1, SVG_1) {
    "use strict";
    var GraphComfortEntry = (function (_super) {
        __extends(GraphComfortEntry, _super);
        function GraphComfortEntry() {
            var _this = _super.call(this) || this;
            _this.clickArea = document.getElementById('clickable');
            _this.setupOverActivity();
            return _this;
        }
        GraphComfortEntry.prototype.setupOverActivity = function () {
            var that = this;
            d3.select("#stage").on("mousemove", this.graphMove()); //this.checkArea);
        };
        GraphComfortEntry.prototype.setupClickActivity = function () {
            console.log("SETUP graph click");
            d3.select("#stage").on("mouseup", this.graphUp());
            d3.select("#stage").on("mousedown", this.graphDown());
        };
        GraphComfortEntry.prototype.graphMove = function () {
            /// 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = d3.mouse(this);
                var distance = Point_1.Point.distance(that.centerPoint, Point_1.Point.fromCoords(coord));
                var area = GraphComfortEntry.calculateDistance(distance);
                that.highlight(area);
            };
        };
        GraphComfortEntry.prototype.graphUp = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = Point_1.Point.fromCoords(d3.mouse(this));
                var distance = Point_1.Point.distance(that.centerPoint, coord);
                var area = GraphComfortEntry.calculateDistance(distance);
                that.saveTheInteraction(area, distance);
            };
        };
        GraphComfortEntry.prototype.graphDown = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                var coord = Point_1.Point.fromCoords(d3.mouse(this));
                var el = SVG_1.SVG.circle(8, coord.x, coord.y, "dropper");
                that.addDropper(el);
            };
        };
        GraphComfortEntry.prototype.highlight = function (area) {
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
        GraphComfortEntry.prototype.addDropper = function (el) {
            this.dropper = el;
            document.getElementById('stage').insertBefore(el, this.clickArea);
        };
        GraphComfortEntry.calculateDistance = function (distance) {
            if (distance < 100) {
                return "comfort";
            }
            else if (distance < 300) {
                return "stretch";
            }
            else {
                return "chaos";
            }
        };
        GraphComfortEntry.prototype.removeInteractions = function () {
            console.log("REMOVE activiteis from GraphComfortEntry");
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
        GraphComfortEntry.prototype.saveTheInteraction = function (area, distance) {
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
        GraphComfortEntry.prototype.show = function (user) {
            this.currentUser = user;
            var Thenable = this.showBase();
            this.setupOverActivity();
            return Thenable.then(this.setupClickActivity.bind(this));
        };
        return GraphComfortEntry;
    }(GraphComfortBase_1.GraphComfortBase));
    exports.GraphComfortEntry = GraphComfortEntry;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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WUFDSCxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLHVCQUF1QjtRQUMzQixDQUFDO1FBQ00sZ0NBQUksR0FBWCxVQUFZLElBQVM7WUFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBRUwsd0JBQUM7SUFBRCxDQXhJQSxBQXdJQyxDQXhJc0MsbUNBQWdCLEdBd0l0RDtJQXhJWSw4Q0FBaUIiLCJmaWxlIjoiR3JhcGhDb21mb3J0RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1VzZXJ9IGZyb20gJy4uL1NoYXJlZC9Vc2VyJztcbmltcG9ydCB7R3JhcGhDb21mb3J0QmFzZX0gZnJvbSAnLi9HcmFwaENvbWZvcnRCYXNlJztcbmltcG9ydCB7UG9pbnR9IGZyb20gJy4uL1NoYXJlZC9Qb2ludCc7XG5pbXBvcnQge1NWR30gZnJvbSAnLi4vU2hhcmVkL1NWRyc7XG5cbmV4cG9ydCBjbGFzcyBHcmFwaENvbWZvcnRFbnRyeSBleHRlbmRzIEdyYXBoQ29tZm9ydEJhc2Uge1xuICAgIGNsaWNrQXJlYSA6IEhUTUxFbGVtZW50O1xuICAgIGN1cnJlbnRVc2VyOlVzZXI7XG4gICAgZHJvcHBlciA6IFNWR0FFbGVtZW50O1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNsaWNrQXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGlja2FibGUnKTtcbiAgICAgICAgdGhpcy5zZXR1cE92ZXJBY3Rpdml0eSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXR1cE92ZXJBY3Rpdml0eSAoKSB7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBkMy5zZWxlY3QoXCIjc3RhZ2VcIikub24oXCJtb3VzZW1vdmVcIiwgdGhpcy5ncmFwaE1vdmUoKSk7Ly90aGlzLmNoZWNrQXJlYSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cENsaWNrQWN0aXZpdHkgKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNFVFVQIGdyYXBoIGNsaWNrXCIpO1xuICAgICAgICBkMy5zZWxlY3QoXCIjc3RhZ2VcIikub24oXCJtb3VzZXVwXCIsIHRoaXMuZ3JhcGhVcCgpKTtcbiAgICAgICAgZDMuc2VsZWN0KFwiI3N0YWdlXCIpLm9uKFwibW91c2Vkb3duXCIsIHRoaXMuZ3JhcGhEb3duKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ3JhcGhNb3ZlKCkge1xuICAgICAgICAvLy8gJ3RoYXQnIGlzIHRoZSBpbnN0YW5jZSBvZiBncmFwaCBcbiAgICAgICAgY29uc3QgdGhhdCA6IEdyYXBoQ29tZm9ydEVudHJ5ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGQ6dm9pZCwgaTpudW1iZXIpIHtcbiAgICAgICAgICAgIC8vICd0aGlzJyBpcyB0aGUgRE9NIGVsZW1lbnQgXG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IGQzLm1vdXNlKHRoaXMpO1xuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBQb2ludC5kaXN0YW5jZSh0aGF0LmNlbnRlclBvaW50LCBQb2ludC5mcm9tQ29vcmRzKGNvb3JkKSk7XG4gICAgICAgICAgICBjb25zdCBhcmVhID0gR3JhcGhDb21mb3J0RW50cnkuY2FsY3VsYXRlRGlzdGFuY2UoZGlzdGFuY2UpO1xuICAgICAgICAgICAgdGhhdC5oaWdobGlnaHQoYXJlYSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdyYXBoVXAoKSB7XG4gICAgICAgIC8vICd0aGF0JyBpcyB0aGUgaW5zdGFuY2Ugb2YgZ3JhcGggXG4gICAgICAgIGNvbnN0IHRoYXQgOiBHcmFwaENvbWZvcnRFbnRyeSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkOnZvaWQsIGkgOm51bWJlcikge1xuICAgICAgICAgICAgLy8gJ3RoaXMnIGlzIHRoZSBET00gZWxlbWVudCBcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gUG9pbnQuZnJvbUNvb3JkcyhkMy5tb3VzZSh0aGlzKSk7XG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IFBvaW50LmRpc3RhbmNlKHRoYXQuY2VudGVyUG9pbnQsIGNvb3JkKTtcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSBHcmFwaENvbWZvcnRFbnRyeS5jYWxjdWxhdGVEaXN0YW5jZShkaXN0YW5jZSk7ICAgICAgICAgIFxuICAgICAgICAgICAgdGhhdC5zYXZlVGhlSW50ZXJhY3Rpb24oYXJlYSwgZGlzdGFuY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBncmFwaERvd24oKSB7XG4gICAgICAgIC8vICd0aGF0JyBpcyB0aGUgaW5zdGFuY2Ugb2YgZ3JhcGggXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZDp2b2lkLCBpOm51bWJlcikge1xuICAgICAgICAgICAgLy8gJ3RoaXMnIGlzIHRoZSBET00gZWxlbWVudCBcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gUG9pbnQuZnJvbUNvb3JkcyhkMy5tb3VzZSh0aGlzKSk7XG4gICAgICAgICAgICBjb25zdCBlbCA9IFNWRy5jaXJjbGUoOCwgY29vcmQueCwgY29vcmQueSwgXCJkcm9wcGVyXCIpO1xuICAgICAgICAgICAgdGhhdC5hZGREcm9wcGVyKGVsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBoaWdobGlnaHQgKGFyZWEgOiBzdHJpbmcpIHtcbiAgICAgICAgLy88Y2lyY2xlIGlkPVwic3RyZXRjaFwiIHI9XCIzMDBcIiBjeD1cIjQwMFwiIGN5PVwiNDAwXCIgLz5cbiAgICAgICAgLy88Y2lyY2xlIGlkPVwiY29tZm9ydFwiIHI9XCIxMDBcIiBjeD1cIjQwMFwiIGN5PVwiNDAwXCIgLz5cblxuICAgIFxuICAgICAgICBjb25zdCBkM3pvbmVzID0gZDMuc2VsZWN0KFwic3ZnXCIpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKFwiLmFyZWFcIilcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAuZGVsYXkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IGFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxMDA7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZWFzZShcImN1YmljXCIpXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjUwO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gYXJlYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwicmdiKDAsIDE4MCwgMjE5KVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIiMwMEQ3RkVcIjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfVxuICAgIFxuXG4gICAgcHVibGljIGFkZERyb3BwZXIgKGVsIDogU1ZHQUVsZW1lbnQpICB7XG4gICAgICAgIHRoaXMuZHJvcHBlciA9IGVsO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhZ2UnKS5pbnNlcnRCZWZvcmUoZWwsIHRoaXMuY2xpY2tBcmVhKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNhbGN1bGF0ZURpc3RhbmNlKGRpc3RhbmNlKSB7XG4gICAgICAgIGlmKGRpc3RhbmNlIDwgMTAwKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJjb21mb3J0XCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlzdGFuY2UgPCAzMDApIHtcbiAgICAgICAgICAgIHJldHVybiBcInN0cmV0Y2hcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcImNoYW9zXCI7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHB1YmxpYyByZW1vdmVJbnRlcmFjdGlvbnMgKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJFTU9WRSBhY3Rpdml0ZWlzIGZyb20gR3JhcGhDb21mb3J0RW50cnlcIik7XG4gICAgICAgIGQzLnNlbGVjdChcIiNzdGFnZVwiKS5vbihcIm1vdXNldXBcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVOQ0xJQ0sgLSBHcmFwaHVwIC0gTm8gbG9uZ2VyIGludGVyYWN0aXZlIHN0YWdlXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgZDMuc2VsZWN0KFwiI3N0YWdlXCIpLm9uKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVTkNMSUNLIC0gR3JhcGhkb3duIC0gTm8gbG9uZ2VyIGludGVyYWN0aXZlIHN0YWdlXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgZDMuc2VsZWN0KFwiI3N0YWdlXCIpLm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVTk1vdmUgLSBtb3VzZW1vdmUgLSBObyBsb25nZXIgaW50ZXJhY3RpdmUgc3RhZ2VcIik7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9XG4gICAgcHVibGljIHNhdmVUaGVJbnRlcmFjdGlvbiAoYXJlYTpzdHJpbmcsIGRpc3RhbmNlOm51bWJlcikge1xuICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVUaGVJbnRlcmFjdGlvblwiKTtcbiAgICAgICAgdGhpcy5yZW1vdmVJbnRlcmFjdGlvbnMoKTtcblxuICAgICAgICAvL1RPRE86IFB1dCBpbiB0aGUgbGluZSBiZWxvd1xuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3NhdmVHcmFwaCcsIHtcbiAgICAgICAgICAgIFwiZGV0YWlsXCI6IHtcbiAgICAgICAgICAgICAgICBcImFyZWFcIjphcmVhLFxuICAgICAgICAgICAgICAgIFwiZGlzdGFuY2VcIjpkaXN0YW5jZSxcbiAgICAgICAgICAgICAgICBcImN1cnJlbnRVc2VyXCI6dGhpcy5jdXJyZW50VXNlclxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIC8vbWVkaWF0b3Iuc2F2ZUdyYXBoKCk7XG4gICAgfVxuICAgIHB1YmxpYyBzaG93KHVzZXI6VXNlcikge1xuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgICAgY29uc3QgVGhlbmFibGUgPSB0aGlzLnNob3dCYXNlKCk7XG4gICAgICAgIHRoaXMuc2V0dXBPdmVyQWN0aXZpdHkoKTtcbiAgICAgICAgcmV0dXJuIFRoZW5hYmxlLnRoZW4odGhpcy5zZXR1cENsaWNrQWN0aXZpdHkuYmluZCh0aGlzKSk7XG4gICAgfVxuXG59Il19
