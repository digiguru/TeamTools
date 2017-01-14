var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GraphComfortBase", "../Shared/Point", "../Shared/Polar"], function (require, exports, GraphComfortBase_1, Point_1, Polar_1) {
    "use strict";
    var GraphComfortHistory = (function (_super) {
        __extends(GraphComfortHistory, _super);
        function GraphComfortHistory() {
            var _this = _super.call(this) || this;
            _this.graphData = new Array();
            return _this;
            //this.setupHistory();
        }
        GraphComfortHistory.prototype.show = function (graphData) {
            this.graphData = graphData;
            var Thenable = this.showBase();
            d3.select("g#history")
                .selectAll("circle")
                .data(this.graphData)
                .enter()
                .append("circle")
                .attr("cx", 400)
                .attr("cy", 400)
                .attr("r", 10)
                .attr("class", "point")
                .attr("id", function (d) {
                return d.user.name;
            });
            var totalPoints = graphData.length;
            var radian = 6.2831853072; //360 * Math.PI / 180;
            var polarDivision = radian / totalPoints;
            d3.select("g#history")
                .selectAll("circle")
                .transition()
                .duration(function () {
                return 800;
            })
                .attr("cx", function (data, index) {
                var angle = polarDivision * index;
                return Point_1.Point.toCartesian(new Polar_1.Polar(data.distance, angle), new Point_1.Point(400, 400)).x;
            })
                .attr("cy", function (data, index) {
                var angle = polarDivision * index;
                return Point_1.Point.toCartesian(new Polar_1.Polar(data.distance, angle), new Point_1.Point(400, 400)).y;
            });
            Thenable.then(function () {
                console.log("SHOWED base graph - now what?");
            });
            return Thenable;
        };
        GraphComfortHistory.prototype.hide = function () {
            return null;
        };
        return GraphComfortHistory;
    }(GraphComfortBase_1.GraphComfortBase));
    exports.GraphComfortHistory = GraphComfortHistory;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdyYXBoQ29tZm9ydEhpc3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQU1BO1FBQXlDLHVDQUFnQjtRQUlyRDtZQUFBLFlBQ0ksaUJBQU8sU0FFVjtZQUxNLGVBQVMsR0FBRyxJQUFJLEtBQUssRUFBcUIsQ0FBQzs7WUFJOUMsc0JBQXNCO1FBQzFCLENBQUM7UUFFTSxrQ0FBSSxHQUFYLFVBQVksU0FBb0M7WUFDNUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDM0IsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO2lCQUNqQixTQUFTLENBQUMsUUFBUSxDQUFDO2lCQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDaEIsS0FBSyxFQUFFO2lCQUNQLE1BQU0sQ0FBQyxRQUFRLENBQUM7aUJBQ2hCLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO2lCQUNmLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO2lCQUNmLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO2lCQUNiLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO2lCQUN0QixJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVMsQ0FBbUI7Z0JBQ3BDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQztZQUNYLElBQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7WUFDckMsSUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUEsc0JBQXNCO1lBQ2xELElBQU0sYUFBYSxHQUFHLE1BQU0sR0FBRyxXQUFXLENBQUM7WUFDM0MsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7aUJBQ2pCLFNBQVMsQ0FBQyxRQUFRLENBQUM7aUJBQ25CLFVBQVUsRUFBRTtpQkFDWixRQUFRLENBQUM7Z0JBQ04sTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVMsSUFBc0IsRUFBRSxLQUFLO2dCQUM5QyxJQUFNLEtBQUssR0FBRyxhQUFhLEdBQUcsS0FBSyxDQUFDO2dCQUNwQyxNQUFNLENBQUMsYUFBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLGFBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFLElBQUksYUFBSyxDQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRixDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFTLElBQXNCLEVBQUUsS0FBSztnQkFDOUMsSUFBTSxLQUFLLEdBQUcsYUFBYSxHQUFHLEtBQUssQ0FBQztnQkFDcEMsTUFBTSxDQUFDLGFBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxhQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxJQUFJLGFBQUssQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEYsQ0FBQyxDQUFDLENBQUM7WUFHUCxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQztRQUVNLGtDQUFJLEdBQVg7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTCwwQkFBQztJQUFELENBcERBLEFBb0RDLENBcER3QyxtQ0FBZ0IsR0FvRHhEO0lBcERZLGtEQUFtQiIsImZpbGUiOiJHcmFwaENvbWZvcnRIaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21mb3J0VXNlckNob2ljZX0gZnJvbSAnLi9Db21mb3J0VXNlckNob2ljZSc7XG5pbXBvcnQge0dyYXBoQ29tZm9ydEJhc2V9IGZyb20gJy4vR3JhcGhDb21mb3J0QmFzZSc7XG5pbXBvcnQge1BvaW50fSBmcm9tICcuLi9TaGFyZWQvUG9pbnQnO1xuaW1wb3J0IHtQb2xhcn0gZnJvbSAnLi4vU2hhcmVkL1BvbGFyJztcblxuXG5leHBvcnQgY2xhc3MgR3JhcGhDb21mb3J0SGlzdG9yeSBleHRlbmRzIEdyYXBoQ29tZm9ydEJhc2Uge1xuICAgIFxuICAgIHB1YmxpYyBncmFwaERhdGEgPSBuZXcgQXJyYXk8Q29tZm9ydFVzZXJDaG9pY2U+KCk7XG4gICAgcHVibGljIGQzUG9pbnRzO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpOyBcbiAgICAgICAgLy90aGlzLnNldHVwSGlzdG9yeSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93KGdyYXBoRGF0YSA6IEFycmF5PENvbWZvcnRVc2VyQ2hvaWNlPik6VGhlbmFibGU8bnVtYmVyPiB7XG4gICAgICAgIHRoaXMuZ3JhcGhEYXRhID0gZ3JhcGhEYXRhO1xuICAgICAgICBjb25zdCBUaGVuYWJsZSA9IHRoaXMuc2hvd0Jhc2UoKTtcbiAgICAgICAgZDMuc2VsZWN0KFwiZyNoaXN0b3J5XCIpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuZGF0YSh0aGlzLmdyYXBoRGF0YSlcbiAgICAgICAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIDQwMClcbiAgICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIDQwMClcbiAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgMTApXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInBvaW50XCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBmdW5jdGlvbihkOkNvbWZvcnRVc2VyQ2hvaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLnVzZXIubmFtZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdG90YWxQb2ludHMgPSBncmFwaERhdGEubGVuZ3RoO1xuICAgICAgICBjb25zdCByYWRpYW4gPSA2LjI4MzE4NTMwNzI7Ly8zNjAgKiBNYXRoLlBJIC8gMTgwO1xuICAgICAgICBjb25zdCBwb2xhckRpdmlzaW9uID0gcmFkaWFuIC8gdG90YWxQb2ludHM7XG4gICAgICAgIGQzLnNlbGVjdChcImcjaGlzdG9yeVwiKVxuICAgICAgICAgICAgLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiA4MDA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBmdW5jdGlvbihkYXRhOkNvbWZvcnRVc2VyQ2hvaWNlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcG9sYXJEaXZpc2lvbiAqIGluZGV4O1xuICAgICAgICAgICAgICAgIHJldHVybiBQb2ludC50b0NhcnRlc2lhbihuZXcgUG9sYXIoZGF0YS5kaXN0YW5jZSwgYW5nbGUpLCBuZXcgUG9pbnQoNDAwLDQwMCkpLng7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkYXRhOkNvbWZvcnRVc2VyQ2hvaWNlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gcG9sYXJEaXZpc2lvbiAqIGluZGV4O1xuICAgICAgICAgICAgICAgIHJldHVybiBQb2ludC50b0NhcnRlc2lhbihuZXcgUG9sYXIoZGF0YS5kaXN0YW5jZSwgYW5nbGUpLCBuZXcgUG9pbnQoNDAwLDQwMCkpLnk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIFRoZW5hYmxlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU0hPV0VEIGJhc2UgZ3JhcGggLSBub3cgd2hhdD9cIik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gVGhlbmFibGU7XG4gICAgfVxuXG4gICAgcHVibGljIGhpZGUoKTpUaGVuYWJsZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufSJdfQ==
