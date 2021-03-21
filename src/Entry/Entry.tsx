import React from 'react';
import { InMemoryBrowserUsers } from '../Shared/InMemoryBrowserUsers';
import { User } from '../Shared/User';
import { UserEntry } from './UserEntry';
function Entry() {
    let users = new InMemoryBrowserUsers(window);
    let handleUserListChange = (userList: Array<string>) => {
        console.log("USERS", userList);
        let newUsers = userList.map((v,i) => new User(v,i.toString()))
        users.setUsers(newUsers).then((result) => {
            console.log("Set users", result);
        });
    }
    return (
        <div>
            <p>react version</p>
            <UserEntry message="React" handleUserListChange={handleUserListChange} />
            <p>The entry form is currently broken, but I'm sure it will be straightforward to get it working, just convert 128 lines of vanilla javascript mangle into React, right?</p>
            <input type="button" value="new team" id="new" />

            <ul id="users">
            </ul>

            <input type="text" placeholder="Joe Bloggs" id="user" />
            <input type="button" value="add" id="add" />
            <ul>
            <li><a href="/react/react.html?model=ComfortZone">Comfort Zone</a></li>
            <li><a href="/react/react.html?model=Tuckman">Tuckman</a></li>
            </ul>
        </div>
    )
}
export default Entry;