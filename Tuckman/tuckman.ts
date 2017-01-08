/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>


var mediator;
requirejs.config( {
    baseUrl : '/'
});
require(['Tuckman/Mediator','Shared/User'], function(m,u) {
    console.log("Starting");
    mediator = new m.Mediator(23,23);
    console.log(mediator);
    mediator.setUsers([
        new u.User("Adam Hall","xxx1"), 
        new u.User("Billie Davey","xxx2"), 
        new u.User("Laura Rowe","xxx3"),
        new u.User("Simon Dawson","xxx4")
    ]);
    document.addEventListener("selectUser", function(e:CustomEvent) {
        mediator.selectUser(e.detail.id);
    });
    document.addEventListener("saveGraph", function(e:CustomEvent) {
        var o = e.detail;
        mediator.saveGraph(o.area,o.distance,o.currentUser);
    });
            //;")
    console.log(mediator);
});
/*
Commands you can throw into the mediator....

mediator.setUsers([
   {name:"Nigel Hall",id:"1xx0"}, 
   {name:"Fred Hall",id:"1xx1"}, 
   {name:"Bob Hall",id:"1xx2"} 
]);

mediator.addUser({name:"Mandy", id:"981298129"})

*/

//import {Mediator} from 'Mediator';
//import {User} from 'User';


//const stage = new Comfort.Stage();
//const mediator = new Mediator();
/*mediator.setUsers([
   
]);*/
//export mediator;
