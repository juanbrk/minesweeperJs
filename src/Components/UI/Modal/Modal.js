import React from 'react';
import classes from './Modal.css'
import Backdrop from '../Backdrop/Backdrop';


/*
    Component that will display the results of a game and give the 
    user the chance to see the game results and ask for saving its
    result
*/
const modal = (props) => (
    <React.Fragment>
        <Backdrop 
            show={props.show}
            clicked={props.close}
        />
        <div
            className={classes.modal}
            style={{
                transform: props.show ? "translateY(0)" : "translateY(-100vh)",
                opacity: props.show ? '1' : '0'
            }}>
            {props.children}
        </div>
    </React.Fragment>

);

export default modal;