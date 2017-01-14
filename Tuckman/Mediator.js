define(["require", "exports", "./TuckmanUserChoice", "../Shared/BreadcrumbControl", "../Shared/FormUserChoice", "./GraphTuckmanEntry", "./GraphTuckmanHistory"], function (require, exports, TuckmanUserChoice_1, BreadcrumbControl_1, FormUserChoice_1, GraphTuckmanEntry_1, GraphTuckmanHistory_1) {
    "use strict";
    var Mediator = (function () {
        function Mediator() {
            console.log("START everything");
            this.userChoiceHistory = new Array();
            this.formUserChoice = new FormUserChoice_1.FormUserChoice();
            this.breadcrumbControl = new BreadcrumbControl_1.BreadcrumbControl();
        }
        Mediator.prototype.do = function (command, params) {
            switch (command) {
                case "addUser":
                    this.addUser(params);
                    break;
                case "setUsers":
                    this.setUsers(params);
                    break;
                case "saveTuckmanFeedback":
                    var area = params.area;
                    var distance = params.number;
                    var user = params.user;
                    this.saveGraph(area, distance, user);
                    break;
                case "showUserChoice":
                    this.showUserChoice();
                    break;
                case "showGraphTuckmanHistory":
                    this.showGraphTuckmanHistory();
                    break;
                case "showGraphTuckmanChoice":
                    var comfortuser = params;
                    this.showGraphTuckmanEntry(comfortuser);
                    break;
            }
        };
        Mediator.prototype.addUser = function (user) {
            this.formUserChoice.addUser(user);
        };
        Mediator.prototype.setUsers = function (users) {
            this.formUserChoice.setUsers(users);
        };
        Mediator.prototype.showUserChoice = function () {
            this.formUserChoice.show();
        };
        Mediator.prototype.showGraphTuckmanEntry = function (user) {
            if (!this.graphTuckmanEntry) {
                this.graphTuckmanEntry = new GraphTuckmanEntry_1.GraphTuckmanEntry();
            }
            this.graphTuckmanEntry.show(user);
        };
        Mediator.prototype.showTuckmanHistory = function (history) {
            var afterHide = function () {
                if (!this.graphTuckmanHistory) {
                    this.graphTuckmanEntry = null;
                    this.graphTuckmanHistory = new GraphTuckmanHistory_1.GraphTuckmanHistory();
                }
                this.graphTuckmanHistory.show(history);
            }.bind(this);
            if (this.graphTuckmanEntry) {
                this.graphTuckmanEntry.hide().then(afterHide);
            }
            else {
                if (this.formUserChoice) {
                    this.formUserChoice.hide();
                }
                afterHide();
            }
        };
        Mediator.prototype.showGraphTuckmanHistory = function () {
            if (!this.graphTuckmanHistory) {
                this.graphTuckmanEntry = null;
                this.graphTuckmanHistory = new GraphTuckmanHistory_1.GraphTuckmanHistory();
            }
            this.graphTuckmanHistory.show(this.userChoiceHistory);
        };
        Mediator.prototype.selectUser = function (id) {
            var _this = this;
            console.log("ACTION selectUser", id);
            var user = this.formUserChoice.getUser(id).then(function (user) {
                _this.formUserChoice.hide();
                _this.showGraphTuckmanEntry(user);
            });
        };
        Mediator.prototype.saveGraph = function (area, distance, user) {
            this.formUserChoice.markUserDone(user);
            this.addUserChoiceHistory(area, distance, user);
            this.next();
        };
        Mediator.prototype.addUserChoiceHistory = function (area, distance, user) {
            var thisUserChoice = this.userChoiceHistory.filter(function (x) {
                return x.user.id === user.id;
            });
            if (thisUserChoice.length) {
                thisUserChoice[0].area = area;
                thisUserChoice[0].distance = distance;
            }
            else {
                var userChoice = new TuckmanUserChoice_1.TuckmanUserChoice(user, distance, area);
                this.userChoiceHistory.push(userChoice);
            }
        };
        Mediator.prototype.next = function () {
            //const prom = new Promsie()
            console.log("ACTION nextUser", this);
            var afterHide = function () {
                var _this = this;
                this.formUserChoice.hasMoreUsers().then(function (result) {
                    if (result) {
                        console.log("Users left...", _this);
                        _this.showUserChoice();
                    }
                    else {
                        console.log("NO users left", _this);
                        _this.showGraphTuckmanHistory();
                    }
                });
            }.bind(this);
            this.graphTuckmanEntry.hide().then(afterHide);
        };
        return Mediator;
    }());
    exports.Mediator = Mediator;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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O3dCQUNuQyxLQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQzFCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsS0FBSSxDQUFDLENBQUM7d0JBQ25DLEtBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO29CQUNuQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFBO1lBQ04sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUViLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUlMLGVBQUM7SUFBRCxDQTNJQSxBQTJJQyxJQUFBO0lBM0lZLDRCQUFRIiwiZmlsZSI6Ik1lZGlhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtUdWNrbWFuVXNlckNob2ljZX0gZnJvbSAnLi9UdWNrbWFuVXNlckNob2ljZSc7XG5pbXBvcnQge0JyZWFkY3J1bWJDb250cm9sfSBmcm9tICcuLi9TaGFyZWQvQnJlYWRjcnVtYkNvbnRyb2wnO1xuaW1wb3J0IHtVc2VyfSBmcm9tICcuLi9TaGFyZWQvVXNlcic7XG5pbXBvcnQge0Zvcm1Vc2VyQ2hvaWNlfSBmcm9tICcuLi9TaGFyZWQvRm9ybVVzZXJDaG9pY2UnO1xuaW1wb3J0IHtHcmFwaFR1Y2ttYW5FbnRyeX0gZnJvbSAnLi9HcmFwaFR1Y2ttYW5FbnRyeSc7XG5pbXBvcnQge0dyYXBoVHVja21hbkhpc3Rvcnl9IGZyb20gJy4vR3JhcGhUdWNrbWFuSGlzdG9yeSc7XG5cblxuZXhwb3J0IGNsYXNzIE1lZGlhdG9yIHtcblxuICAgIHVzZXJDaG9pY2VIaXN0b3J5IDogQXJyYXk8VHVja21hblVzZXJDaG9pY2U+O1xuICAgIGZvcm1Vc2VyQ2hvaWNlIDogRm9ybVVzZXJDaG9pY2U7XG4gICAgZ3JhcGhUdWNrbWFuRW50cnkgOiBHcmFwaFR1Y2ttYW5FbnRyeTtcbiAgICBncmFwaFR1Y2ttYW5IaXN0b3J5OiBHcmFwaFR1Y2ttYW5IaXN0b3J5O1xuICAgIGJyZWFkY3J1bWJDb250cm9sOiBCcmVhZGNydW1iQ29udHJvbDtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTVEFSVCBldmVyeXRoaW5nXCIpO1xuICAgICAgICB0aGlzLnVzZXJDaG9pY2VIaXN0b3J5ID0gbmV3IEFycmF5PFR1Y2ttYW5Vc2VyQ2hvaWNlPigpO1xuICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlID0gbmV3IEZvcm1Vc2VyQ2hvaWNlKCk7XG4gICAgICAgIHRoaXMuYnJlYWRjcnVtYkNvbnRyb2wgPSBuZXcgQnJlYWRjcnVtYkNvbnRyb2woKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZG8oY29tbWFuZDpzdHJpbmcsIHBhcmFtczphbnkpIHtcbiAgICAgICAgc3dpdGNoIChjb21tYW5kKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIFwiYWRkVXNlclwiOlxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVXNlcihwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNldFVzZXJzXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVc2VycyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNhdmVUdWNrbWFuRmVlZGJhY2tcIjpcbiAgICAgICAgICAgICAgICBjb25zdCBhcmVhID0gcGFyYW1zLmFyZWE7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBwYXJhbXMubnVtYmVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBwYXJhbXMudXNlcjtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVHcmFwaChhcmVhLCBkaXN0YW5jZSwgdXNlcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2hvd1VzZXJDaG9pY2VcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dVc2VyQ2hvaWNlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2hvd0dyYXBoVHVja21hbkhpc3RvcnlcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dHcmFwaFR1Y2ttYW5IaXN0b3J5KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2hvd0dyYXBoVHVja21hbkNob2ljZVwiOlxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbWZvcnR1c2VyOlVzZXIgPSBwYXJhbXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93R3JhcGhUdWNrbWFuRW50cnkoY29tZm9ydHVzZXIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHVibGljIGFkZFVzZXIodXNlcjpVc2VyKSB7XG4gICAgICAgIHRoaXMuZm9ybVVzZXJDaG9pY2UuYWRkVXNlcih1c2VyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0VXNlcnModXNlcnM6QXJyYXk8VXNlcj4pIHtcbiAgICAgICAgdGhpcy5mb3JtVXNlckNob2ljZS5zZXRVc2Vycyh1c2Vycyk7XG4gICAgfVxuXG4gICAgcHVibGljIHNob3dVc2VyQ2hvaWNlKCkge1xuICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlLnNob3coKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3dHcmFwaFR1Y2ttYW5FbnRyeSh1c2VyOlVzZXIpIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JhcGhUdWNrbWFuRW50cnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhUdWNrbWFuRW50cnkgPSBuZXcgR3JhcGhUdWNrbWFuRW50cnkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyYXBoVHVja21hbkVudHJ5LnNob3codXNlcik7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzaG93VHVja21hbkhpc3RvcnkoaGlzdG9yeSkge1xuICAgICAgICB2YXIgYWZ0ZXJIaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgIGlmKCF0aGlzLmdyYXBoVHVja21hbkhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoVHVja21hbkVudHJ5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoVHVja21hbkhpc3RvcnkgPSBuZXcgR3JhcGhUdWNrbWFuSGlzdG9yeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ncmFwaFR1Y2ttYW5IaXN0b3J5LnNob3coaGlzdG9yeSk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuZ3JhcGhUdWNrbWFuRW50cnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhUdWNrbWFuRW50cnkuaGlkZSgpLnRoZW4oYWZ0ZXJIaWRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMuZm9ybVVzZXJDaG9pY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFmdGVySGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgc2hvd0dyYXBoVHVja21hbkhpc3RvcnkoKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyYXBoVHVja21hbkhpc3RvcnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhUdWNrbWFuRW50cnkgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5ncmFwaFR1Y2ttYW5IaXN0b3J5ID0gbmV3IEdyYXBoVHVja21hbkhpc3RvcnkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyYXBoVHVja21hbkhpc3Rvcnkuc2hvdyh0aGlzLnVzZXJDaG9pY2VIaXN0b3J5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VsZWN0VXNlcihpZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFDVElPTiBzZWxlY3RVc2VyXCIsIGlkKTtcbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMuZm9ybVVzZXJDaG9pY2UuZ2V0VXNlcihpZCkudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtVXNlckNob2ljZS5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLnNob3dHcmFwaFR1Y2ttYW5FbnRyeSh1c2VyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHB1YmxpYyBzYXZlR3JhcGgoYXJlYTpzdHJpbmcsIGRpc3RhbmNlOm51bWJlciwgdXNlcjpVc2VyKSB7XG4gICAgICAgIHRoaXMuZm9ybVVzZXJDaG9pY2UubWFya1VzZXJEb25lKHVzZXIpO1xuICAgICAgICB0aGlzLmFkZFVzZXJDaG9pY2VIaXN0b3J5KGFyZWEsIGRpc3RhbmNlLCB1c2VyKTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRVc2VyQ2hvaWNlSGlzdG9yeShhcmVhOnN0cmluZywgZGlzdGFuY2U6bnVtYmVyLCB1c2VyOlVzZXIpIHtcbiAgICAgICAgY29uc3QgdGhpc1VzZXJDaG9pY2UgPSB0aGlzLnVzZXJDaG9pY2VIaXN0b3J5LmZpbHRlcihmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICByZXR1cm4geC51c2VyLmlkID09PSB1c2VyLmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYodGhpc1VzZXJDaG9pY2UubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzVXNlckNob2ljZVswXS5hcmVhID0gYXJlYTtcbiAgICAgICAgICAgIHRoaXNVc2VyQ2hvaWNlWzBdLmRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyQ2hvaWNlID0gbmV3IFR1Y2ttYW5Vc2VyQ2hvaWNlKHVzZXIsZGlzdGFuY2UsYXJlYSk7XG4gICAgICAgICAgICB0aGlzLnVzZXJDaG9pY2VIaXN0b3J5LnB1c2godXNlckNob2ljZSk7XG4gICAgICAgIH1cbiAgICB9ICBcblxuICAgIHByaXZhdGUgbmV4dCgpIHtcbiAgICAgICAgLy9jb25zdCBwcm9tID0gbmV3IFByb21zaWUoKVxuICAgICAgICBjb25zb2xlLmxvZyhcIkFDVElPTiBuZXh0VXNlclwiLCB0aGlzKTtcbiAgICAgICAgdmFyIGFmdGVySGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5mb3JtVXNlckNob2ljZS5oYXNNb3JlVXNlcnMoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXJzIGxlZnQuLi5cIiwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1VzZXJDaG9pY2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5PIHVzZXJzIGxlZnRcIiwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0dyYXBoVHVja21hbkhpc3RvcnkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmdyYXBoVHVja21hbkVudHJ5LmhpZGUoKS50aGVuKGFmdGVySGlkZSk7XG4gICAgfVxuXG4gICAgLy9zZXR1cFVzZXJzXG4gICAgLy9cbn0iXX0=
