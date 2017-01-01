/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../Shared/InMemoryBrowserUsers.ts"/>
var users;
requirejs.config( {
    baseUrl : '/'
});


require(['Shared/InMemoryBrowserUsers'], function(u) {

    console.log("Starting");
    users = new u.InMemoryBrowserUsers(window);
    
    users.getUsers().then((data) => {
        if (data) {
            const strings:string[] = data.map((user) => {
                return user.username;
            });
            
            const text = strings.join("\n");
            console.log(strings);
            document.getElementById('users').value = text;
        }
         
    });
    
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

