import React from 'react';

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
        let users = this.state.users.concat([user]);
        this.setState({users: users});
        this.props.handleUserListChange(users);
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
    render() {
      return (
        <div>
            <p>{this.props.message}</p>
            <ul id="users">
            {this.state.users.map((user) =>
                <li>{user}</li>
            )}
            </ul>

            <input type="text" placeholder="Joe Bloggs" id="user" onKeyUp={this.handleNameChange}  />
            <input type="button" value="add" id="add" onClick={this.handleAddUser} />
        </div>
      );
    }
  }