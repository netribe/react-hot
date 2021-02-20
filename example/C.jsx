import React from 'react';

export default class C extends React.Component{
    render(){
        return (
            <div>
                <div>C</div>
                { this.props.children }
            </div>
        );
    }
}