
import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { User } from './User'

export enum eSubject  {
    alert = "alert",
    user = "user",
}

export interface ISubscription {
    subject: eSubject | string;
    verb: verbAlert | verbUser | string;
    data: any;
}

export enum verbAlert {
    success = 'success',
    error = 'error',
    info = 'info',
    warning = 'warning'
}

export enum verbUser {
    add = 'add',
    remove = 'remove',
    change = 'change'
}
// The Main Subject/Stream to be listened on.
const mainSubject = new Subject<ISubscription>()

//PUBLISH
//alert
export const alertMessage = (message:string, verb: verbAlert = verbAlert.info) => 
    mainSubject.next({subject: eSubject.alert, verb, data: message})
export const alertError = (message:string) => alertMessage(message, verbAlert.error)
//user
export const userChange = (userList: Array<User>) =>
    mainSubject.next({subject: eSubject.user, verb: verbUser.change, data: userList});
export const userAdd = (user: string) =>
    mainSubject.next({subject: eSubject.user, verb: verbUser.add, data: user});
export const userRemove = (user: string) =>
    mainSubject.next({subject: eSubject.user, verb: verbUser.remove, data: user});

//SUBSCRIBE
export const subscribeMessage = () => mainSubject.asObservable()
export const subscripeError = () => 
    subscribeMessage()
    .pipe(filter(alert => alert.verb === verbAlert.error))
