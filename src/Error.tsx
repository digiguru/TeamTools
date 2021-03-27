import React from 'react';

type MyProps = {
    message: string;
};
type MyState = {
    message: string;
}
export class Error extends React.Component<MyProps, MyState> {
    render() {
        return (
            <div>
                <p>{this.props.message}</p>
            </div>
        );
    }
}
