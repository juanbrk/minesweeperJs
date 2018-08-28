import React, { PureComponent } from 'react';
import BoardRow from '../../Components/BoardRow/BoardRow';
import PropTypes from 'prop-types';
import classes from './Board.css';

/*
Container that renders a given number of rows containing each one a number of tiles as columns. It extends
PureComponent that comes with built-in checks for components that should update instead of doing it manually
It is a stateful component since it stores the value of every tile, result of game, game status, remaining mines
*/
class board extends PureComponent {
    state = {
        mineCount: this.props.mines,
        gameStatus: null,
        boardData: null
    }

    //Method that takes in a 2D array with tile objects and creates BoardRows elements
    renderBoard = (data) => {
        return data.map((dataRow, index) =>{
            //Create an array with the objects of that dataRow to pass on to BoardRow as prop 
            const arrayTiles = [...dataRow]
            return <BoardRow tilesArray={arrayTiles} />
        });
    }

    //Creates a 2D array wit empty "tiles" objects in it. They will be loaded with info later. 
    createEmptyArray(height, width) {
        let data = [];
        for (let i = 0; i < height; i++) {
            data.push([]);
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y:j,
                    containsMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: true,
                };
            }
        }
        return data;

    }

    render() {
        let tiles = this.createEmptyArray(this.props.height,this.props.width);
        let board = this.renderBoard(tiles);
        return (
            <div>
                {board}
            </div>
        );
    }
}

export default board;

board.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number

}