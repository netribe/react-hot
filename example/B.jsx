import React from 'react';

export default class B extends React.Component{
    render(){
        return (
            <div>
                <div>55555</div>
                { this.props.children }
            </div>
        );
    }
}