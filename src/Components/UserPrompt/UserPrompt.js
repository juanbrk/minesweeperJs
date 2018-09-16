import React, { Component } from 'react';
import Button from '../UI/Button/Button';
import classes from '../../Components/GameSummary/GameSummary.css';
import PropTypes from 'prop-types';


const displayTexts = ["difficulty", "mineCount", "movesCount", "startTime"]

/*
    Component that will prompt the user to resume an unfinishedGame
*/
class GameSummary extends Component {
    render() {
        // Receive the JS object that was passed as props.gameData 

        
        //Obtain previous game state as an Object.entries() array. result -> [ "difficulty", "beginner" ], [ "height", 6 ]...
        const prevGameAsMap = Object.entries(this.props.gameData);

        // filter prevGameState  to display only   difficulty,  mineCOunt, movesCount && starttime 
        //filteredresults = [[key, value],[key, value]...]
        const filteredResults = displayTexts.map(text => {
            return prevGameAsMap.filter(([key, _]) => {
                return text === key;
            })
        });

        //map every result and return it as a list item to display on modal. 
        const gameSummary = filteredResults.map((itemArray) => {
            //itemArray === [[key, value]]
            let displayText = "";

            //
            return itemArray.map(([key, value]) => {

                // replace key with a different text to be displayed to the user 
                // TODO avoid doing this, modify the array directly with map or other array method
                switch (key) {
                    case "difficulty":
                        displayText = "Level";
                        break;
                    case "mineCount":
                        displayText = "Number of mines left";
                        break;
                    case "movesCount":
                        displayText = "Moves made";
                        break;
                    case "startTime":
                        displayText = "Start time";
                        break;
                    default:
                }

                return (
                    <li key={key}>
                        <b>{displayText}</b>: {value}
                    </li>
                );
            });


        });


        return (
            <React.Fragment>
                <h2 className={classes.title}>Resume game</h2>
                <div className={classes.gameStats}>
                    <p>We found an unfinished game:</p>
                    <ul>
                        {gameSummary}
                    </ul>
                </div>
                <div className={classes.cta}>
                    <React.Fragment>
                        <p className={classes.ctaTitle}>Do you wish to resume it?</p>
                        <Button
                            clicked={this.props.resume}
                            btnType={"success"}
                            className={classes.ctaButton}>Resume</Button>
                    </React.Fragment>
                    <Button
                        clicked={this.props.cancel}
                        btnType={"danger"}>Cancel</Button>
                </div>

            </React.Fragment>
        );
    }
}

export default GameSummary;

GameSummary.propTypes = {
    gameResults: PropTypes.object,
    resume: PropTypes.func,
    cancel: PropTypes.func,

}