import React from 'react';
import classes from './Backdrop.css';
import PropTypes from 'prop-types';

    /*
        Component that will hover over the application when needed
    */

const backdrop = (props) => (
    // if passed a property to show it, then return the backdrop. It can be clicked to be close
    // on certain circumstances
    props.show ?  <div className={classes.backdrop} onClick={props.clicked}></div> : null
);

export default backdrop;

backdrop.propTypes = {
    show: PropTypes.bool,
    clicked: PropTypes.func
}