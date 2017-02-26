/*
<g id="users" transform="">
    <g id="user1" class="user-group">
        <rect y="150" x="0" width="800" height="90" data-name="asd" data-id="user1"></rect>
        <text class="username" y="210" x="60" data-name="asd" style="font-size: 60px; font-family: &quot;Share Tech Mono&quot;; fill: rgb(128, 128, 128);">asd</text>
    </g>
    <g id="user2" class="user-group">
        <rect y="240" x="0" width="800" height="90" data-name="sadasd" data-id="user2"></rect>
        <text class="username" y="300" x="60" data-name="sadasd" style="font-size: 60px; font-family: &quot;Share Tech Mono&quot;; fill: rgb(128, 128, 128);">sadasd</text>
    </g>
</g>
*/

import * as React from "react";
import { IUser, IUserList } from "UserListConnector";

export const ReduxUserList = (state: IUserList) => { // , onZoneUnfocus, onZoneClick, onZoneActive) => (
    return <g id="users">
        {state.users.map((user, i) =>
            <ReduxUser {...user} />
        )}
    </g >;
};

export const ReduxUser = (state: IUser) => {
    // 60 , 150, 240
    return <g className="user-group">
        <rect y="60" x="0" width="800" height="90"></rect>
        <text className="username" y={state.y} x="60">{state.username}</text>
    </g>;
};
