import React from 'react';
import client from '../client.js'
import B from './B.jsx';

let instances = {};
let id = 0;
let Component = B;

export default class ReactHot extends React.Component{
    constructor(props){
        super(props);
        id += 1;
        this.id = id;
    }
    componentDidMount(){
        instances[this.id] = this;
    }
    componentWillUnmount(){
        delete instances[this.id];
    }
    render(){
        return (
            <Component { ...this.props }>
                aaa
                { this.props.children }
            </Component>
        );
    }
}

if(module.hot){
    module.hot.accept('./B.jsx', () => {
        Component = require('./B.jsx').default;
        Object.values(instances).forEach(ins => ins.forceUpdate())
    })
}

client.connect();