import React from 'react';
import { alertType, publishAlert } from '../Shared/ErrorSubscriber';

type MyProps = {
    message: string;
    handleUserListChange(userList: Array<string>): void;
};
type MyState = {
    users: Array<string>;
    currentUser: string;
};
export class UserEntry extends React.Component<MyProps, MyState> {
    state: MyState = {
      users: ["fred", "bob"],
      currentUser: ""
    };
    addUser = (user) => {
        if(this.state.users.includes(user)) {
            publishAlert(user + " is already in the list", alertType.error);
            return
        }
        let users = this.state.users.concat([user]);
        this.setState({users: users});
        this.props.handleUserListChange(users);
        publishAlert("Added user " + user, alertType.info);
    }
    handleAddUser = (event) => {
        let user = this.state.currentUser;
        this.addUser(user);
    }
    handleNameChange = (event) => {
        this.setState({currentUser: event.currentTarget.value})
        const code = event.keyCode;
        if (code === 13) {
            this.handleAddUser(event)
        }
    }
    handleClickRemove = (event) => {
        let el = event.currentTarget.parentNode;
        let name = el.textContent.slice(0, -1);
        this.handleRemoveName(name);

    }
    handleRemoveName = (name) => {
        let users = this.state.users.filter(v=>v!==name);
        this.setState({users: users});
        this.props.handleUserListChange(users);
    }
    render() {
      return (
        <div>
            <p>{this.props.message}</p>
            <ul id="users">
            {this.state.users.map((user) =>
                <li>{user}<button onClick={this.handleClickRemove}>X</button></li>
            )}
            </ul>

            <input type="text" placeholder="Joe Bloggs" id="user" onKeyUp={this.handleNameChange}  />
            <input type="button" value="add" id="add" onClick={this.handleAddUser} />
        </div>
      );
    }
  }