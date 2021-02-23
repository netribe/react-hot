import React from 'react';



const ReactHot = (Component) => {
    let instanceId = 0;
    let instances = {};
    class ReactHot extends React.Component{
        constructor(props){
            super(props);
            instanceId += 1;
            this.instanceId = instanceId;
        }
        static replace(_Component){
            Component = ((typeof(_Component) === 'object') && _Component.default) ? _Component.default : _Component;
            Object.values(instances).forEach(ins => ins.forceUpdate())
        };
        componentDidMount(){
            instances[this.instanceId] = this;
        }
        componentWillUnmount(){
            delete instances[this.instanceId];
        }
        render(){
            return (
                <Component { ...this.props }>
                    { this.props.children }
                </Component>
            );
        }
    }
    return ReactHot;
};

export default ReactHot;

