import {User} from './User';
import {Timed} from './Timed';

export class FormUserChoice {
    userZone : HTMLElement;
    users : Array<User>;
    d3Users : d3.Selection<any>;

    constructor() {
        this.users = [];
        this.userZone = document.getElementById('users');
        this.d3Users = d3.select("g#users");
        if(this.users && this.users.length) {
            this.setupUsers();
            this.show();
        }
    }
    public getUser(id) : User {
        const users =  this.users.filter(function(x) {
            return x.id === id;
        });
        if(users.length) {
            return users[0];
        }
        throw Error("Cannot find user " + id);
    }
    public markUserDone (user:User) {
        for(var i = 0; i<this.users.length; i++) {
            if(user.id === this.users[i].id) {
                user.voted = true;
            }
        }
        this.rebind();
    }
    private afterShow() {
        console.log("ENDSHOW UserChocieForm");
        this.d3Users
            .selectAll("rect")
            .on("mouseup", this.clickUser());
    }
    public hasMoreUsers() {
        const unvotedUsers = this.users.filter(function(x) {
            return !x.voted
        });
        return unvotedUsers.length;
    }
    public show ():Thenable<number> {
        console.log("SHOW UserChocieForm");
        d3.select(this.userZone)
            .transition()
            .duration(function() {
                    return 800;
            })
            .style("fill-opacity",1)
            .attr("transform", "matrix(1,0,0,1,0,0)");
        
        this.d3Users.selectAll("g").attr("class", function(e) {
                if(e.voted) {
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
    private rebind(): d3.selection.Update<User> {
    return this.d3Users
            .selectAll("circle")
            .data(this.users);
    
    }
    private clickUser () {
        // 'that' is the instance of graph 
        const that = this;
        return function(d:User, i:number) {
            // 'this' is the DOM element 
            console.log("CLICK - User - up  UserChocieForm");
            //const name = this.getAttribute("data-name");
            const id = this.getAttribute("data-id");

            var event = new CustomEvent('selectUser', { "detail": {"id": id} });
            document.dispatchEvent(event);
            console.log("This was clicked", that);
        }
    }
    private overUser () {
        // 'that' is the instance of graph 
        const that = this;
        return function(d:User, i:number) {
            // 'this' is the DOM element 
            d3.select(this.parentNode)
            //const d3zones = d3.select("g#users")
                .selectAll("text")
                .transition()
                .duration(250)
                .style("fill", function() {
                    return "#00D7FE";  
                });
        }
    }
    private leaveUser() {
        // 'that' is the instance of graph 
        const that = this;
        return function(d:User, i:number) {
            // 'this' is the DOM element 
            d3.select(this.parentNode)
            //const d3zones = d3.select("g#users")
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
            //Event.add(['mousedown'], this.stage, this.chooseUser);
            //Event.add(["mouseover"], this, thisStage.checkOverUsers);
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
        this.users.push(user);
        this.setupUsers();
    }
    public setUsers(users:Array<User>) {
        this.destroyUsers();
        this.users = users;
        this.setupUsers();
        this.show();
    }
    private destroyUsers() {
        d3.select("g#users").selectAll("*").remove();
    }
    private setupUsers () {
       
            const items = this.rebind();
            items.enter().append("g")
                .attr("id", function(e) {
                    return e.id;
                })
                .each(this.eachUser()); 
        
        
        
    }

    
}