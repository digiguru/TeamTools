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

//# sourceMappingURL=Mediator.js.map
