import {TuckmanUserChoice} from "./TuckmanUserChoice";
import {BreadcrumbControl} from "../Shared/BreadcrumbControl";
import {User} from "../Shared/User";
import {FormUserChoice} from "../Shared/FormUserChoice";
import {GraphTuckmanEntry} from "./GraphTuckmanEntry";
import {GraphTuckmanHistory} from "./GraphTuckmanHistory";


export class Mediator {

    userChoiceHistory : Array<TuckmanUserChoice>;
    formUserChoice : FormUserChoice;
    graphTuckmanEntry : GraphTuckmanEntry;
    graphTuckmanHistory: GraphTuckmanHistory;
    breadcrumbControl: BreadcrumbControl;
    
    constructor() {
        console.log("START everything");
        this.userChoiceHistory = new Array<TuckmanUserChoice>();
        this.formUserChoice = new FormUserChoice();
        this.breadcrumbControl = new BreadcrumbControl();
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
            case "saveTuckmanFeedback":
                const area = params.area;
                const distance = params.number;
                const user = params.user;
                this.saveGraph(area, distance, user);
                break;
            case "showUserChoice":
                this.showUserChoice();
                break;
            case "showGraphTuckmanHistory":
                this.showGraphTuckmanHistory();
                break;
            case "showGraphTuckmanChoice":
                const comfortuser:User = params;
                this.showGraphTuckmanEntry(comfortuser);
                break;

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

    private showGraphTuckmanEntry(user:User) {
        if(!this.graphTuckmanEntry) {
            this.graphTuckmanEntry = new GraphTuckmanEntry();
        }
        this.graphTuckmanEntry.show(user);
    }
    
    public showTuckmanHistory(history) {
        let afterHide = function() {
           if(!this.graphTuckmanHistory) {
                this.graphTuckmanEntry = null;
                this.graphTuckmanHistory = new GraphTuckmanHistory();
            }
            this.graphTuckmanHistory.show(history);
        }.bind(this);
        if (this.graphTuckmanEntry) {
            this.graphTuckmanEntry.hide().then(afterHide);
        } else {
            if(this.formUserChoice) {
                this.formUserChoice.hide();
            }
            afterHide();
        }
        
       
    }

    private showGraphTuckmanHistory() {
        if(!this.graphTuckmanHistory) {
            this.graphTuckmanEntry = null;
            this.graphTuckmanHistory = new GraphTuckmanHistory();
        }
        this.graphTuckmanHistory.show(this.userChoiceHistory);
    }

    public selectUser(id) {
        console.log("ACTION selectUser", id);
        const user = this.formUserChoice.getUser(id).then((user) => {
            this.formUserChoice.hide();
            this.showGraphTuckmanEntry(user);
        });
        
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
            const userChoice = new TuckmanUserChoice(user,distance,area);
            this.userChoiceHistory.push(userChoice);
        }
    }  

    private next() {
        //const prom = new Promsie()
        console.log("ACTION nextUser", this);
        let afterHide = function() {
            this.formUserChoice.hasMoreUsers().then((result) => {
                if(result){
                    console.log("Users left...", this);
                    this.showUserChoice();
                } else {
                    console.log("NO users left", this);
                    this.showGraphTuckmanHistory();
                }
            })
        }.bind(this);
        
        this.graphTuckmanEntry.hide().then(afterHide);
    }

    //setupUsers
    //
}