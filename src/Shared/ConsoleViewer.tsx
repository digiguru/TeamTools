import React from 'react'
import { IAlertSubscription, subscribeAlert } from './StreamSubscriber'
interface IProps {
}

interface IState {
    alerts: Array<IAlertSubscription>;
}
export enum alertType {
    success = 'success',
    error = 'error',
    info = 'info',
    warning = 'warning'
}

export class ConsoleViewer extends React.Component<IProps, IState> {
    unsub = null
    constructor(props) {
        super(props)
        this.state = { alerts: [] }
        
        this.unsub = subscribeAlert()
                     .subscribe((data) => {
                         let alert:IAlertSubscription = {...data}
                         let alerts = this.state.alerts.concat(alert)
                         this.setState({ alerts })
                     })
    }
    componentWillUnmount() {
        this.unsub.unsubscribe()
    }
    cssClasses(alert:IAlertSubscription) {
        if (!alert) return;

        const classes = ['alert'];
        const alertTypeClass = {
            [alertType.success]: 'alert-success',
            [alertType.error]: 'alert-error',
            [alertType.info]: 'alert-info',
            [alertType.warning]: 'alert-warning'
        }
        classes.push(alertTypeClass[alert.type]);
        return classes.join(' ');
    }
    render() {
        const { alerts } = this.state;
        if (!alerts.length) return null;
        return (
            <div>
            <div className="console">
                {alerts.map((alert, index) =>
                    <div key={index} className={this.cssClasses(alert)}>
                        <span dangerouslySetInnerHTML={{__html: alert.message}}></span>
                    </div>
                )}
            </div>
        );
    }
}