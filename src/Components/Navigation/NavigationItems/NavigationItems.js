import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.css';
const navigationItems = (props) => (
    <ul className={classes.navigationItems}>
        <NavigationItem
            link={"/"}> Play
        </NavigationItem>
        <NavigationItem
            link={"/game-setup"}> Game Setup
        </NavigationItem>
        <NavigationItem
            link={"/board-setup"}> Board Setup
        </NavigationItem>
        <NavigationItem
            link={"/finished-games"}> Finished Games
        </NavigationItem>

    </ul>
);

export default navigationItems;