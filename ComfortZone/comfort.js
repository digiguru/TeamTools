/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../Shared/User.ts"/>
/// <reference path="../Shared/InMemoryBrowserUsers.ts"/>
/// <reference path="../ComfortZone/Mediator.ts"/>
var mediator, userLoader;
requirejs.config({
    baseUrl: '/'
});
require(['ComfortZone/Mediator', 'Shared/User', 'Shared/InMemoryBrowserUsers'], function (m, u, b) {
    console.log("Starting");
    mediator = new m.Mediator(23, 23);
    console.log(mediator);
    userLoader = new b.InMemoryBrowserUsers(window);
    userLoader.getUsers().then(function (users) {
        if (users) {
            mediator.setUsers(users);
        }
        else {
            mediator.setUsers([
                new u.User("Adam Hall", "xxx1"),
                new u.User("Billie Davey", "xxx2"),
                new u.User("Laura Rowe", "xxx3"),
                new u.User("Simon Dawson", "xxx4")
            ]);
        }
    });
    document.addEventListener("selectUser", function (e) {
        mediator.selectUser(e.detail.id);
    });
    document.addEventListener("saveGraph", function (e) {
        var o = e.detail;
        mediator.saveGraph(o.area, o.distance, o.currentUser);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbWZvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOENBQThDO0FBQzlDLCtEQUErRDtBQUMvRCx5REFBeUQ7QUFDekQseUNBQXlDO0FBQ3pDLHlEQUF5RDtBQUN6RCxrREFBa0Q7QUFHbEQsSUFBSSxRQUFRLEVBQ1IsVUFBVSxDQUFDO0FBQ2YsU0FBUyxDQUFDLE1BQU0sQ0FBRTtJQUNkLE9BQU8sRUFBRyxHQUFHO0NBQ2hCLENBQUMsQ0FBQztBQUdILE9BQU8sQ0FBQyxDQUFDLHNCQUFzQixFQUFDLGFBQWEsRUFBQyw2QkFBNkIsQ0FBQyxFQUFFLFVBQVMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDO0lBQ3hGLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEIsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0QixVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEQsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFTLEtBQUs7UUFDckMsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNQLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDZCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFDLE1BQU0sQ0FBQztnQkFDOUIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBQyxNQUFNLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUMsTUFBTSxDQUFDO2dCQUMvQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFDLE1BQU0sQ0FBQzthQUNwQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFVBQVMsQ0FBYTtRQUMxRCxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFVBQVMsQ0FBYTtRQUN6RCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ2pCLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUMsQ0FBQztJQUNLLEtBQUs7SUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLENBQUMsQ0FBQyxDQUFDO0FBQ0g7Ozs7Ozs7Ozs7O0VBV0U7QUFFRixvQ0FBb0M7QUFDcEMsNEJBQTRCO0FBRzVCLG9DQUFvQztBQUNwQyxrQ0FBa0M7QUFDbEM7O0tBRUs7QUFDTCxrQkFBa0IiLCJmaWxlIjoiY29tZm9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL2QzL2QzLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvZXM2LXByb21pc2UvZXM2LXByb21pc2UuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL3JlcXVpcmVqcy9yZXF1aXJlLmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vU2hhcmVkL1VzZXIudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vU2hhcmVkL0luTWVtb3J5QnJvd3NlclVzZXJzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0NvbWZvcnRab25lL01lZGlhdG9yLnRzXCIvPlxuXG5cbnZhciBtZWRpYXRvcixcbiAgICB1c2VyTG9hZGVyO1xucmVxdWlyZWpzLmNvbmZpZygge1xuICAgIGJhc2VVcmwgOiAnLydcbn0pO1xuXG5cbnJlcXVpcmUoWydDb21mb3J0Wm9uZS9NZWRpYXRvcicsJ1NoYXJlZC9Vc2VyJywnU2hhcmVkL0luTWVtb3J5QnJvd3NlclVzZXJzJ10sIGZ1bmN0aW9uKG0sdSxiKSB7XG4gICAgY29uc29sZS5sb2coXCJTdGFydGluZ1wiKTtcbiAgICBtZWRpYXRvciA9IG5ldyBtLk1lZGlhdG9yKDIzLDIzKTtcbiAgICBjb25zb2xlLmxvZyhtZWRpYXRvcik7XG4gICAgdXNlckxvYWRlciA9IG5ldyBiLkluTWVtb3J5QnJvd3NlclVzZXJzKHdpbmRvdyk7XG4gICAgdXNlckxvYWRlci5nZXRVc2VycygpLnRoZW4oZnVuY3Rpb24odXNlcnMpIHtcbiAgICAgICAgaWYodXNlcnMpIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnNldFVzZXJzKHVzZXJzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lZGlhdG9yLnNldFVzZXJzKFtcbiAgICAgICAgICAgICAgICBuZXcgdS5Vc2VyKFwiQWRhbSBIYWxsXCIsXCJ4eHgxXCIpLCBcbiAgICAgICAgICAgICAgICBuZXcgdS5Vc2VyKFwiQmlsbGllIERhdmV5XCIsXCJ4eHgyXCIpLCBcbiAgICAgICAgICAgICAgICBuZXcgdS5Vc2VyKFwiTGF1cmEgUm93ZVwiLFwieHh4M1wiKSxcbiAgICAgICAgICAgICAgICBuZXcgdS5Vc2VyKFwiU2ltb24gRGF3c29uXCIsXCJ4eHg0XCIpXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzZWxlY3RVc2VyXCIsIGZ1bmN0aW9uKGU6Q3VzdG9tRXZlbnQpIHtcbiAgICAgICAgbWVkaWF0b3Iuc2VsZWN0VXNlcihlLmRldGFpbC5pZCk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNhdmVHcmFwaFwiLCBmdW5jdGlvbihlOkN1c3RvbUV2ZW50KSB7XG4gICAgICAgIHZhciBvID0gZS5kZXRhaWw7XG4gICAgICAgIG1lZGlhdG9yLnNhdmVHcmFwaChvLmFyZWEsby5kaXN0YW5jZSxvLmN1cnJlbnRVc2VyKTtcbiAgICB9KTtcbiAgICAgICAgICAgIC8vO1wiKVxuICAgIGNvbnNvbGUubG9nKG1lZGlhdG9yKTtcbn0pO1xuLypcbkNvbW1hbmRzIHlvdSBjYW4gdGhyb3cgaW50byB0aGUgbWVkaWF0b3IuLi4uXG5cbm1lZGlhdG9yLnNldFVzZXJzKFtcbiAgIHtuYW1lOlwiTmlnZWwgSGFsbFwiLGlkOlwiMXh4MFwifSwgXG4gICB7bmFtZTpcIkZyZWQgSGFsbFwiLGlkOlwiMXh4MVwifSwgXG4gICB7bmFtZTpcIkJvYiBIYWxsXCIsaWQ6XCIxeHgyXCJ9IFxuXSk7XG5cbm1lZGlhdG9yLmFkZFVzZXIoe25hbWU6XCJNYW5keVwiLCBpZDpcIjk4MTI5ODEyOVwifSlcblxuKi9cblxuLy9pbXBvcnQge01lZGlhdG9yfSBmcm9tICdNZWRpYXRvcic7XG4vL2ltcG9ydCB7VXNlcn0gZnJvbSAnVXNlcic7XG5cblxuLy9jb25zdCBzdGFnZSA9IG5ldyBDb21mb3J0LlN0YWdlKCk7XG4vL2NvbnN0IG1lZGlhdG9yID0gbmV3IE1lZGlhdG9yKCk7XG4vKm1lZGlhdG9yLnNldFVzZXJzKFtcbiAgIFxuXSk7Ki9cbi8vZXhwb3J0IG1lZGlhdG9yO1xuXG4iXX0=
