import React from 'react';
import B from './B.jsx';
import ReactHot from '../index.js';

let HotB = ReactHot(B);

export default HotB

if(module.hot){
    module.hot.accept('./B.jsx', () => {
        HotB.replace(require('./B.jsx'))
    });
}