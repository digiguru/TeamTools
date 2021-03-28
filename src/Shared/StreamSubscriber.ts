
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
export const publishMessage = (message:string, type: alertType = alertType.info) => mainSubject.next({message, type})
export const publishError = (message:string) => publishMessage(message, alertType.error)

export const subscribeMessage = () => mainSubject.asObservable()
export const subscripeError = () => 
    subscribeMessage()
    .pipe(filter(alert => alert.type === alertType.error))
