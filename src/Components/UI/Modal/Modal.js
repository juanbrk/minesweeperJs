import React, { Component } from 'react';
import classes from './Modal.css'
import Backdrop from '../Backdrop/Backdrop';


/*
    Component that will display the results of a game and give the 
    user the chance to see the game results and ask for saving its
    result
*/
class Modal extends Component {

    // avoid useless re rendering to improve performance. 
    shouldComponentUpdate(nextProps){
        return nextProps.show !== this.props.show
    }
    render() {
        return (
            <React.Fragment>
                <Backdrop
                    show={this.props.show}
                    clicked={this.props.close}
                />
                <div
                    className={classes.modal}
                    style={{
                        transform: this.props.show ? "translateY(0)" : "translateY(-100vh)",
                        opacity: this.props.show ? '1' : '0'
                    }}>
                    {this.props.children}
                </div>
            </React.Fragment>
        );
    }
}

export default Modal;