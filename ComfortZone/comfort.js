/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="Polar.ts"/>
//import {Promise} from 'es6-promise';
//import {Point} from 'Point';
//import {Point} from './Point';
//import {Polar} from './Polar';
require(['Mediator', 'User'], function (m, u) {
    console.log("Starting");
    var mediator = new m.Mediator(23, 23);
    console.log(mediator);
    mediator.setUsers([
        new u.User("Adam Hall", "xxx1"),
        new u.User("Billie Davey", "xxx2"),
        new u.User("Laura Rowe", "xxx3"),
        new u.User("Simon Dawson", "xxx4")
    ]);
    console.log(mediator);
});
//import {Mediator} from 'Mediator';
//import {User} from 'User';
//const stage = new Comfort.Stage();
//const mediator = new Mediator();
/*mediator.setUsers([
   
]);*/
//export mediator;
//# sourceMappingURL=comfort.js.map