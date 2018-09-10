import React, { Component } from 'react';
import Button from '../UI/Button/Button';
import classes from './GameSummary.css';

/*
    Component that will hold the summary of the played game with stats
    such as start and end time, result and final board display
*/
class GameSummary extends Component {
    render() {
        // get the length of the object passed as prop to determine wether attachedKeys should
        // hold 6 || 8 strings
        var size = Object.keys(this.props.gameResults).length;


        // Values that will replace props.gameResults' object keys. (Final result instead of gameStatus, and so on)
        // this.props.gameResults can contain both 6 || 8 properties 
        const attachedKeys = size === 6 ? [
            "End time",
            "Level",
            "Number of mines left",
            "Number of movements",
            "Start time",
            "Final result",
        ] : [
                "End time",
                "Board height",
                "Level",
                "Number of mines left",
                "Number of movements",
                "Start time",
                "Final result",
                "Board width",
            ];

        // Receive the JS object that was passed as props.gameResults. 

        // for displaying inside the modal, we have to obtain the key value pairs of only non objects values
        const resultsEntries = Object.entries(this.props.gameResults);

        // filter boardData that is an object, to display only non objects and 
        const filteredResults = resultsEntries.filter(([_, value]) => typeof value !== "object" && typeof value !== "boolean" && typeof value !== "undefined");

        //map every result and return it as a list item todisplay on modal. 
        const gameSummary = filteredResults.map(([key, value], index) => {
            return (
                <li key={key}>
                    <b>{attachedKeys[index]}</b>: {value}
                </li>
            );
        });

        // Dynamically show buttons &&/|| CTA text if props tell to do so
        const saveButton = this.props.showSave ? <React.Fragment>
            <p className={classes.ctaTitle}>Do you wish to save these results?</p>
            <Button
                clicked={this.props.save}
                btnType={"success"}
                className={classes.ctaButton}>Save</Button>
        </React.Fragment> : null;

        const cancelButton = this.props.showCancel ? <Button
            clicked={this.props.cancel}
            btnType={"danger"}>Cancel</Button> : null;

        const continueButton = this.props.showContinue ? <Button
            clicked={this.props.continue}
            btnType={"success"}>Continue</Button> : null;


        return (
            <React.Fragment>
                <h2 className={classes.title}>Game Summary</h2>
                <div className={classes.gameStats}>
                    <p>{this.props.title}</p>
                    <ul>
                        {gameSummary}
                    </ul>
                </div>
                <div className={classes.cta}>
                    {saveButton}
                    {cancelButton}
                    {continueButton}
                </div>

            </React.Fragment>
        );
    }
}

export default GameSummary;