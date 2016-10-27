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

    export class ComfortUserChoiceHistory {
        date :Date;
        data : Array<ComfortUserChoice>;
    }
    export class ComfortUserChoice {
        user : User;
        distance : Number;
        area : String;
        constructor(user : User, distance : Number, area : String) {
          this.user = user;
          this.distance = distance;
          this.area = area;
        }
    }
   
    export class ComfortEntryGraph {
        clickArea : HTMLElement;
        chaos : HTMLElement;
        stretch : HTMLElement;
        comfort : HTMLElement;
        currentUser:User;
        centerPoint:Point;
        dropper : SVGAElement;
        
        constructor() {
            this.setupArea();
            this.setupOverActivity();
        }

        private startDrag = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            return true;
        }, this);

        private dragEvent = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            this.dropper.setAttribute("cx", e.offsetX);
            this.dropper.setAttribute("cy", e.offsetY);
            return true;
        }, this);
        
        private dropEvent = Event.fixScope(function (e) {
            let clickPoint = new Point(e.offsetX, e.offsetY);
            this.dropper.setAttribute("cx", e.offsetX);
            this.dropper.setAttribute("cy", e.offsetY);
            this.dropper.setAttribute("class", "dropped");
            return true;
        }, this);
        
        private setupArea () {
            this.clickArea = document.getElementById('clickable');
            
            
            let zones = [new ComfortZones("stretch",300), new ComfortZones("comfort",100)];
            let d3zones = d3.select("g#zones")
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
            this.centerPoint = new Point(parseInt(this.comfort.getAttribute('cx'), 10), parseInt(this.comfort.getAttribute('cy'), 10);
            

        }

        public setupOverActivity () {
            let that = this;
            d3.select("#stage").on("mousemove", this.graphMove());//this.checkArea);
        }

        private setupClickActivity () {
            console.log("SETUP graph click");
            d3.select("#stage").on("mouseup", this.graphUp());
            d3.select("#stage").on("mousedown", this.graphDown());
                
            //Event.add(['mousedown'], this.stage, this.addCircle);
            //Event.add(['mousemove'], this.stage, this.checkArea);
            
            //MouseEvent.drag(this.clickArea, this.startDrag, this.dragEvent, this.dropEvent, this);

            //Setup center
        }

        private graphMove() {
            /* 'that' is the instance of graph */
            let that : ComfortEntryGraph = this;
            return function(d:void, i:number) {
                /* 'this' is the DOM element */
                let coord = d3.mouse(this);
                let distance = Point.distance(that.centerPoint, Point.fromCoords(coord));
                let area = ComfortEntryGraph.calculateDistance(distance);
                that.highlight(area);
            }
        }

        private graphUp() {
            /* 'that' is the instance of graph */
            let that : ComfortEntryGraph = this;
            return function(d:void, i :number) {
                /* 'this' is the DOM element */
                let coord = Point.fromCoords(d3.mouse(this));
                let distance = Point.distance(that.centerPoint, coord);
                let area = ComfortEntryGraph.calculateDistance(distance);          
                that.saveTheInteraction(area, distance);
            }
        }

         private graphDown() {
            /* 'that' is the instance of graph */
            let that = this;
            return function(d:void, i:number) {
                /* 'this' is the DOM element */
                let coord = Point.fromCoords(d3.mouse(this));
                let el = SVG.circle(8, coord.x, coord.y, "dropper");
                that.addDropper(el);
            }
        }

        public highlight ( area : string) {
            //<circle id="stretch" r="300" cx="400" cy="400" />
            //<circle id="comfort" r="100" cx="400" cy="400" />

           
            let d3zones = d3.select("svg")
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
                             return "#00D7FE";
                        }
                        return "grey";
                    });
            
        }
        
       
        public addDropper (el : SVGAElement)  {
            this.dropper = el;
            document.getElementById('stage').insertBefore(el, this.clickArea);
        }

        public static calculateDistance(distance) {
            let area = "";
            if(distance < 100) {
                area = "comfort";
            } else if (distance < 300) {
                area = "stretch";
            } else {
                area = "chaos";
            }
            return area;
        }

      
        public removeClickActivity () {
            console.log("Remove future interaction");
            d3.select("#stage").on("mouseup", function(a,b,c) {
                console.log("UNCLICK - Graphup - No longer interactive stage");
            });
            d3.select("#stage").on("mousedown", function(a,b,c) {
                console.log("UNCLICK - Graphdown - No longer interactive stage");
            });
            
        }
        public saveTheInteraction (area:string, distance:number) {
            console.log("saveTheInteraction");
            this.removeClickActivity();
            stage.saveGraph(area,distance,this.currentUser);
            //stage.nextUser();
        }
        public hide():Promise<number> {
            console.log("HIDE comfortGRAPH");
            
            let d3zones = d3.select("g#zones")    
                .selectAll("circle")
                    .transition()
                    .duration(1000)
                    .attr("r", 0);

            let d3drops = d3.select("#stage")
                .selectAll("circle.dropper")   
                .transition()
                    .delay(250)
                    .duration(250)
                    .attr("r", 0);
            return Timed.for(1000);
                    
        }
        public show(user:User):Promise<number> {
            this.currentUser = user;
            console.log("SHOW graph");
            let d3zones = d3.select("g#zones")
                .selectAll("circle")
                    .attr("r", 0)
                .transition()
                    .duration(1000)
                    .delay(function(d, i) { return i * 100; })
                    .ease("elastic")
                    .attr("r", function(d:ComfortZones) { 
                        return d.radius; 
                    }); 
            
            return Timed.for(1000).then(this.setupClickActivity.bind(this));
            
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
  
    export class GraphComfortHistory {
        public graphData : Array<ComfortUserChoice>;

        constructor() {
          
        }



        public show():Promise<number> {
            return null;
        }

        public hide():Promise<number> {
return null;
        }
    }
    export class UserChoiceForm {
        userZone : HTMLElement;
        users : Array<User>;
        d3Users :d3.Selection<any>;

        constructor() {
            this.users = [
                new User("Adam Hall","xxx1"), 
                new User("Billie Davey","xxx2"), 
                new User("Laura Rowe","xxx3")
            ];
            this.userZone = document.getElementById('users');
            this.d3Users = d3.select("g#users");
            
            this.setupUsers();
            this.show();
        }
        public getUser(id) : User {
            let users =  this.users.filter(function(x) {
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
            d3.select("g#users")
                .selectAll("rect")
                .on("mouseup", this.clickUser());
        }
        public hasMoreUsers() {
            let unvotedUsers = this.users.filter(function(x) {
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
            let that = this;
            return function(d:User, i:number) {
                /* 'this' is the DOM element */
                console.log("CLICK - User - up  UserChocieForm");
                //let name = this.getAttribute("data-name");
                let id = this.getAttribute("data-id");
                stage.selectUser(id);
                console.log("This was clicked", that);
            }
        }
        private overUser () {
            /* 'that' is the instance of graph */
            let that = this;
            return function(d:User, i:number) {
                /* 'this' is the DOM element */
                d3.select(this.parentNode)
                //let d3zones = d3.select("g#users")
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
            let that = this;
            return function(d:User, i:number) {
                /* 'this' is the DOM element */
                d3.select(this.parentNode)
                //let d3zones = d3.select("g#users")
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
            let that = this;
            return function(e, i) {
                //Event.add(['mousedown'], this.stage, this.chooseUser);
                //Event.add(["mouseover"], this, thisStage.checkOverUsers);
                var d3Item = d3.select(this);

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
                        let name = this.getAttribute("data-name");
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
        private setupUsers () {

            let items = this.rebind();
            items.enter().append("g")
                .attr("id", function(e) {
                    return e.id;
                })
                .attr("class", "user-group")
                .each(this.eachUser());
                 
        }

        
    }
    export class Stage {
        static stage = document.getElementById('stage');
        userChoiceHistory : Array<ComfortUserChoice>;
        comfortEntryGraph : ComfortEntryGraph;
        userChoiceForm : UserChoiceForm;
        graphComfortHistory: GraphComfortHistory;

        constructor() {
            console.log("START everything");
            this.userChoiceHistory = new Array<ComfortUserChoice>();
            this.comfortEntryGraph = new ComfortEntryGraph();
            this.userChoiceForm = new UserChoiceForm();
            this.graphComfortHistory = new GraphComfortHistory();
        }
       
        selectUser(id) {
            console.log("ACTION selectUser", id);
            let user = this.userChoiceForm.getUser(id);
            this.userChoiceForm.hide();
            this.comfortEntryGraph.show(user);
        }

        saveGraph(area:string, distance:number, user:User) {
            this.userChoiceForm.markUserDone(user);
            this.addUserChoiceHistory(area, distance, user);
            this.next();
        }

        private addUserChoiceHistory(area:string, distance:number, user:User) {
            let userChoice = new ComfortUserChoice(user,distance,area);
            this.userChoiceHistory.push(userChoice);
        }  
        private next() {
            //const prom = new Promsie()
            console.log("ACTION nextUser", this);
            this.comfortEntryGraph.hide().then(function() {
                if(this.userChoiceForm.hasMoreUsers()) {
                    console.log("Users left...", this);
                    this.userChoiceForm.show();
                } else {
                    console.log("NO users left", this);
                    this.userChoiceForm.show();
                    this.graphComfortHistory.show();
                }
            }.bind(this));
            
            
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
    class Event {
        static fixScope(event, scope) {
            return event.bind(scope);
        }
        static add(eventNames, element, event) {
            eventNames.forEach(function (eventName) {
                element.addEventListener(eventName, event);
            });
        }

    }
    class MouseEvent {
        static trigger(node, eventType) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent(eventType, true, true);
            node.dispatchEvent(clickEvent);
        }
        
        static stopDrag(element, eventStart, eventDrag, eventDrop, scope) {

        }

        static drag(element, eventStart, eventDrag, eventDrop, scope) {
            scope.mode = "none";

            //scope.startDrag = Event.fixScope(function (e) {
            element.addEventListener('mousemove', eventDrag);
            //}, scope);

            //scope.stopDrag = Event.fixScope(function (e) {
            element.removeEventListener('mousemove', eventDrag);
            //}, scope);

            /*
            Event.add(['mousedown'], element, eventStart);
            Event.add(['mousedown'], element, scope.startDrag);
            Event.add(['mouseup'], element, scope.stopDrag);
            Event.add(['mouseup'], element, eventDrop);
            */
        }
    }
    class Point {
        x : number;
        y : number;

        constructor(x : number, y : number) {
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
            let x = polar.radius * Math.cos(polar.angle)
            let y = polar.radius * Math.sin(polar.angle)
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
    class SVG {
        static element(tagName) {
            return document.createElementNS("http://www.w3.org/2000/svg", tagName);
        }

        static circle(r, x, y, className) {
            let el = SVG.element("circle");
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

var stage = new Comfort.Stage();


