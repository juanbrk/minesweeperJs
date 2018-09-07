import React from 'react';
import classes from './Spinner.css';

/*
    Component that returns a spinner to display when connecting with the web
*/

const spinner = (props) => (
    <div className={classes.loader}>Loading...</div>
);

export default spinner;