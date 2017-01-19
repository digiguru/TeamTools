/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/requirejs/require.d.ts"/>
/// <reference path="../Shared/User.ts"/>
/// <reference path="../Shared/InMemoryBrowserUsers.ts"/>
/// <reference path="../Tuckman/Mediator.ts"/>


let mediator,
    userLoader;
requirejs.config( {
    baseUrl : "/"
});
require(["Tuckman/Mediator", "Shared/User", "Shared/InMemoryBrowserUsers"], (m, u, b) => {
    console.log("Starting");
    mediator = new m.Mediator(23, 23);
    userLoader = new b.InMemoryBrowserUsers(window);
    console.log(mediator);
    userLoader.getUsers().then((users) => {
        if (users) {
            mediator.setUsers(users);
        } else {
            mediator.setUsers([
                new u.User("Adam Hall", "xxx1"),
                new u.User("Billie Davey", "xxx2"),
                new u.User("Laura Rowe", "xxx3"),
                new u.User("Simon Dawson", "xxx4")
            ]);
        }

    });
    document.addEventListener("selectUser", (e: CustomEvent) => {
        mediator.selectUser(e.detail.id);
    });
    document.addEventListener("saveGraph", (e: CustomEvent) => {
        let o = e.detail;
        mediator.saveGraph(o.area, o.distance, o.currentUser);
    });

    console.log(mediator);
});