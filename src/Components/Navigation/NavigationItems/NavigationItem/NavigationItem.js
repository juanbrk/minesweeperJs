import React from 'react';
import classes from './NavigationItem.css';
import { Link} from 'react-router-dom'
import PropTypes from 'prop-types';

const navigationItem = (props) => (
    <li className={classes.navigationItem}>
        <Link
            to={props.link}
            className={props.active ? classes.active : null}> {props.children}
        </Link>
    </li>

    
);

export default navigationItem;

navigationItem.propTypes = {
    link: PropTypes.string
}