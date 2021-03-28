import React from 'react'
import { ISubscription, subscribeError } from './StreamSubscriber'

interface IProps {
}

interface IAlert extends ISubscription {
    fading: Boolean;
}
interface IState {
    alerts: Array<IAlert>;
}
export enum alertType {
    success = 'success',
    error = 'error',
    info = 'info',
    warning = 'warning'
}

export class ErrorViewer extends React.Component<IProps, IState> {
    unsub = null
    constructor(props) {
        super(props)
        this.state = { alerts: [] }
        
        
    }
    componentDidMount() {
        this.unsub = subscribeError()
        .subscribe((data) => {
            let alert:IAlert = {...data, fading: false}
            let alerts = this.state.alerts.concat(alert)
            this.setState({ alerts })
            setTimeout(() => this.removeAlert(alert), 3000);
        })
    }
    componentWillUnmount() {
        this.unsub.unsubscribe()
    }
    removeAlert(alert) {
        
        // fade out alert
        const alertWithFade = { ...alert, fading: true };
        this.setState({ alerts: this.state.alerts.map(x => x === alert ? alertWithFade : x) });

        // remove alert after faded out
        setTimeout(() => {
            this.setState({ alerts: this.state.alerts.filter(x => x !== alertWithFade) })
        }, 3000);
        
    }
    cssClasses(alert:IAlert) {
        if (!alert) return;
        const classes = ['alert', 'alert-dismissable alert-error'];
        if (alert.fading) {
            classes.push('alert-fade');
        }
        return classes.join(' ');
    }
    render() {
        const { alerts } = this.state;
        if (!alerts.length) return null;
        return (
            <div>
                {alerts.map((alert, index) =>
                    <div key={index} className={this.cssClasses(alert)}>
                        <button className="close" onClick={() => this.removeAlert(alert)}>&times;</button>
                        <span dangerouslySetInnerHTML={{__html: alert.data}}></span>
                    </div>
                )}
            </div>
        );
    }
}