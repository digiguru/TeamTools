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
import { IUserUI, IUserList } from "UserListConnector";

export const ReduxUserList = (state) => { // , onZoneUnfocus, onZoneClick, onZoneActive) => (
    const className = state.ShowUsers ? "appear" : "disappear";

    return <g id="users" className={className}>
        {state.Users.map((user: IUserUI, i) =>
            <ReduxUser key={user.Username} {...user} events={state.events} />
        )}
    </g >;
};

export const ReduxUser = (state) => {
    // 60 , 150, 240
    const textY = state.Y + 60;
    return <g className="user-group">
        <rect
            className={state.Focus}
            onMouseEnter={() => state.events.onUserOverFocus(state.Username)}
            onMouseLeave={() => state.events.onUserOffFocus(state.Username)}
            onMouseDown={() => state.events.onUserMouseDown(state.Username)}
            onMouseUp={(event) => state.events.onUserMouseUp(state.Username, event)}
         y={state.Y} x="0" width="800" height="90"></rect>
        <text className="username" y={textY} x="60">{state.Username}</text>
    </g>;
};
