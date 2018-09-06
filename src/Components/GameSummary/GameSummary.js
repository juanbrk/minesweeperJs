import React from 'react';
import Button from '../UI/Button/Button';

/*
    Component that will hold the summary of the played game with stats
    such as start and end time, result and final board display
*/
const gameSummary = (props) => {

    // Values that will replace props.gameResults' object keys. (Final result instead of gameStatus, and so on)
    const attachedKeys = [
        "Final result",
        "Level",
        "Board height",
        "Board width",
        "Number of mines left",
        "Start time",
        "End time",
        "Number of movements"
    ];

    // Receive the JS object that was passed as props.gameResults. If user wants to save its results this is what 
    // its going to be saved
    const receivedResults = props.gameResults;

    // for displaying inside the modal, we have to obtain the key value pairs of only non objects values
    const resultsEntries = Object.entries(props.gameResults);

    // filter boardData that is an object, to display only non objects and 
    const filteredResults = resultsEntries.filter(([_,value])=> typeof value !== "object" && typeof value !== "boolean" && typeof value !== "undefined");

    //map every result and return it as a list item todisplay on modal. 
    const gameSummary = filteredResults.map(([key,value], index)=>{
        return (
            <li key={key}>
                <b>{attachedKeys[index]}</b>: {value}
            </li>
        );
    });

    return (
        <React.Fragment>
            <h2>Game Summary</h2>
            <p>Your last game stats:</p>
            <ul>
                {gameSummary}
            </ul>
            <p>Do you wish to save these results?</p>
            <Button
                clicked={props.save}
                btnType={"success"}>Save</Button>
            <Button
                clicked={props.cancel}
                btnType={"danger"}>Cancel</Button>
        </React.Fragment>
    );
};

export default gameSummary;