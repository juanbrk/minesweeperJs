import React from 'react';
import classes from './Modal.css'


/*
    Component that will display the results of a game and give the 
    user the chance to see the game results and ask for saving its
    result
*/
const modal = (props) => (
     <div className={classes.modal}>
         {props.children}
     </div>
);

export default modal;