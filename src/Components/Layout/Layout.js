import React from 'react';
import Toolbar from '../Navigation/Toolbar';
import classes from './Layout.css';

    /*
        Wrapper component that sets how the application will be displayed
    */

const layout = (props) => (
    <React.Fragment>
        <Toolbar/>
        <main className={classes.content}>
            {props.children}
        </main>
    </React.Fragment>
    
);

export default layout;