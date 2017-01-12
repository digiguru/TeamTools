/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../Shared/InMemoryBrowserUsers.ts"/>
/// <reference path="../Shared/UserConstructor.ts"/>
var users;
requirejs.config( {
    baseUrl : '/'
});


require(['Shared/InMemoryBrowserUsers', 'Shared/UserConstructor'], function(u, c) {

    console.log("Starting");
    users = new u.InMemoryBrowserUsers(window);
    
    users.getUsers().then((data) => {
        console.log("Have these users", data);
        if (data && data.length) {
            const strings:string[] = data.map((user) => {
                return user.name;
            });
            console.log("see", strings);
            const text = strings.join("\n");
            console.log("is", text);
            document.getElementById('users').value = text;
        }
        document.getElementById('save').addEventListener("mousedown", () => {
            var entry :string = document.getElementById('users').value;
            var usernames = entry.split("\n");
            var newusers = c.UserConstructor.createUsersByNames(usernames);
            window.users.setUsers(newusers).then((result) => {
                console.log("Set users", result);
            });
        });
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

