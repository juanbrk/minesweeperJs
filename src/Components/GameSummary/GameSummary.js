import React, { Component } from 'react';
import Button from '../UI/Button/Button';
import classes from './GameSummary.css';
import PropTypes from 'prop-types';

/*
    Component that will hold the summary of the played game with stats
    such as start and end time, result and final board display
*/
class GameSummary extends Component {
    render() {

        // Values that will replace props.gameResults' object keys. (Final result instead of gameStatus, and so on)
        // this.props.gameResults can contain both 6 || 8 properties 
        const attachedKeys = {
            ended:"End time",
            level:"Level",
            minesLeft:"Number of mines left",
            moves:"Number of movements",
            started:"Start time",
            status: "Final result",
        };

        // Receive the JS object that was passed as props.gameResults. 


        // for displaying inside the modal, we have to obtain the key value pairs of only non objects values
        const resultsEntries = Object.entries(this.props.gameResults);

        //map every result and return it as a list item todisplay on modal. 
        const gameSummary = resultsEntries.map(([key, value], index) => {
            return (
                <li key={key}>
                    <b>{attachedKeys[key]}</b>: {value}
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

        //Asign title dynamically
        let title = "Game summary";
        if (this.props.modalTitle) {
            title = this.props.modalTitle

        }


        return (
            <React.Fragment>
                <h2 className={classes.title}>{title}</h2>
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

GameSummary.propTypes = {
    gameResults: PropTypes.object,
    save: PropTypes.func,
    cancel: PropTypes.func,
    title: PropTypes.string,
    showSave: PropTypes.bool,
    showCancel: PropTypes.bool,
    showContinue: PropTypes.bool

}