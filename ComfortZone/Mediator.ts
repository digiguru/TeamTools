import {ComfortUserChoice} from './ComfortUserChoice';
import {BreadcrumbControl} from '../Shared/BreadcrumbControl';
import {User} from '../Shared/User';
import {FormUserChoice} from '../Shared/FormUserChoice';
import {GraphComfortEntry} from './GraphComfortEntry';
import {GraphComfortHistory} from './GraphComfortHistory';


export class Mediator {

    userChoiceHistory : Array<ComfortUserChoice>;
    formUserChoice : FormUserChoice;
    graphComfortEntry : GraphComfortEntry;
    graphComfortHistory: GraphComfortHistory;
    breadcrumbControl: BreadcrumbControl;
    
    constructor() {
        console.log("START everything");
        this.userChoiceHistory = new Array<ComfortUserChoice>();
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
            case "saveComfortFeedback":
                const area = params.area;
                const distance = params.number;
                const user = params.user;
                this.saveGraph(area, distance, user);
                break;
            case "showUserChoice":
                this.showUserChoice();
                break;
            case "showGraphComfortHistory":
                this.showGraphComfortHistory();
                break;
            case "showGraphComfortChoice":
                const comfortuser:User = params;
                this.showGraphComfortEntry(comfortuser);
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

    private showGraphComfortEntry(user:User) {
        if(!this.graphComfortEntry) {
            this.graphComfortEntry = new GraphComfortEntry();
        }
        this.graphComfortEntry.show(user);
    }
    
    public showComfortHistory(history) {
        var afterHide = function() {
           if(!this.graphComfortHistory) {
                this.graphComfortEntry = null;
                this.graphComfortHistory = new GraphComfortHistory();
            }
            this.graphComfortHistory.show(history);
        }.bind(this);
        if (this.graphComfortEntry) {
            this.graphComfortEntry.hide().then(afterHide);
        } else {
            if(this.formUserChoice) {
                this.formUserChoice.hide();
            }
            afterHide();
        }
        
       
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
        var afterHide = function() {
            if(this.formUserChoice.hasMoreUsers()) {
                console.log("Users left...", this);
                this.showUserChoice();
            } else {
                console.log("NO users left", this);
                this.showGraphComfortHistory();
            }
        }.bind(this);
        
        this.graphComfortEntry.hide().then(afterHide);
    }

    //setupUsers
    //
}