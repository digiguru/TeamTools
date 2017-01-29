/*
<ul id="users"><li><span class="user">Adam Hall</span><a href="void(0);">X</a></li><li><span class="user">Billie Davey</span><a href="void(0);">X</a></li><li><span class="user">Laura Rowe</span><a href="void(0);">X</a></li><li><span class="user">Simon Dawson</span><a href="void(0);">X</a></li><li><span class="user">Fred</span><a href="void(0);">X</a></li></ul>
*/

import * as React from "react";
import * as ReactDOM from "react-dom";
import {UserObject, UserList} from "userComponents";
import {ComfortReact, WeirdExample} from "ComfortReact";

export const USERS = [
    new UserObject("Bob"),
    new UserObject("Donald")
];
if(document.getElementById("container")) {
    ReactDOM.render(
        <UserList users={USERS} />,
        document.getElementById("container")
    );
    ReactDOM.render(
        <ComfortReact />,
        document.getElementById("comfort")
    );
} else {
    ReactDOM.render(
        <WeirdExample />,
        document.getElementById("weird")
    );

}



