import React, { Component } from 'react';
import Button from '../UI/Button/Button';
import classes from './Menu.css';
import PropTypes from 'prop-types';

//Difficulties that will be rendered 
export const difficulties = {
    easy: "beginner",
    medium: "intermediate",
    hard: "advanced"
}

class Menu extends Component {
    render() {

        // Dynamically render buttons
        let buttons = Object.keys(difficulties).map(key => {
            return (
                <Button
                    btnType="segmentedControl"
                    clicked={() => this.props.difficultyChangedHandler(difficulties[key])}
                    key={key}>{key}
                </Button>
            );
        });


        //Dynamically render gameInfo only if a button has been clicked
        let gameInfo = null
        if (this.props.selectedDifficulty) {
            gameInfo = <div className={classes.gameInfo}>
                <span
                    className={classes.mineCount}> Mines remaining:{this.props.mineCount}
                </span>
                <span
                    className={classes.status}> {this.props.gameStatus}
                </span>
            </div>
        }
        return (
            <div className={classes.container}>
                <p className={classes.select}>Please select game level</p>
                <div className={classes.buttons}> {buttons}
                </div>
                {gameInfo}
            </div>
        );
    }
}

export default Menu;

Menu.propTypes = {
    mineCount: PropTypes.number,
    gameStatus: PropTypes.string,
    restartClick: PropTypes.func,
    difficultyChangedHandler: PropTypes.func,
    selectedDifficulty: PropTypes.string
}
