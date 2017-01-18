import {User} from "./User";
import {Timed} from "./Timed";
import {InMemoryUsers} from "./Users";
import {IUserRepo} from "./IUsers";

export class FormUserChoice {
    userZone : HTMLElement;
    userRepo : IUserRepo;
    d3Users : d3.Selection<any>;

    constructor() {
        this.userRepo = new InMemoryUsers(); // TODO: DI this
        this.userZone = document.getElementById("users");
        this.d3Users = d3.select("g#users");
        this.userRepo.getUsers().then((users) => {
            if (users && users.length) {
                this.setupUsers(users);
                this.show();
            }
        });
    }
    public getUser(id) : Thenable<User> {
        return this.userRepo.getUser(id);
    }

    public markUserDone (user:User) {
        user.voted = true;
        this.userRepo.updateUser(user).then(users => {
            this.rebind(users);
        });
    }

    private afterShow() {
        console.log("ENDSHOW UserChocieForm");
        this.d3Users
            .selectAll("rect")
            .on("mouseup", this.clickUser());
    }
    public hasMoreUsers() : Thenable<boolean> { // Move to user repo?
        return new Promise((resolve, reject) => {
            this.userRepo.getUsers().then(users => {
                const unvotedUsers = users.filter(function(x) {
                    return !x.voted
                });
                if (unvotedUsers.length) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });

    }
    public show():Thenable<number> {
        console.log("SHOW UserChocieForm");
        d3.select(this.userZone)
            .transition()
            .duration(function() {
                    return 800;
            })
            .style("fill-opacity",1)
            .attr("transform", "matrix(1,0,0,1,0,0)");

        this.d3Users.selectAll("g").attr("class", function(e) {
                if (e.voted) {
                    return "user-group-complete";
                } else {
                    return "user-group";
                }
            })

        return Timed.for(800).then(this.afterShow.bind(this));
    }
    public hide ():Thenable<number> {
        console.log("HIDE userEntry");
        d3.select(this.userZone)
            .transition()
            .duration(function() {
                    return 800;
            })
            .style("fill-opacity",0)
            .attr("transform", "matrix(2,0,0,2,-400,-90)");
        d3.select("g#users")
            .selectAll("rect")
            .on("mouseup", function(e) {
                console.log("NOCLICK User - This was clicked, but ignored", this);
            });
        return Timed.for(800);

    }
    private rebind(users:User[]): d3.selection.Update<User> {
        return this.d3Users
                .selectAll("circle")
                .data(users);
    }
    private clickUser () {
        // "that" is the instance of graph
        const that = this;
        return function(d:User, i:number) {
            // "this" is the DOM element
            console.log("CLICK - User - up  UserChocieForm");
            const id = this.getAttribute("data-id");

            let event = new CustomEvent("selectUser", { "detail": {"id": id} });
            document.dispatchEvent(event);
            console.log("This was clicked", that);
        }
    }
    private overUser () {
        // "that" is the instance of graph
        const that = this;
        return function(d:User, i:number) {
            // "this" is the DOM element
            d3.select(this.parentNode)
                .selectAll("text")
                .transition()
                .duration(250)
                .style("fill", function() {
                    return "#00D7FE";
                });
        }
    }
    private leaveUser() {
        // "that" is the instance of graph
        const that = this;
        return function(d:User, i:number) {
            // "this" is the DOM element
            d3.select(this.parentNode)
                .selectAll("text")
                .transition()
                .duration(function() {
                    return 250;
                })
                .style("fill", function() {
                    return "grey";
                });
        }
    }
    private eachUser () {
        const that = this;
        return function(e, i) {
            const d3Item = d3.select(this);

            d3Item.append("rect")
                .attr("y", function(e) {
                    return 60 + (i * 90);
                })
                .attr("x", 0)
                .attr("width", 800)
                .attr("height", 90)
                .attr("data-name", e.name)
                .attr("data-id", e.id)
                .on("mouseover", that.overUser())
                .on("mouseleave", that.leaveUser())

            d3Item.append("text")
                .attr("class", "username")
                .attr("y", function(e) {
                    return 30 + ((i + 1) * 90);
                })
                .attr("x", 60)
                .attr("data-name", e.name)
                .style("font-size", 60)
                .style("font-family", "Share Tech Mono")
                .text(function(j) {
                    return e.name;
                });
        }
    }

    public addUser(user:User) {
        this.userRepo.addUser(user).then(users => {
            this.setupUsers(users);
        });
    }

    public setUsers(users:Array<User>) {
        this.destroyUsers();
        this.userRepo.setUsers(users).then((users) => {
            this.setupUsers(users);
            this.show();
        });
    }
    private destroyUsers() {
        d3.select("g#users").selectAll("*").remove();
    }

    private setupUsers (users:User[]) {
        const items = this.rebind(users);
        items.enter().append("g")
            .attr("id", (e) => {
                return e.id;
            })
            .each(this.eachUser());
    }


}