
import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

export enum eSubject  {
    alert = "alert",
    user = "user",
}

export interface ISubscription {
    subject: eSubject | string;
    verb: alertVerb | string;
    data: any;
}

export enum alertVerb {
    success = 'success',
    error = 'error',
    info = 'info',
    warning = 'warning'
}
// The Main Subject/Stream to be listened on.
const mainSubject = new Subject<ISubscription>()
// This function is used to publish data to the Subject via next().
export const alertMessage = (message:string, verb: alertVerb = alertVerb.info) => 
    mainSubject.next({subject: eSubject.alert, verb, data: message})
export const alertError = (message:string) => alertMessage(message, alertVerb.error)

export const subscribeMessage = () => mainSubject.asObservable()
export const subscripeError = () => 
    subscribeMessage()
    .pipe(filter(alert => alert.verb === alertVerb.error))
