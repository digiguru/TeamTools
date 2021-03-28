import React from 'react';
import { InMemoryBrowserUsers } from '../Shared/InMemoryBrowserUsers';
import { userChange } from '../Shared/StreamSubscriber';
import { User } from '../Shared/User';
import { UserEntry } from './UserEntry';
function Entry() {
    let users = new InMemoryBrowserUsers(window);
    let handleUserListChange = (userList: Array<string>) => {

        let newUsers = userList.map((v,i) => new User(v,i.toString()))
        users.setUsers(newUsers).then((result) => {
            userChange(result);
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