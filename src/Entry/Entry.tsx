import React from 'react';
import { InMemoryBrowserUsers } from '../Shared/InMemoryBrowserUsers';
import { User } from '../Shared/User';
import { UserEntry } from './UserEntry';
function Entry() {
    let users = new InMemoryBrowserUsers(window);
    let handleUserListChange = (userList: Array<string>) => {
        console.log("EntryUSERS", userList);
        let newUsers = userList.map((v,i) => new User(v,i.toString()))
        users.setUsers(newUsers).then((result) => {
            console.log("Set users", result);
        });
    }
    return (
        <div>
            <UserEntry message="React" handleUserListChange={handleUserListChange} />
           
            <ul>
            <li><a href="/react/react.html?model=ComfortZone">Comfort Zone</a></li>
            <li><a href="/react/react.html?model=Tuckman">Tuckman</a></li>
            </ul>
        </div>
    )
}
export default Entry;