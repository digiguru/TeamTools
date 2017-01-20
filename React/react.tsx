/*
<ul id="users"><li><span class="user">Adam Hall</span><a href="void(0);">X</a></li><li><span class="user">Billie Davey</span><a href="void(0);">X</a></li><li><span class="user">Laura Rowe</span><a href="void(0);">X</a></li><li><span class="user">Simon Dawson</span><a href="void(0);">X</a></li><li><span class="user">Fred</span><a href="void(0);">X</a></li></ul>
*/
class Delete extends React.Component<any, any> {
    render() {
        return <a href="void(0);">X</a>;
    }
}
class User extends React.Component<any, any> {
  render() {
    return <li><span className="user">{this.props.username}</span><Delete /></li>;
  }
}
class UserList extends React.Component<any, any> {
    render() {
        const users = [];

        this.props.users.forEach(function(user: UserObject) {
            users.push(<User user={user} username={user.name} key={user.name} />);
        });
        return <ul id="users">{users}</ul>;
    }
}
class UserObject {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}
let USERS = [
    new UserObject("Bob"),
    new UserObject("Donald")
];
ReactDOM.render(
  <UserList users={USERS} />,
  document.getElementById("container")
);