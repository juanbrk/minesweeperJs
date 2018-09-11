import React from 'react';
import classes from './Button.css';

/*
    Component for reusing buttons. Classes can be asigned dynamically with props
    .btnType
*/
const button = (props) => (
     <button
        className={[classes.button, classes[props.btnType]].join(' ')}
        onClick={props.clicked}
        disabled={this.props.disable ? true : false}>{props.children}
        </button>
    
);

export default button;