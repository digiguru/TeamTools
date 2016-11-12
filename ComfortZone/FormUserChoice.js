define(["require", "exports", 'Timed'], function (require, exports, Timed_1) {
    "use strict";
    var FormUserChoice = (function () {
        function FormUserChoice() {
            this.users = [];
            this.userZone = document.getElementById('users');
            this.d3Users = d3.select("g#users");
            if (this.users && this.users.length) {
                this.setupUsers();
                this.show();
            }
        }
        FormUserChoice.prototype.getUser = function (id) {
            var users = this.users.filter(function (x) {
                return x.id === id;
            });
            if (users.length) {
                return users[0];
            }
            throw Error("Cannot find user " + id);
        };
        FormUserChoice.prototype.markUserDone = function (user) {
            for (var i = 0; i < this.users.length; i++) {
                if (user.id === this.users[i].id) {
                    user.voted = true;
                }
            }
            this.rebind();
        };
        FormUserChoice.prototype.afterShow = function () {
            console.log("ENDSHOW UserChocieForm");
            this.d3Users
                .selectAll("rect")
                .on("mouseup", this.clickUser());
        };
        FormUserChoice.prototype.hasMoreUsers = function () {
            var unvotedUsers = this.users.filter(function (x) {
                return !x.voted;
            });
            return unvotedUsers.length;
        };
        FormUserChoice.prototype.show = function () {
            console.log("SHOW UserChocieForm");
            d3.select(this.userZone)
                .transition()
                .duration(function () {
                return 800;
            })
                .style("fill-opacity", 1)
                .attr("transform", "matrix(1,0,0,1,0,0)");
            this.d3Users.selectAll("g").attr("class", function (e) {
                if (e.voted) {
                    return "user-group-complete";
                }
                else {
                    return "user-group";
                }
            });
            return Timed_1.Timed.for(800).then(this.afterShow.bind(this));
        };
        FormUserChoice.prototype.hide = function () {
            console.log("HIDE userEntry");
            d3.select(this.userZone)
                .transition()
                .duration(function () {
                return 800;
            })
                .style("fill-opacity", 0)
                .attr("transform", "matrix(2,0,0,2,-400,-90)");
            d3.select("g#users")
                .selectAll("rect")
                .on("mouseup", function (e) {
                console.log("NOCLICK User - This was clicked, but ignored", this);
            });
            return Timed_1.Timed.for(800);
        };
        FormUserChoice.prototype.rebind = function () {
            return this.d3Users
                .selectAll("circle")
                .data(this.users);
        };
        FormUserChoice.prototype.clickUser = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                console.log("CLICK - User - up  UserChocieForm");
                //const name = this.getAttribute("data-name");
                var id = this.getAttribute("data-id");
                //TODO: NEED TO HAVE THE LINE BELOW.... but how?
                //mediator.selectUser(id);
                console.log("This was clicked", that);
            };
        };
        FormUserChoice.prototype.overUser = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                d3.select(this.parentNode)
                    .selectAll("text")
                    .transition()
                    .duration(250)
                    .style("fill", function () {
                    return "#00D7FE";
                });
            };
        };
        FormUserChoice.prototype.leaveUser = function () {
            // 'that' is the instance of graph 
            var that = this;
            return function (d, i) {
                // 'this' is the DOM element 
                d3.select(this.parentNode)
                    .selectAll("text")
                    .transition()
                    .duration(function () {
                    return 250;
                })
                    .style("fill", function () {
                    return "grey";
                });
            };
        };
        FormUserChoice.prototype.eachUser = function () {
            var that = this;
            return function (e, i) {
                //Event.add(['mousedown'], this.stage, this.chooseUser);
                //Event.add(["mouseover"], this, thisStage.checkOverUsers);
                var d3Item = d3.select(this);
                d3Item.append("rect")
                    .attr("y", function (e) {
                    return 60 + (i * 90);
                })
                    .attr("x", 0)
                    .attr("width", 800)
                    .attr("height", 90)
                    .attr("data-name", e.name)
                    .attr("data-id", e.id)
                    .on("mouseover", that.overUser())
                    .on("mouseleave", that.leaveUser());
                d3Item.append("text")
                    .attr("class", "username")
                    .attr("y", function (e) {
                    return 30 + ((i + 1) * 90);
                })
                    .attr("x", 60)
                    .attr("data-name", e.name)
                    .style("font-size", 60)
                    .style("font-family", "Share Tech Mono")
                    .text(function (j) {
                    return e.name;
                });
            };
        };
        FormUserChoice.prototype.addUser = function (user) {
            this.users.push(user);
            this.setupUsers();
        };
        FormUserChoice.prototype.setUsers = function (users) {
            this.destroyUsers();
            this.users = users;
            this.setupUsers();
            this.show();
        };
        FormUserChoice.prototype.destroyUsers = function () {
            d3.select("g#users").selectAll("*").remove();
        };
        FormUserChoice.prototype.setupUsers = function () {
            var items = this.rebind();
            items.enter().append("g")
                .attr("id", function (e) {
                return e.id;
            })
                .each(this.eachUser());
        };
        return FormUserChoice;
    }());
    exports.FormUserChoice = FormUserChoice;
});
//# sourceMappingURL=FormUserChoice.js.map