/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="Polar.ts"/>

//import {Promise} from 'es6-promise';
//import {Point} from 'Point';
//import {Point} from './Point';
//import {Polar} from './Polar';




console.log("Starting");

require(['Polar'], function(o) {
    const polar = new o.Polar(23,23);
    console.log(polar);
});

require(['Point'], function(o) {
    const Point = new o.Point(23,23);
    console.log(Point);
});

require(['Mediator'], function(o) {
    const Mediator = new o.Mediator(23,23);
    console.log(Mediator);
});
    
//import {Mediator} from 'Mediator';
//import {User} from 'User';


//const stage = new Comfort.Stage();
//const mediator = new Mediator();
/*mediator.setUsers([
    new User("Adam Hall","xxx1"), 
    new User("Billie Davey","xxx2"), 
    new User("Laura Rowe","xxx3"),
    new User("Simon Dawson","xxx4")
]);*/
//export mediator;

