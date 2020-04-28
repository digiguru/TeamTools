import * as React from "react";
import { InMemoryBrowserUsers } from "../../Shared/InMemoryBrowserUsers";
import { User } from "../../Shared/User";

interface StateUserInputComponent {
    users: User[];
}
export class UserInputComponent extends React.Component<any, StateUserInputComponent> {
    constructor(props, context) {
        super(props, context);

        console.log("UserInputComponent");
        new InMemoryBrowserUsers(window).getUsers().then((u: User[]) => {
            console.log("UserInputComponent: Load users", u);
            this.setState({users: u});
        });
    }

    render() {
        return <textarea id="users">{this.state.users.map((user, i) =>
            user.name)}</textarea>;
    }
}
