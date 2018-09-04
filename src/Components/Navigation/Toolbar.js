import React from 'react';
import classes from './Toolbar.css';
import NavigationItems from '../Navigation/NavigationItems/NavigationItems';
/*
    Basic toolbar to allow routing between pages inside application
*/

const toolbar = (props) => {
    const attachedClases = [classes.mobileOnly, classes.toggleMenuButton];
    return (
        <header className={classes.toolbar}>
            <div
                onClick={props.clicked}
                className={attachedClases.join(' ')}>Menu</div>
            <nav className={classes.desktopOnly}>
                <NavigationItems />
            </nav>
        </header>
    );
}

export default toolbar;