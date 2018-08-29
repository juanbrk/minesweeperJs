import React from 'react';
import classes from './Tile.css';
import PropTypes from 'prop-types';

const tile = (props) => {
    //Array que uso para asignar la clase del mosaico dinamicamente. Originalmente contiene solo .tile
    const assignedClasses = [classes.tile];

    //Asignacion dinámica de las clases
    if (!props.isRevealed) {
        assignedClasses.push(classes.hidden);
    }
    if (props.containsMine) {
        assignedClasses.push(classes.containsMine)
    }
    if (props.isFlagged) {
        assignedClasses.push(classes.isFlag)
    }

    let content = null;
    content = getContent(props, content);


    return (

        <div
            className={assignedClasses.join(' ')}
            onClick={props.clicked}>
            {content}
        </div>
    );

}

export default tile;

//Prop enforcing with prop-types no value is required
tile.propTypes = {
    containsMine: PropTypes.bool,
    isRevealed: PropTypes.bool,
    isFlagged: PropTypes.bool,
    neighbour: PropTypes.number,
    // Is empty is needed to specify if none of the 8 neighbouring tiles contains a mine
    isEmpty: PropTypes.bool
}

function getContent(props, content) {
    //If not yet revealed
    if (props.isRevealed) {
        //if this tile contains mine show it
        if (props.containsMine) {
            content = "B";
        }
        else {
            //if it doesnt contain mine
            //check if flagged and assign content accordingly
            if (!props.isFlagged) {
                //If not flagged it can be free or have neighbouring mines
                if (props.neighbour !== 0) {
                    content = props.neighbour;
                }
            }
            else {
                //if flagged
                content = 'F';
            }
        }
    }
    return content;
}
