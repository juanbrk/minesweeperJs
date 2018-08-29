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
        this.tileClickedHandler = this.tileClickedHandler.bind(this);
        this.renderBoard = this.renderBoard.bind(this);
    }
    state = {
        mineCount: this.props.mines,
        gameStatus: null,
        boardData: this.initializeBoard(this.props.height, this.props.width, this.props.mineCount)
    }


    // Method that creates a board of empty tiles, populates it with mines and gets the number of neighbouring
    // mines for every tile on the board. Returns the initialized board FROM THE STATE. 
    initializeBoard(height, width, mines) {
        const emptyTiles = this.createEmptyArray(height, width);
        const populatedTiles = this.populateBoard(emptyTiles, height, width, mines);
        return this.getNumOfMinesNeighbours(populatedTiles, height, width);
    }

    // Method that accepts a 2D array with tile objects and returns tiles displayed in rows
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

    // Method that takes in the row of the 2D data array containing mines and returns as many tiles as
    // columns there are in the row
    renderBoardRows(dataRow, rowIndex) {
        return dataRow.map((dataRowTile, colIndex) => {
            return (
            <Tile 
                key={Uuidv4()} 
                clicked={() => this.tileClickedHandler(rowIndex, colIndex)} 
                containsMine={dataRowTile.containsMine} 
                isRevealed={dataRowTile.isRevealed} 
                isFlagged={dataRowTile.isFlagged} 
                neighbour={dataRowTile.neighbour}/>
            );
        });
    }

    //Creates a 2D array with empty "tiles" objects in it. They will be loaded with info later. 
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
                    //Replaced .map() method with a forEach() below
                    neighbours.forEach(neighbouringTile => {
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

    // Method that reveals the content of every tile on the board. Called when Game over or winning. 
    revealBoardContent = () => {
        //Create a new array from the currentBoardData from state
        const updatedData = [...this.state.boardData];
        //Update every tile isRevealedProperty to true
        updatedData.forEach((datarow) => {
          datarow.forEach((dataitem) => {
            dataitem.isRevealed = true;
          });
        });
        this.setState({
          boardData: updatedData
        })
      }

    ////////////////////////////////////////////////// Handler methods
    /*
        handles tile click. Accepts 2D[x][y] indexes to reveal the tile that was clicked. This reveal will be done according to the content
        of the mine which can be a bomb, or not. If not a bomb and it is not empty, it shows the number of neighbouring tiles containing 
        mines. If not a bomb and empty, it starts a recursive function to reveal all empty neighbouring tiles and its neighbouring tiles
        containing mines
     */
    tileClickedHandler = (x, y) => {
        //Obtain the clicked object, this will allow us to update state in a immutable way later
        const clickedTile = {...this.state.boardData[x][y]};

        //Check if clicked tile has not been revealed or flagged yet, if revealed do nothing. 
        if( !clickedTile.isRevealed || !clickedTile.isFlagged ){
            //If not revealed yet, check for mines
            if(clickedTile.containsMine){
                //If contains mine, player looses, game status is updated and board content revealed
                alert("There is a mine, you explode! and loose btw");
                this.setState({
                    gameStatus: "GAME OVER"
                });
                this.revealBoardContent();
            }

        }
    }

    render() {
        const board = this.renderBoard(this.state.boardData);
        return (
            <div className={classes.board}>
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