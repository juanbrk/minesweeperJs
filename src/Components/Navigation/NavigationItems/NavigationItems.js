import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.css';

const navigationItems = (props) => (
    <ul className={classes.navigationItems}>
        <NavigationItem
            link={"/"}
            active> Play
        </NavigationItem>
        <NavigationItem
            link={"/"}> Game Setup
        </NavigationItem>
        <NavigationItem
            link={"/"}> Board Setup
        </NavigationItem>
        <NavigationItem
            link={"/"}> Finished Games
        </NavigationItem>

    </ul>
);

export default navigationItems;