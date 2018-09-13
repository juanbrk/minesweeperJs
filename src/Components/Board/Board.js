import React, { PureComponent } from 'react';
import Tile from '../../Components/Tile/Tile'
import PropTypes from 'prop-types';
//uuid is an npm package that generates unique ids to use on lists. 
import Uuidv4 from 'uuid'
import classes from './Board.css';

/*
Container that renders a given number of rows containing each one a number of tiles as columns. It extends
PureComponent that comes with built-in checks for components that should update instead of doing it manually
It is a stateful component since it stores the value of every tile, result of game, game status, remaining mines
*/

class board extends PureComponent {
    constructor(props) {
        super(props);

        //Binding class methods to this
        this.renderBoard = this.renderBoard.bind(this);
    }



    /**
     * Method that accepts a 2D array with tile objects and renders as many rows as the 2D array has
     * @param {*} data 2D array containing tiles to be rendered in rows
     */
    renderBoard(data) {
        return data.map((dataRow, rowIndex) => {
            return (
                <div
                    key={Uuidv4()}
                    className={classes.boardRow}>
                    {
                        //We render the rows that will contain the tiles
                        this.renderBoardRows(dataRow, rowIndex)
                    }
                </div>
            );
        });
    }

    /**
     * Method that takes in the row of the 2D data array containing tiles and returns as many tiles as
     * columns there are in the row
     * @param {*} dataRow 
     * @param {*} rowIndex 
     */
    renderBoardRows(dataRow, rowIndex) {
        return dataRow.map((dataRowTile, colIndex) => {
            return (
                <Tile
                    key={Uuidv4()}
                    clicked={() => this.props.tileClicked(rowIndex, colIndex)}
                    containsMine={dataRowTile.containsMine}
                    isRevealed={dataRowTile.isRevealed}
                    isFlagged={dataRowTile.isFlagged}
                    neighbour={dataRowTile.neighbour}
                    cMenu={(e) => this.props.tileFlagged(e, rowIndex, colIndex)} />
            );
        });
    }
    ////////////////////////////////////////////////// handler methods

    handleStatusChange(e) {
        this.props.onStatusChange(e.target.value);
      }

    render() {
        // Render board only if data passed as prop is not null
        const board = this.props.data ? this.renderBoard(this.props.data): null  
        return (
            <div 
                className={classes.board}
                onChange={this.handleStatusChange}>
                {board}
            </div>
        );
    }
}

export default board;

board.propTypes = {
    data: PropTypes.array,
    gameStatus: PropTypes.string,
    onStatusChange: PropTypes.func,
    tileClicked: PropTypes.func,
    tileFlagged: PropTypes.func


}
