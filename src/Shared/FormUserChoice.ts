import {User} from "./User";
import {Timed} from "./Timed";
import {InMemoryUsers} from "./Users";
import {IUserRepo} from "./IUsers";
import * as d3 from "d3";

export class FormUserChoice {
    userZone: HTMLElement;
    userRepo: IUserRepo;
    d3Users: d3.Selection<any>;

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
    public getUser(id): PromiseLike<User> {
        return this.userRepo.getUser(id);
    }

    public markUserDone (user: User) {
        user.voted = true;
        this.userRepo.updateUser(user).then(users => {
            this.rebind(users);
        });
    }

    private afterShow() {
        this.d3Users
            .selectAll("rect")
            .on("mouseup", this.clickUser());
    }
    public hasMoreUsers(): PromiseLike<boolean> { // Move to user repo?
        return new Promise((resolve, reject) => {
            this.userRepo.getUsers().then(users => {
                const unvotedUsers = users.filter((x) => !x.voted);
                if (unvotedUsers.length) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });

    }
    public show(): PromiseLike<number> {
        d3.select(this.userZone)
            .transition()
            .duration(() => 800)
            .style("fill-opacity", 1)
            .attr("transform", "matrix(1,0,0,1,0,0)");

        this.d3Users.selectAll("g").attr("class", (e) => {
            if (e.voted) {
                return "user-group-complete";
            } else {
                return "user-group";
            }
        });

        return Timed.for(800).then(this.afterShow.bind(this));
    }
    public hide(): PromiseLike<number> {
        d3.select(this.userZone)
            .transition()
            .duration(() => 800)
            .style("fill-opacity", 0)
            .attr("transform", "matrix(2,0,0,2,-400,-90)");
        d3.select("g#users")
            .selectAll("rect")
            .on("mouseup", (e) => {
                console.log("NOCLICK User - This was clicked, but ignored", this);
            });
        return Timed.for(800);

    }
    private rebind(users: User[]): d3.selection.Update<User> {
        return this.d3Users
                .selectAll("circle")
                .data(users);
    }
    private clickUser () {
        // "that" is the instance of graph
        const that = this;
        return function(d: User, i: number) {
            // "this" is the DOM element
            const id = this.getAttribute("data-id");

            const event = new CustomEvent("selectUser", { "detail": {"id": id} });
            document.dispatchEvent(event);

        };
    }
    private overUser () {
        // "that" is the instance of graph
        const that = this;
        return function(d: User, i: number) {
            // "this" is the DOM element
            d3.select(this.parentNode)
                .selectAll("text")
                .transition()
                .duration(250)
                .style("fill", () => "#00D7FE");
        };
    }
    private leaveUser() {
        // "that" is the instance of graph
        const that = this;
        return function(d: User, i: number) {
            // "this" is the DOM element
            d3.select(this.parentNode)
                .selectAll("text")
                .transition()
                .duration(() => 250)
                .style("fill", () => "grey");
        };
    }
    private eachUser () {
        const that = this;
        return function(e, i) {
            const d3Item = d3.select(this);

            d3Item.append("rect")
                .attr("y", (e) => 60 + (i * 90))
                .attr("x", 0)
                .attr("width", 800)
                .attr("height", 90)
                .attr("data-name", e.name)
                .attr("data-id", e.id)
                .on("mouseover", that.overUser())
                .on("mouseleave", that.leaveUser());

            d3Item.append("text")
                .attr("class", "username")
                .attr("y", (e) => 30 + ((i + 1) * 90))
                .attr("x", 60)
                .attr("data-name", e.name)
                .style("font-size", 60)
                .style("font-family", "Share Tech Mono")
                .text((j) => e.name);
        };
    }

    public addUser(user: User) {
        this.userRepo.addUser(user).then(users => {
            this.setupUsers(users);
        });
    }

    public setUsers(users: Array<User>) {
        this.destroyUsers();
        this.userRepo.setUsers(users).then((users) => {
            this.setupUsers(users);
            this.show();
        });
    }
    private destroyUsers() {
        d3.select("g#users").selectAll("*").remove();
    }

    private setupUsers (users: User[]) {
        const items = this.rebind(users);
        items.enter().append("g")
            .attr("id", (e) => e.id)
            .each(this.eachUser());
    }


}
