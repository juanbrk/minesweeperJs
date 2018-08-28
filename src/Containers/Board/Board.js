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
        boardData: this.initializeBoard(this.props.height, this.props.width, this.props.mineCount)
    }
    

    // Method that creates a board of empty tiles, populates it with mines and gets the number of neighbouring
    // mines for every tile on the board. Returns the initialized board FROM THE STATE. 
    initializeBoard(height, width, mines){
        const emptyTiles = this.createEmptyArray(height, width);
        const populatedTiles = this.populateBoard(emptyTiles, height, width, mines);
        const neighbourTiles = this.getNumOfMinesNeighbours(populatedTiles,height, width);
        return this.renderBoard(neighbourTiles);
       
    }

    //Method that takes in a 2D array with tile objects and creates BoardRows elements
    renderBoard(data){
        return data.map((dataRow, index) => {
            //Create an array with the objects of that dataRow to pass on to BoardRow as prop 
            const arrayTiles = [...dataRow]
            return <BoardRow
                tilesArray={arrayTiles}
                key={Uuidv4()}
                //tileClick = {} 
                />
        });
    }

    //Creates a 2D array wit empty "tiles" objects in it. They will be loaded with info later. 
    createEmptyArray(height, width) {
        let emptyTilesArr = [];
        for (let i = 0; i < height; i++) {
            emptyTilesArr.push([]);
            for (let j = 0; j < width; j++) {
                emptyTilesArr[i][j] = {
                    containsMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                    rowIndex: i,
                    colIndex: j
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
            yPosition = Math.floor(Math.random() * (width - init)) + init;

            if (!(tilesArr[xPosition][yPosition].containsMine)) {
                tilesArr[xPosition][yPosition].containsMine = true;
                minesPlanted++;
            }
        }
        return (tilesArr);
    }

    // Method that gets the amount of mines that a tile's neighbours have and returns a new (updated) array
    // with information on every tile and its neighbouring tiles.  
    getNumOfMinesNeighbours(data, height, width) {
        
        //Create a new copy of the original array to avoid reference issues
        let updatedData = [...data];
        
        //We get the neighbours of the tile and then check how many of them have mines
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (!data[i][j].containsMine) {
                    let mine = 0;
                    const neighbours = this.traverseBoard(data[i][j].rowIndex, data[i][j].colIndex, data);
                    neighbours.map(neighbouringTile => {
                        if (neighbouringTile.containsMine) {
                            mine++;
                        }
                    });
                    if (mine === 0) {
                        updatedData[i][j].isEmpty = true;
                    }
                    updatedData[i][j].neighbour = mine;
                }
            }
        }
        return (updatedData);
    }

    // looks for neighbouring tiles taking into account index restrictions and returns them as an array of tiles
    traverseBoard(row, col, data) {
        const el = [];
        //up
        if (row > 0) {
            el.push(data[row - 1][col]);
        }
        //down
        if (row < this.props.height - 1) {
            el.push(data[row + 1][col]);
        }
        //left
        if (col > 0) {
            el.push(data[row][col - 1]);
        }
        //right
        if (col < this.props.width - 1) {
            el.push(data[row][col + 1]);
        }
        // top left
        if (row > 0 && col > 0) {
            el.push(data[row - 1][col - 1]);
        }
        // top right
        if (row > 0 && col < this.props.width - 1) {
            el.push(data[row - 1][col + 1]);
        }
        // bottom right
        if (row < this.props.height - 1 && col < this.props.width - 1) {
            el.push(data[row + 1][col + 1]);
        }
        // bottom left
        if (row < this.props.height - 1 && col > 0) {
            el.push(data[row + 1][col - 1]);
        }
        return el;
    }

    render() {  
        return (
            <div>
                {this.state.boardData}
            </div>
        );
    }
}

export default board;

board.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number

}