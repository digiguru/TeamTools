
import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

export interface IAlertSubscription {
    message: string;
    type: alertType;
}

export enum alertType {
    success = 'success',
    error = 'error',
    info = 'info',
    warning = 'warning'
}
// The Main Subject/Stream to be listened on.
const mainSubject = new Subject<IAlertSubscription>()
// This function is used to publish data to the Subject via next().
export const publishAlert = (message:string, type: alertType = alertType.info) => mainSubject.next({message, type})
export const subscribeAlert = () => mainSubject.asObservable()
export const subscripeError = () => 
    subscribeAlert()
    .pipe(filter(alert => alert.type === alertType.error))
