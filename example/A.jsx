import React from 'react';
import client from '../client.js'
client.connect();
import B from './B.jsx';

export default class A extends React.Component{
    render(){
        return (
            <div>
                <div>A22</div>
                <B></B>
                { this.props.children }
            </div>
        );
    }
}

if(module.hot){
    module.hot.accept('./B.jsx', () => {
        let B = require('./B.jsx');
        console.log('okk')
    })
}