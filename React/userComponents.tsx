import * as React from "react";
import {IUser, IUserUI, IUserList} from "UserListConnector";

export class Delete extends React.Component<undefined, undefined> {
    render() {
        return <a href="void(0);">X</a>;
    }
}
export class User extends React.Component<IUser, undefined> {
  render() {
    return <li><span className="user">{this.props.username}</span><Delete /></li>;
  }
}
export class NewTeam extends React.Component<undefined, undefined> {
  render() {
    return <input type="button" value="new team" id="new" />;
  }
}

export class UserList extends React.Component<IUserList, undefined> {
    render() {
        const users = [];

        this.props.users.forEach(function(user: IUserUI) {
            users.push(<User username={user.username} />);
        });
        return <ul id="users">{users}</ul>;
    }
}
