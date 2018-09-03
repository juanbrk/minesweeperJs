import React from 'react';
import classes from './Toolbar.css';
import NavigationItems from '../Navigation/NavigationItems/NavigationItems';
    /*
        Basic toolbar to allow routing between pages inside application
    */

const toolbar = (props) => (
    <header className={classes.toolbar}>
        <div>Menu</div>
        <nav>
            <NavigationItems />
        </nav>
    </header>
    
);

export default toolbar;