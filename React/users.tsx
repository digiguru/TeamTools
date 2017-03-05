/*
<ul id="users"><li><span class="user">Adam Hall</span><a href="void(0);">X</a></li><li><span class="user">Billie Davey</span><a href="void(0);">X</a></li><li><span class="user">Laura Rowe</span><a href="void(0);">X</a></li><li><span class="user">Simon Dawson</span><a href="void(0);">X</a></li><li><span class="user">Fred</span><a href="void(0);">X</a></li></ul>
*/

import * as React from "react";
import * as ReactDOM from "react-dom";
import {UserList} from "userComponents";
import {ComfortReact} from "ComfortReact";
import {TuckmanComponent} from "TuckmanReact";
import {IUser} from "UserListConnector";

export const USERS: IUser[] = [
    {Username: "Bob"},
    {Username: "Donald"}
];

ReactDOM.render(
    <UserList Users={USERS} />,
    document.getElementById("container")
);
ReactDOM.render(
    <ComfortReact />,
    document.getElementById("comfort")
);
ReactDOM.render(
    <TuckmanComponent />,
    document.getElementById("tuckman")
);




