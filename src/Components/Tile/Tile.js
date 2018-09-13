import React from 'react';
import classes from './Tile.css';
import PropTypes from 'prop-types';

const tile = (props) => {
    //Array que uso para asignar la clase del mosaico dinamicamente. Originalmente contiene solo .tile
    const assignedClasses = [classes.tile];

    //Asignacion dinámica de las clases
    if (props.isFlagged) {
        assignedClasses.push(classes.isFlag)
    }
    if (!props.isRevealed) {
        assignedClasses.push(classes.hidden);
    }
    if (props.containsMine) {
        assignedClasses.push(classes.containsMine)
    }

    let content = null;
    content = getContent(props, content);

    return (

        <div
            className={assignedClasses.join(' ')}
            onClick={props.clicked}
            onContextMenu={props.cMenu}
        >
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
    isEmpty: PropTypes.bool,
    cMenu: PropTypes.func,
    clicked: PropTypes.func,

}

function getContent(props, content) {
    if (props.isRevealed) {

        //if tile is revealed show its content. 

        //if this tile contains mine show it
        if (props.containsMine) {
            content = "B";
        } else {

            //if it does not contain mine, show neighbours or empty
            props.neighbour !== 0 ? content = props.neighbour : null;
        }
    } else {

        //if not yet revealed, it can be flagged
        props.isFlagged ? content = "F" : null;
    }
    return content;
}
