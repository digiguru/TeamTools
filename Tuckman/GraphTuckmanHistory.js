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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdyYXBoVHVja21hbkhpc3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQU1BO1FBQXlDLHVDQUFnQjtRQUlyRDtZQUFBLFlBQ0ksaUJBQU8sU0FFVjtZQUxNLGVBQVMsR0FBRyxJQUFJLEtBQUssRUFBcUIsQ0FBQzs7WUFJOUMsc0JBQXNCO1FBQzFCLENBQUM7UUFFTSxrQ0FBSSxHQUFYLFVBQVksU0FBb0M7WUFDNUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDM0IsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRWpDLElBQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7WUFDckMsSUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDO1lBQ3hCLElBQU0sY0FBYyxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFFakQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7aUJBQ2pCLFNBQVMsQ0FBQyxRQUFRLENBQUM7aUJBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2lCQUNoQixLQUFLLEVBQUU7aUJBQ1AsTUFBTSxDQUFDLFFBQVEsQ0FBQztpQkFDaEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQ2IsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFTLElBQXNCLEVBQUUsS0FBSztnQkFDOUMsTUFBTSxDQUFDLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUMxQyxDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7aUJBQ2IsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7aUJBQ3RCLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBUyxDQUFtQjtnQkFDcEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDO1lBQ1gsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7aUJBQ2pCLFNBQVMsQ0FBQyxRQUFRLENBQUM7aUJBQ25CLFVBQVUsRUFBRTtpQkFDWixRQUFRLENBQUM7Z0JBQ04sTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVMsSUFBc0IsRUFBRSxLQUFLO2dCQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN6QixDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFTLElBQXNCLEVBQUUsS0FBSztnQkFDOUMsTUFBTSxDQUFDLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUdQLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDO1FBRU0sa0NBQUksR0FBWDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNMLDBCQUFDO0lBQUQsQ0F0REEsQUFzREMsQ0F0RHdDLG1DQUFnQixHQXNEeEQ7SUF0RFksa0RBQW1CIiwiZmlsZSI6IkdyYXBoVHVja21hbkhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R1Y2ttYW5Vc2VyQ2hvaWNlfSBmcm9tICcuL1R1Y2ttYW5Vc2VyQ2hvaWNlJztcbmltcG9ydCB7R3JhcGhUdWNrbWFuQmFzZX0gZnJvbSAnLi9HcmFwaFR1Y2ttYW5CYXNlJztcbmltcG9ydCB7UG9pbnR9IGZyb20gJy4uL1NoYXJlZC9Qb2ludCc7XG5pbXBvcnQge1BvbGFyfSBmcm9tICcuLi9TaGFyZWQvUG9sYXInO1xuXG5cbmV4cG9ydCBjbGFzcyBHcmFwaFR1Y2ttYW5IaXN0b3J5IGV4dGVuZHMgR3JhcGhUdWNrbWFuQmFzZSB7XG4gICAgXG4gICAgcHVibGljIGdyYXBoRGF0YSA9IG5ldyBBcnJheTxUdWNrbWFuVXNlckNob2ljZT4oKTtcbiAgICBwdWJsaWMgZDNQb2ludHM7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7IFxuICAgICAgICAvL3RoaXMuc2V0dXBIaXN0b3J5KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNob3coZ3JhcGhEYXRhIDogQXJyYXk8VHVja21hblVzZXJDaG9pY2U+KTpUaGVuYWJsZTxudW1iZXI+IHtcbiAgICAgICAgdGhpcy5ncmFwaERhdGEgPSBncmFwaERhdGE7XG4gICAgICAgIGNvbnN0IFRoZW5hYmxlID0gdGhpcy5zaG93QmFzZSgpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgdG90YWxQb2ludHMgPSBncmFwaERhdGEubGVuZ3RoO1xuICAgICAgICBjb25zdCB0b3RhbEhlaWdodCA9IDgwMDtcbiAgICAgICAgY29uc3QgaGVpZ2h0RGl2aXNpb24gPSB0b3RhbEhlaWdodCAvIHRvdGFsUG9pbnRzO1xuICAgICAgICBcbiAgICAgICAgZDMuc2VsZWN0KFwiZyNoaXN0b3J5XCIpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuZGF0YSh0aGlzLmdyYXBoRGF0YSlcbiAgICAgICAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImN4XCIsIDApXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkYXRhOlR1Y2ttYW5Vc2VyQ2hvaWNlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGhlaWdodERpdmlzaW9uICogaW5kZXgpICsgMTAwO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIDEwKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJwb2ludFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24oZDpUdWNrbWFuVXNlckNob2ljZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC51c2VyLm5hbWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIGQzLnNlbGVjdChcImcjaGlzdG9yeVwiKVxuICAgICAgICAgICAgLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiA4MDA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBmdW5jdGlvbihkYXRhOlR1Y2ttYW5Vc2VyQ2hvaWNlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmRpc3RhbmNlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgZnVuY3Rpb24oZGF0YTpUdWNrbWFuVXNlckNob2ljZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGhlaWdodERpdmlzaW9uICogaW5kZXgpICsgMTAwO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICBUaGVuYWJsZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNIT1dFRCBiYXNlIGdyYXBoIC0gbm93IHdoYXQ/XCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFRoZW5hYmxlO1xuICAgIH1cblxuICAgIHB1YmxpYyBoaWRlKCk6VGhlbmFibGU8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn0iXX0=
