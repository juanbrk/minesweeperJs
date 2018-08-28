import React from 'react';
import Tile from '../Tile/Tile';
import classes from './BoardRow.css';
import PropTypes from 'prop-types';


const boardRow = (props) => {

    let tiles = props.tilesArray.map((tile, index) => {
        /*
            RETORNAR UN UNICO DIV CLASSNAME=CLASSES.BOARDROW 
            HACER LA LOGICA DE LA X CANTIDAD DE TILES DENTRO DE ESE DIV
        */
        return <Tile
            //key={persona.id}
            //clicked={() => this.props.clicked(indice)}
            //position={indice}
            containsMine={tile.containsMine}
            isRevealed={tile.isRevealed}
            isFlagged={tile.isFlagged}
            neightbour={tile.neighbour}
        />
    });;

    //Retornar la lista de tiles
    return <div 
    className={classes.boardRow}>
    {tiles}
    </div>
}

export default boardRow;

boardRow.propTypes = {
    tiles: PropTypes.array
}
