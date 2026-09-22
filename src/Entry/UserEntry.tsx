import React from 'react';
import { alertMessage, alertError, userAdd, userRemove } from '../Shared/StreamSubscriber';

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
      users: [],
      currentUser: ""
    };
    addUser = (user) => {
        if(this.state.users.includes(user))
            return alertError(user + " is already in the list");
        if(!user)
            return alertError("Cannot add blank users");
        let users = this.state.users.concat([user]);
        this.setState({users: users});
        this.props.handleUserListChange(users);
        alertMessage("Added user " + user);
        userAdd(user);
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
        let user = this.state.users.find(v=>v===name);
        let users = this.state.users.filter(v=>v!==name);
        
        this.setState({users: users});
        this.props.handleUserListChange(users);
        alertMessage("Removed user " + name);
        userRemove(user);
    }
    render() {
      return (
        <div>
            <p className="entry-kicker">{this.props.message}</p>
            <ul id="users" className="participant-list">
            {this.state.users.map((user) =>
                <li key={user}><span>{user}</span><button aria-label={`Remove ${user}`} onClick={this.handleClickRemove}>×</button></li>
            )}
            </ul>

            <div className="participant-entry-row">
              <input type="text" placeholder="Add participant name" id="user" onKeyUp={this.handleNameChange} />
              <input type="button" value="Add participant" id="add" onClick={this.handleAddUser} />
            </div>
        </div>
      );
    }
  }