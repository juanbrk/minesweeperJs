import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';


    /*
        Component that will work as menu displayer for mobile devices, showing when menu button is clicked
        on toolbar. Methods to open and close it will be passed via props. 
    */

const sideDrawer = (props) => {
    //Classes that will be attached dynamically to show or hide the SideDrawer. 
    let attachedClasses = [classes.sideDrawer, classes.close];
    if (props.open){
        attachedClasses = [classes.sideDrawer, classes.open];
    }

    return (
        <React.Fragment>
            <Backdrop 
                show={props.open} 
                clicked={props.close} />
            <div className={attachedClasses.join(' ')}>
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        </React.Fragment>

    );
};

export default sideDrawer;