import React from 'react'
import { ISubscription, subscribeMessage } from './StreamSubscriber'
interface IProps {
}

interface IState {
    alerts: Array<ISubscription>;
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
        
        
    }
    componentWillUnmount() {
        this.unsub.unsubscribe()
    }
    componentDidMount() {
        this.unsub = subscribeMessage()
                     .subscribe((alert) => {
                         let alerts = this.state.alerts.concat(alert)
                         this.setState({ alerts })
                     })
    }

    cssClasses(alert:ISubscription) {
        if (!alert) return;

        const classes = ['alert'];
        const alertTypeClass = {
            [alertType.success]: 'alert-success',
            [alertType.error]: 'alert-error',
            [alertType.info]: 'alert-info',
            [alertType.warning]: 'alert-warning'
        }
        classes.push(alertTypeClass[alert.verb]);
        return classes.join(' ');
    }
    render() {
        const { alerts } = this.state;
        return (
            <div className="console">
                {alerts.map((alert, index) =>
                    <div key={index} className={this.cssClasses(alert)}>
                        <span dangerouslySetInnerHTML={{__html: alert.data}}></span>
                    </div>
                )}
            </div>
        );
    }
}