import React from 'react';
import Button from '../UI/Button/Button';
import classes from './Menu.css';

//Difficulties that will be rendered 
export const difficulties = {
    easy: "beginner",
    medium: "intermediate",
    hard: "advanced"
}

//<option> elements could be rendered dynamically with a .map() or Object.keys() to render as many difficulties there are specified on the
// object difficulties. For now it wont happen. 

const menu = (props) => {
    return (
        <div className={classes.container}>
            <p className={classes.select}>Please select game level</p>
            <div className={classes.buttons}>
                <Button
                    btnType="segmentedControl"
                    clicked={() => props.difficultyChangedHandler(difficulties.easy)}>Easy
                        </Button>
                <Button
                    btnType="segmentedControl"
                    clicked={() => props.difficultyChangedHandler(difficulties.medium)}>Medium
                        </Button>
                <Button
                    btnType="segmentedControl"
                    clicked={() => props.difficultyChangedHandler(difficulties.hard)}>Hard</Button>
            </div>
            <div className={classes.gameInfo}>
                <span
                    className={classes.mineCount}> Mines remaining:{props.mineCount}
                </span>
                <span
                    className={classes.status}> {props.gameStatus}
                </span>
            </div>
        </div>
    );

};

export default menu;
