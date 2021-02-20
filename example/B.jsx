import React from 'react';

export default class B extends React.Component{
    render(){
        return (
            <div>
                <div>B2</div>
                { this.props.children }
            </div>
        );
    }
}