define(["require", "exports", "./ComfortUserChoice", "../Shared/BreadcrumbControl", "../Shared/FormUserChoice", "./GraphComfortEntry", "./GraphComfortHistory"], function (require, exports, ComfortUserChoice_1, BreadcrumbControl_1, FormUserChoice_1, GraphComfortEntry_1, GraphComfortHistory_1) {
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
                case "saveComfortFeedback":
                    var area = params.area;
                    var distance = params.number;
                    var user = params.user;
                    this.saveGraph(area, distance, user);
                    break;
                case "showUserChoice":
                    this.showUserChoice();
                    break;
                case "showGraphComfortHistory":
                    this.showGraphComfortHistory();
                    break;
                case "showGraphComfortChoice":
                    var comfortuser = params;
                    this.showGraphComfortEntry(comfortuser);
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
        Mediator.prototype.showGraphComfortEntry = function (user) {
            if (!this.graphComfortEntry) {
                this.graphComfortEntry = new GraphComfortEntry_1.GraphComfortEntry();
            }
            this.graphComfortEntry.show(user);
        };
        Mediator.prototype.showComfortHistory = function (history) {
            var afterHide = function () {
                if (!this.graphComfortHistory) {
                    this.graphComfortEntry = null;
                    this.graphComfortHistory = new GraphComfortHistory_1.GraphComfortHistory();
                }
                this.graphComfortHistory.show(history);
            }.bind(this);
            if (this.graphComfortEntry) {
                this.graphComfortEntry.hide().then(afterHide);
            }
            else {
                if (this.formUserChoice) {
                    this.formUserChoice.hide();
                }
                afterHide();
            }
        };
        Mediator.prototype.showGraphComfortHistory = function () {
            if (!this.graphComfortHistory) {
                this.graphComfortEntry = null;
                this.graphComfortHistory = new GraphComfortHistory_1.GraphComfortHistory();
            }
            this.graphComfortHistory.show(this.userChoiceHistory);
        };
        Mediator.prototype.selectUser = function (id) {
            var _this = this;
            console.log("ACTION selectUser", id);
            this.formUserChoice.getUser(id).then(function (user) {
                _this.formUserChoice.hide();
                _this.showGraphComfortEntry(user);
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
                var userChoice = new ComfortUserChoice_1.ComfortUserChoice(user, distance, area);
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
                        _this.showGraphComfortHistory();
                    }
                });
            }.bind(this);
            this.graphComfortEntry.hide().then(afterHide);
        };
        return Mediator;
    }());
    exports.Mediator = Mediator;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUMsY0FBYyxFQUFFLENBQUM7b0JBQzFCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsS0FBSSxDQUFDLENBQUM7d0JBQ25DLEtBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO29CQUNuQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUViLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUlMLGVBQUM7SUFBRCxDQTNJQSxBQTJJQyxJQUFBO0lBM0lZLDRCQUFRIiwiZmlsZSI6Ik1lZGlhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21mb3J0VXNlckNob2ljZX0gZnJvbSAnLi9Db21mb3J0VXNlckNob2ljZSc7XG5pbXBvcnQge0JyZWFkY3J1bWJDb250cm9sfSBmcm9tICcuLi9TaGFyZWQvQnJlYWRjcnVtYkNvbnRyb2wnO1xuaW1wb3J0IHtVc2VyfSBmcm9tICcuLi9TaGFyZWQvVXNlcic7XG5pbXBvcnQge0Zvcm1Vc2VyQ2hvaWNlfSBmcm9tICcuLi9TaGFyZWQvRm9ybVVzZXJDaG9pY2UnO1xuaW1wb3J0IHtHcmFwaENvbWZvcnRFbnRyeX0gZnJvbSAnLi9HcmFwaENvbWZvcnRFbnRyeSc7XG5pbXBvcnQge0dyYXBoQ29tZm9ydEhpc3Rvcnl9IGZyb20gJy4vR3JhcGhDb21mb3J0SGlzdG9yeSc7XG5cblxuZXhwb3J0IGNsYXNzIE1lZGlhdG9yIHtcblxuICAgIHVzZXJDaG9pY2VIaXN0b3J5IDogQXJyYXk8Q29tZm9ydFVzZXJDaG9pY2U+O1xuICAgIGZvcm1Vc2VyQ2hvaWNlIDogRm9ybVVzZXJDaG9pY2U7XG4gICAgZ3JhcGhDb21mb3J0RW50cnkgOiBHcmFwaENvbWZvcnRFbnRyeTtcbiAgICBncmFwaENvbWZvcnRIaXN0b3J5OiBHcmFwaENvbWZvcnRIaXN0b3J5O1xuICAgIGJyZWFkY3J1bWJDb250cm9sOiBCcmVhZGNydW1iQ29udHJvbDtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTVEFSVCBldmVyeXRoaW5nXCIpO1xuICAgICAgICB0aGlzLnVzZXJDaG9pY2VIaXN0b3J5ID0gbmV3IEFycmF5PENvbWZvcnRVc2VyQ2hvaWNlPigpO1xuICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlID0gbmV3IEZvcm1Vc2VyQ2hvaWNlKCk7XG4gICAgICAgIHRoaXMuYnJlYWRjcnVtYkNvbnRyb2wgPSBuZXcgQnJlYWRjcnVtYkNvbnRyb2woKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZG8oY29tbWFuZDpzdHJpbmcsIHBhcmFtczphbnkpIHtcbiAgICAgICAgc3dpdGNoIChjb21tYW5kKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIFwiYWRkVXNlclwiOlxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVXNlcihwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNldFVzZXJzXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVc2VycyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNhdmVDb21mb3J0RmVlZGJhY2tcIjpcbiAgICAgICAgICAgICAgICBjb25zdCBhcmVhID0gcGFyYW1zLmFyZWE7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBwYXJhbXMubnVtYmVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXIgPSBwYXJhbXMudXNlcjtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVHcmFwaChhcmVhLCBkaXN0YW5jZSwgdXNlcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2hvd1VzZXJDaG9pY2VcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dVc2VyQ2hvaWNlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2hvd0dyYXBoQ29tZm9ydEhpc3RvcnlcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dHcmFwaENvbWZvcnRIaXN0b3J5KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2hvd0dyYXBoQ29tZm9ydENob2ljZVwiOlxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbWZvcnR1c2VyOlVzZXIgPSBwYXJhbXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93R3JhcGhDb21mb3J0RW50cnkoY29tZm9ydHVzZXIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHVibGljIGFkZFVzZXIodXNlcjpVc2VyKSB7XG4gICAgICAgIHRoaXMuZm9ybVVzZXJDaG9pY2UuYWRkVXNlcih1c2VyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0VXNlcnModXNlcnM6QXJyYXk8VXNlcj4pIHtcbiAgICAgICAgdGhpcy5mb3JtVXNlckNob2ljZS5zZXRVc2Vycyh1c2Vycyk7XG4gICAgfVxuXG4gICAgcHVibGljIHNob3dVc2VyQ2hvaWNlKCkge1xuICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlLnNob3coKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3dHcmFwaENvbWZvcnRFbnRyeSh1c2VyOlVzZXIpIHtcbiAgICAgICAgaWYoIXRoaXMuZ3JhcGhDb21mb3J0RW50cnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhDb21mb3J0RW50cnkgPSBuZXcgR3JhcGhDb21mb3J0RW50cnkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyYXBoQ29tZm9ydEVudHJ5LnNob3codXNlcik7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzaG93Q29tZm9ydEhpc3RvcnkoaGlzdG9yeSkge1xuICAgICAgICB2YXIgYWZ0ZXJIaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgIGlmKCF0aGlzLmdyYXBoQ29tZm9ydEhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoQ29tZm9ydEVudHJ5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoQ29tZm9ydEhpc3RvcnkgPSBuZXcgR3JhcGhDb21mb3J0SGlzdG9yeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ncmFwaENvbWZvcnRIaXN0b3J5LnNob3coaGlzdG9yeSk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuZ3JhcGhDb21mb3J0RW50cnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhDb21mb3J0RW50cnkuaGlkZSgpLnRoZW4oYWZ0ZXJIaWRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMuZm9ybVVzZXJDaG9pY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFmdGVySGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgc2hvd0dyYXBoQ29tZm9ydEhpc3RvcnkoKSB7XG4gICAgICAgIGlmKCF0aGlzLmdyYXBoQ29tZm9ydEhpc3RvcnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhDb21mb3J0RW50cnkgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5ncmFwaENvbWZvcnRIaXN0b3J5ID0gbmV3IEdyYXBoQ29tZm9ydEhpc3RvcnkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyYXBoQ29tZm9ydEhpc3Rvcnkuc2hvdyh0aGlzLnVzZXJDaG9pY2VIaXN0b3J5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VsZWN0VXNlcihpZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFDVElPTiBzZWxlY3RVc2VyXCIsIGlkKTtcbiAgICAgICAgdGhpcy5mb3JtVXNlckNob2ljZS5nZXRVc2VyKGlkKS50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd0dyYXBoQ29tZm9ydEVudHJ5KHVzZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcHVibGljIHNhdmVHcmFwaChhcmVhOnN0cmluZywgZGlzdGFuY2U6bnVtYmVyLCB1c2VyOlVzZXIpIHtcbiAgICAgICAgdGhpcy5mb3JtVXNlckNob2ljZS5tYXJrVXNlckRvbmUodXNlcik7XG4gICAgICAgIHRoaXMuYWRkVXNlckNob2ljZUhpc3RvcnkoYXJlYSwgZGlzdGFuY2UsIHVzZXIpO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFVzZXJDaG9pY2VIaXN0b3J5KGFyZWE6c3RyaW5nLCBkaXN0YW5jZTpudW1iZXIsIHVzZXI6VXNlcikge1xuICAgICAgICBjb25zdCB0aGlzVXNlckNob2ljZSA9IHRoaXMudXNlckNob2ljZUhpc3RvcnkuZmlsdGVyKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4LnVzZXIuaWQgPT09IHVzZXIuaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZih0aGlzVXNlckNob2ljZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXNVc2VyQ2hvaWNlWzBdLmFyZWEgPSBhcmVhO1xuICAgICAgICAgICAgdGhpc1VzZXJDaG9pY2VbMF0uZGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJDaG9pY2UgPSBuZXcgQ29tZm9ydFVzZXJDaG9pY2UodXNlcixkaXN0YW5jZSxhcmVhKTtcbiAgICAgICAgICAgIHRoaXMudXNlckNob2ljZUhpc3RvcnkucHVzaCh1c2VyQ2hvaWNlKTtcbiAgICAgICAgfVxuICAgIH0gIFxuXG4gICAgcHJpdmF0ZSBuZXh0KCkge1xuICAgICAgICAvL2NvbnN0IHByb20gPSBuZXcgUHJvbXNpZSgpXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQUNUSU9OIG5leHRVc2VyXCIsIHRoaXMpO1xuICAgICAgICB2YXIgYWZ0ZXJIaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Vc2VyQ2hvaWNlLmhhc01vcmVVc2VycygpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVc2VycyBsZWZ0Li4uXCIsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dVc2VyQ2hvaWNlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOTyB1c2VycyBsZWZ0XCIsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dHcmFwaENvbWZvcnRIaXN0b3J5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZ3JhcGhDb21mb3J0RW50cnkuaGlkZSgpLnRoZW4oYWZ0ZXJIaWRlKTtcbiAgICB9XG5cbiAgICAvL3NldHVwVXNlcnNcbiAgICAvL1xufSJdfQ==
