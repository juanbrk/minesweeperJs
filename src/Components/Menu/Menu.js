import React from 'react';
import classes from './Menu.css';

//Difficulties that will be rendered 
const difficulties = {
    easy: "beginner",
    medium: "intermediate",
    hard: "advanced"
}

//<option> elements could be rendered dynamically with a .map() or Object.keys() to render as many difficulties there are specified on the
// object difficulties. For now it wont happen. 

const menu = (props) => {
    return (
        <div className={classes.menu}>
            <button
                className={classes.restart}
                onClick={props.restartClick}
            >
                Restart
            </button>

            <span
                className={classes.mineCount}>
                Mines remaining:{props.mineCount}
            </span>
            <select  onChange={(e) => props.difficultyChangedHandler(e)} style={{ marginRight: 5 }}>
                <option value="">Please select difficulty</option>
                <option value={difficulties.easy}>Easy</option>
                <option value={difficulties.medium}>Medium</option>
                <option value={difficulties.hard} >Hard</option>
            </select>
        </div>
    );

};

export default menu;