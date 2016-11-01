/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>

//import {Promise} from 'es6-promise';



namespace Comfort {
    export class Timed {
        public static for(milliseconds:number) :Promise<number> {
            const p: Promise<Number> = new Promise((resolve)=>{
                setTimeout(function() {
                    resolve(milliseconds);                    
                }, milliseconds);
            });
            return p;
        }
    }
    
    export class User {
        name: string;
        id: string;
        voted: boolean;
        constructor(name:string, id:string) {
            this.name = name;
            this.id = id;
            this.voted = false;
        }
    }
    
    export class Point {
        x : number;
        y : number;

        constructor(x:number, y:number) {
            this.x = x;
            this.y = y;
        }
        static fromCoords(coords:Array<number>) {
            return new Point(coords[0],coords[1]);
        }
        public static fromOffset(point:Point , origin:Point):Point {
            const dx = point.x - origin.x;
            const dy = point.y - origin.y;
            return new Point(dx,dy);
        }
        public static toOffset(point:Point, origin:Point):Point {
            const dx = point.x + origin.x;
            const dy = point.y + origin.y;
            return new Point(dx,dy);
        }
        public static distance(point:Point , origin:Point):number {
            const offset = Point.fromOffset(point, origin);
            return Point.distanceFromOffset(offset);
        }
        public static distanceFromOffset(offset:Point):number {
            return Math.sqrt(offset.x * offset.x + offset.y * offset.y);
        }
        public static toCartesianNoOffset(polar:Polar):Point {
            const x = polar.radius * Math.cos(polar.angle);
            const y = polar.radius * Math.sin(polar.angle);
            return new Point(x, y); 
        }
        public static toCartesian(polar:Polar,origin:Point):Point {
            const point = Point.toCartesianNoOffset(polar);
            return Point.toOffset(point,origin); 
        }
        public static toPolar(point:Point, origin:Point):Polar {
            const offset = Point.fromOffset(point, origin);
            const radius = Point.distanceFromOffset(offset);
            const angle = Math.atan2(offset.y, offset.x);
            return new Polar(radius, angle);
        }
    }

    export class ComfortUserChoiceHistory {
        date :Date;
        data : Array<ComfortUserChoice>;
    }
    export class ComfortUserChoice {
        user : User;
        distance : number;
        area : String;
        constructor(user : User, distance : number, area : String) {
          this.user = user;
          this.distance = distance;
          this.area = area;
        }
    }
    export class Polar {
        radius:number;
        angle:number;
        constructor(radius:number, angle:number) {
            this.radius = radius;
            this.angle = angle;
        }
        
    }

    export class GraphComfortBase {
        chaos : HTMLElement;
        stretch : HTMLElement;
        comfort : HTMLElement;
        centerPoint : Point;
        
        constructor() {
            this.setupArea();
        }

        private setupArea () {
            
            
            const zones = [new ComfortZones("stretch",300), new ComfortZones("comfort",100)];
            const d3zones = d3.select("g#zones")
                .selectAll("circle")
                .data(zones);

            d3zones.enter().append("circle")
                .attr("cx", 400)
                    .attr("cy", 400)
                    .attr("r", 0)
                    .attr("class", "area")
                    .attr("id", function(d:ComfortZones) {
                        return d.name;
                });
            

            this.chaos = document.getElementById('chaos');
            this.stretch = document.getElementById('stretch');
            this.comfort = document.getElementById('comfort');
            const centerX = Number(this.comfort.getAttribute('cx'));
            const centerY = Number(this.comfort.getAttribute('cy'));
            this.centerPoint = new Point(centerX,centerY);
            

        }
        public hide():Promise<number> {
            console.log("HIDE comfortGRAPH");
            
            const d3zones = d3.select("g#zones")    
                .selectAll("circle")
                    .transition()
                    .duration(1000)
                    .attr("r", 0);

            const d3drops = d3.select("#stage")
                .selectAll("circle.dropper")   
                .transition()
                    .delay(250)
                    .duration(250)
                    .attr("r", 0);
            return Timed.for(1000);
                    
        }
        public showBase():Promise<number> {
            console.log("SHOW graph");
            const d3zones = d3.select("g#zones")
                .selectAll("circle")
                    .attr("r", 0)
                .transition()
                    .duration(1000)
                    .delay(function(d, i) { return i * 100; })
                    .ease("elastic")
                    .attr("r", function(d:ComfortZones) { 
                        return d.radius; 
                    }); 
            
            return Timed.for(1000);
            
        }

    }
    
    export class GraphComfortEntry extends GraphComfortBase {
        clickArea : HTMLElement;
        currentUser:User;
        dropper : SVGAElement;
        
        constructor() {
            super();
            this.clickArea = document.getElementById('clickable');
            this.setupOverActivity();
        }

       
     
        
        

        public setupOverActivity () {
            const that = this;
            d3.select("#stage").on("mousemove", this.graphMove());//this.checkArea);
        }

        private setupClickActivity () {
            console.log("SETUP graph click");
            d3.select("#stage").on("mouseup", this.graphUp());
            d3.select("#stage").on("mousedown", this.graphDown());
        }

        private graphMove() {
            /* 'that' is the instance of graph */
            const that : GraphComfortEntry = this;
            return function(d:void, i:number) {
                /* 'this' is the DOM element */
                const coord = d3.mouse(this);
                const distance = Point.distance(that.centerPoint, Point.fromCoords(coord));
                const area = GraphComfortEntry.calculateDistance(distance);
                that.highlight(area);
            }
        }

        private graphUp() {
            /* 'that' is the instance of graph */
            const that : GraphComfortEntry = this;
            return function(d:void, i :number) {
                /* 'this' is the DOM element */
                const coord = Point.fromCoords(d3.mouse(this));
                const distance = Point.distance(that.centerPoint, coord);
                const area = GraphComfortEntry.calculateDistance(distance);          
                that.saveTheInteraction(area, distance);
            }
        }

         private graphDown() {
            /* 'that' is the instance of graph */
            const that = this;
            return function(d:void, i:number) {
                /* 'this' is the DOM element */
                const coord = Point.fromCoords(d3.mouse(this));
                const el = SVG.circle(8, coord.x, coord.y, "dropper");
                that.addDropper(el);
            }
        }

        public highlight (area : string) {
            //<circle id="stretch" r="300" cx="400" cy="400" />
            //<circle id="comfort" r="100" cx="400" cy="400" />

           
            const d3zones = d3.select("svg")
                .selectAll(".area")
                .transition()
                    .delay(function() {
                        if(this.getAttribute("id") === area) {
                            return 0;
                        }
                        return 100;
                    })
                    .ease("cubic")
                    .duration(function() {
                        return 250;
                    })
                    .style("fill", function() {
                        if(this.getAttribute("id") === area) {
                             return "rgb(0, 180, 219)";
                        }
                        return "#00D7FE";
                    });
            
        }
        
       
        public addDropper (el : SVGAElement)  {
            this.dropper = el;
            document.getElementById('stage').insertBefore(el, this.clickArea);
        }

        public static calculateDistance(distance) {
            if(distance < 100) {
                return "comfort";
            } else if (distance < 300) {
                return "stretch";
            } else {
                return "chaos";
            }
        }

      
        public removeInteractions () {
            console.log("REMOVE activiteis from GraphComfortEntry");
            d3.select("#stage").on("mouseup", function() {
                console.log("UNCLICK - Graphup - No longer interactive stage");
            });
            d3.select("#stage").on("mousedown", function() {
                console.log("UNCLICK - Graphdown - No longer interactive stage");
            });
            d3.select("#stage").on("mousemove", function() {
                console.log("UNMove - mousemove - No longer interactive stage");
            });
            
        }
        public saveTheInteraction (area:string, distance:number) {
            console.log("saveTheInteraction");
            this.removeInteractions();
            mediator.saveGraph(area,distance,this.currentUser);
            //stage.nextUser();
        }
        public show(user:User) {
            this.currentUser = user;
            const promise = this.showBase();
            this.setupOverActivity();
            return promise.then(this.setupClickActivity.bind(this));
        }
  
    }
   
    export class GraphComfortHistory extends GraphComfortBase {
        public graphData = new Array<ComfortUserChoice>();
        public d3Points;
        constructor() {
            super(); 
            //this.setupHistory();
        }

        public show(graphData : Array<ComfortUserChoice>):Promise<number> {
            this.graphData = graphData;
            const promise = this.showBase();
            d3.select("g#history")
                .selectAll("circle")
                .data(this.graphData)
                    .enter()
                    .append("circle")
                    .attr("cx", 400)
                    .attr("cy", 400)
                    .attr("r", 10)
                    .attr("class", "point")
                    .attr("id", function(d:ComfortUserChoice) {
                        return d.user.name;
                    });
            const totalPoints = graphData.length;
            const radian = 6.2831853072;//360 * Math.PI / 180;
            const polarDivision = radian / totalPoints;
            d3.select("g#history")
                .selectAll("circle")
                .transition()
                .duration(function() {
                    return 800;
                })
                .attr("cx", function(data:ComfortUserChoice, index) {
                    const angle = polarDivision * index;
                    return Point.toCartesian(new Polar(data.distance, angle), new Point(400,400)).x;
                })
                .attr("cy", function(data:ComfortUserChoice, index) {
                    const angle = polarDivision * index;
                    return Point.toCartesian(new Polar(data.distance, angle), new Point(400,400)).y;
                });


            promise.then(function() {
               console.log("SHOWED base graph - now what?");
            });
            return promise;
        }

        public hide():Promise<number> {
            return null;
        }
    }

    export class FormUserChoice {
        userZone : HTMLElement;
        users : Array<User>;
        d3Users : d3.Selection<any>;

        constructor() {
            this.users = [];
            this.userZone = document.getElementById('users');
            this.d3Users = d3.select("g#users");
            
            this.setupUsers();
            this.show();
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
        public show ():Promise<number> {
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
        public hide ():Promise<number> {
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
            /*  d3.select(this.userZone)
                .transition()
               .selectAll("text")
                .transition()
                .duration(function() {
                        return 800;
                })
                .style("font-size", 120);*/
        }
        private rebind(): d3.selection.Update<User> {
           return this.d3Users
                .selectAll("circle")
                .data(this.users);
        
        }
        private clickUser () {
            /* 'that' is the instance of graph */
            const that = this;
            return function(d:User, i:number) {
                /* 'this' is the DOM element */
                console.log("CLICK - User - up  UserChocieForm");
                //const name = this.getAttribute("data-name");
                const id = this.getAttribute("data-id");
                mediator.selectUser(id);
                console.log("This was clicked", that);
            }
        }
        private overUser () {
            /* 'that' is the instance of graph */
            const that = this;
            return function(d:User, i:number) {
                /* 'this' is the DOM element */
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
             /* 'that' is the instance of graph */
            const that = this;
            return function(d:User, i:number) {
                /* 'this' is the DOM element */
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
                    /*.on("mouseup", function(e) {
                        const name = this.getAttribute("data-name");
                        stage.selectUser(name);
                    });*/
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
            this.users = users;
            this.setupUsers();
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
    export class Mediator {

        userChoiceHistory : Array<ComfortUserChoice>;
        formUserChoice : FormUserChoice;
        graphComfortEntry : GraphComfortEntry;
        graphComfortHistory: GraphComfortHistory;
        
        constructor() {
            console.log("START everything");
            this.userChoiceHistory = new Array<ComfortUserChoice>();
            this.formUserChoice = new FormUserChoice();
        }
        public do(command:string, params:any) {
            switch (command)
            {
                case "addUser":
                    this.addUser(params);
                    break;
                case "setUsers":
                    this.setUsers(params);
                    break;
                case "saveComfortFeedback":
                    const area = params.area;
                    const distance = params.number;
                    const user = params.user;
                    this.saveGraph(area, distance, user);
            }
        }
        public addUser(user:User) {
            this.formUserChoice.addUser(user);
        }
        public setUsers(users:Array<User>) {
            this.formUserChoice.setUsers(users);
        }

        public showUserChoice() {
            this.formUserChoice.show();
        }

        private showGraphComfortEntry(user:User) {
            if(!this.graphComfortEntry) {
                this.graphComfortEntry = new GraphComfortEntry();
            }
            this.graphComfortEntry.show(user);
        }

        private showGraphComfortHistory() {
            if(!this.graphComfortHistory) {
                this.graphComfortEntry = null;
                this.graphComfortHistory = new GraphComfortHistory();
            }
            this.graphComfortHistory.show(this.userChoiceHistory);
        }

        public selectUser(id) {
            console.log("ACTION selectUser", id);
            const user = this.formUserChoice.getUser(id);
            this.formUserChoice.hide();
            this.showGraphComfortEntry(user);
        }

        public saveGraph(area:string, distance:number, user:User) {
            this.formUserChoice.markUserDone(user);
            this.addUserChoiceHistory(area, distance, user);
            this.next();
        }

        private addUserChoiceHistory(area:string, distance:number, user:User) {
            const thisUserChoice = this.userChoiceHistory.filter(function(x) {
                return x.user.id === user.id;
            });
            if(thisUserChoice.length) {
                thisUserChoice[0].area = area;
                thisUserChoice[0].distance = distance;
            } else {
                const userChoice = new ComfortUserChoice(user,distance,area);
                this.userChoiceHistory.push(userChoice);
            }
        }  

        private next() {
            //const prom = new Promsie()
            console.log("ACTION nextUser", this);
            this.graphComfortEntry.hide().then(function() {
                if(this.formUserChoice.hasMoreUsers()) {
                    console.log("Users left...", this);
                    this.formUserChoice.show();
                } else {
                    console.log("NO users left", this);
                    //this.formUserChoice.show();
                    this.showGraphComfortHistory();
                }
            }.bind(this));
            
            
        }

        //setupUsers
        //
    }
    
    
    class SVG {
        static element(tagName) {
            return document.createElementNS("http://www.w3.org/2000/svg", tagName);
        }

        static circle(r, x, y, className) {
            const el = SVG.element("circle");
            el.setAttribute("r", r);
            el.setAttribute("cx", x);
            el.setAttribute("cy", y);
            el.setAttribute("class", className);
            return el;
            //<circle id="stretch" r="300" cx="400" cy="400" />

        }
    }

    class ComfortZones {
        name : string;
        radius: number;
        constructor(name: string, radius: number) {
            this.name = name;
            this.radius = radius; 
        }
    }
}

//const stage = new Comfort.Stage();
const mediator = new Comfort.Mediator();
mediator.setUsers([
    new Comfort.User("Adam Hall","xxx1"), 
    new Comfort.User("Billie Davey","xxx2"), 
    new Comfort.User("Laura Rowe","xxx3")
]);
