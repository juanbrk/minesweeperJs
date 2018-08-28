import React, { PureComponent } from 'react';
import BoardRow from '../../Components/BoardRow/BoardRow';
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
    state = {
        mineCount: this.props.mines,
        gameStatus: null,
        boardData: null
    }

    //Method that takes in a 2D array with tile objects and creates BoardRows elements
    renderBoard = (data) => {
        return data.map((dataRow, index) => {
            //Create an array with the objects of that dataRow to pass on to BoardRow as prop 
            const arrayTiles = [...dataRow]
            return <BoardRow
                tilesArray={arrayTiles}
                key={Uuidv4()} />
        });
    }

    //Creates a 2D array wit empty "tiles" objects in it. They will be loaded with info later. 
    createEmptyArray(height, width) {
        let emptyTilesArr = [];
        for (let i = 0; i < height; i++) {
            emptyTilesArr.push([]);
            for (let j = 0; j < width; j++) {
                let rand = Math.random();
                emptyTilesArr[i][j] = {
                    containsMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                };
            }
        }
        return emptyTilesArr;
    }

    //Populates board with as many mines as were passed as props. 
    populateBoard(tilesArr, height, width, mines) {
        let xPosition = 0, yPosition = 0, minesPlanted = 0, init = 0;

        while (minesPlanted < mines) {
            //generate random inclusive number with perfectly even distribution among widht and height
            xPosition = Math.floor(Math.random() * (height - init)) + init;
            yPosition =  Math.floor(Math.random() * (width - init)) + init;

            if (!(tilesArr[xPosition][yPosition].containsMine)) {
                tilesArr[xPosition][yPosition].containsMine = true;
                minesPlanted++;
            }
        }
        return (tilesArr);
    }

    render() {
        let emptyTiles = this.createEmptyArray(this.props.height, this.props.width);
        let populatedTiles = this.populateBoard(emptyTiles, this.props.height, this.props.width, 10);
        let board = this.renderBoard(populatedTiles);
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