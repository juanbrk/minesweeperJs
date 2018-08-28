import React from 'react';
import Tile from '../Tile/Tile';
import classes from './BoardRow.css';
import PropTypes from 'prop-types';


const boardRow = (props) => {

    // We map every element of tilesArray thats passed as prop into a new tile, tilesArray is an array of JS
    // Object ressembling tiles
    let tiles = props.tilesArray.map((tile, index) => {
        return <Tile
            //key={persona.id} SOLUCIONAR LA GENERACION DE LA KEY
            //clicked={() => this.props.clicked(indice)}
            //position={indice}
            containsMine={tile.containsMine}
            isRevealed={tile.isRevealed}
            isFlagged={tile.isFlagged}
            neighbour={tile.neighbour}
        />
    });

    //Retornar la lista de tiles
    return <div
        className={classes.boardRow}>
        {tiles}
    </div>
}

export default boardRow;

boardRow.propTypes = {
    tilesArray: PropTypes.array
}
