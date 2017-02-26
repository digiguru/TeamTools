import * as React from "react";

export class Delete extends React.Component<undefined, undefined> {
    render() {
        return <a href="void(0);">X</a>;
    }
}
export class User extends React.Component<IUsername, undefined> {
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

        this.props.users.forEach(function(user: UserObject) {
            users.push(<User username={user.name} key={user.name} />);
        });
        return <ul id="users">{users}</ul>;
    }
}
export class UserObject {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

export interface IUsername { username: string; }
export interface IUserList { users: Array<UserObject>; }
