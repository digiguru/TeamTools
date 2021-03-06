import * as React from "react";
import { IUserListWithEvents, IUserUIWithEvents } from "./Model";

export const ReduxUserList = (state: IUserListWithEvents) => { // , onZoneUnfocus, onZoneClick, onZoneActive) => (
    const className = state.ShowUsers ? "appear" : "disappear";

    return <g id="users" className={className}>
        {state.Users.map((user: IUserUIWithEvents, i) =>
            <ReduxUser key={user.Username} {...user} events={state.events} />
        )}
    </g >;
};

export const ReduxUser = (state: IUserUIWithEvents) => {
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
