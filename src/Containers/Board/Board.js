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
        this.revealEmpty = this.revealEmpty.bind(this);
        this.checkIfWin = this.checkIfWin.bind(this);
    }
    state = {
        mineCount: this.props.mines,
        gameStatus: "make your first move",
        boardData: this.initializeBoard(this.props.height, this.props.width, this.props.mines),
        minesArray: null,
        flagsArray: null,
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
                    neighbour={dataRowTile.neighbour}
                    cMenu={(event) => this.rightClickHandler(event, rowIndex, colIndex)} />
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

                //If no mine at x,y plant one
                tilesArr[xPosition][yPosition].containsMine = true;
                minesPlanted++;

            }
        }

        /*
            Tried to create an array that holds every mine's position to store it inside state, but I got this warning
            Can't call setState on a component that is not yet mounted. Maybe there's a lifecycle hook to call that fixes this
        */
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

    // Method that reveals the content of every tile on the board and updates the state with new boardData. Called when Game over or winning. 
    revealBoardContent = () => {

        //Create a new array from the currentBoardData from state
        const updatedData = [...this.state.boardData];

        //Update every tile isRevealedProperty  to true and flagged to false
        updatedData.forEach((datarow) => {

            datarow.forEach((dataItem) => {

                dataItem.isRevealed = true;
                dataItem.isFlagged = false;

            });

        });

        this.setState({
            boardData: updatedData
        })
    }

    // Method that uses recursion and a stack (flood fill maybe?) to reveal all empty || !containsMine and returns the updated board
    revealEmpty = (xPosition, yPosition, board) => {

        //reveal clicked and empty tile that called upon this method
        board[xPosition][yPosition].isRevealed = true;

        // Behave as if user had clicked on every surrounding tiles
        // Get all the neighbouring tiles
        let neighbours = this.traverseBoard(xPosition, yPosition, board);

        // for every surrounding tile, repeat the process
        neighbours.forEach(neighbouringTile => {
            //Once visited, it is going to be revealed, since this is a neighbour of an empty tile, it does not contain mine. 

            //Check if empty. If flagged or already revealed it, ommit it
            if (!neighbouringTile.isFlagged && !neighbouringTile.isRevealed && !neighbouringTile.containsMine) {

                //vacia o vecino
                // Check if not empty
                if (!neighbouringTile.isEmpty) {

                    //if not empty, reveal it
                    board[neighbouringTile.rowIndex][neighbouringTile.colIndex].isRevealed = true;
                } else {
                    // if empty, recursion
                    this.revealEmpty(neighbouringTile.rowIndex, neighbouringTile.colIndex, board);
                }
            }
        });

        //Update board before 
        return board;
    }

    //Iterates over the board and places each mine's position inside an array. 
    getMines(board) {
        /*
            Not the best solution. Have yet to find a solution to get where mines are planted at and updating state inside populateBoard()
            So far, when i try to do that I get a warning Can't call setState on a component that is not yet mounted.Im not still  fully 
            understanding compoment lifecycle. I dont like this permanent iteration on each play. 
        */

        let minesAt = [];

        board.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                if (board[rowIndex][colIndex].containsMine) {
                    minesAt.push([rowIndex, colIndex]);
                    console.log(`mina en ${rowIndex}, ${colIndex}`)
                }
            });
        });
        console.log(minesAt);
        return minesAt;
    }

    //Iterates over the board and places each flag inside an array. 
    getFlags(board) {
        /*
            If tiles properties implemented with enum, getMines() and getFlags() could be somehow be joined into a single method. 
        */
        let flagsAt = [];
        board.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                if (board[rowIndex][colIndex].isFlagged) {
                    flagsAt.push([rowIndex, colIndex]);
                    console.log(`Flag en ${rowIndex}, ${colIndex}`)
                }
            });
        });
        console.log(flagsAt);
        return flagsAt;
    }

    //Check game progress and returns a boolean: true if win, false if not.  
    checkIfWin() {

        //No need to create a new array, Ill just reference the one inside state
        const data = this.state.boardData;
        const minesLeft = this.state.mineCount;

        //If  flagged as many tiles as mines were initially
        if (minesLeft === 0) {

            //get mines as an array of positions
            const mineArray = this.getMines(data);

            //get flags as array of positions
            const flagArray = this.getFlags(data);

            if (JSON.stringify(mineArray) === JSON.stringify(flagArray)) {

                //if both arrays are equal, game is won
                return true;
            }

        } else {

            //if more than 0 mines are left return false
            return false;
        }
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
        const clickedTile = { ...this.state.boardData[x][y] };

        //Check if clicked tile has not been revealed or flagged yet, if revealed do nothing. 
        if (!clickedTile.isRevealed && !clickedTile.isFlagged && !(this.state.gameStatus === "YOU WON!")) {

            //If not revealed yet, check for mines
            if (clickedTile.containsMine) {

                //If contains mine, player looses, game status is updated and board content revealed
                alert("There is a mine, you explode! and lose btw");

                this.setState({
                    gameStatus: "GAME OVER"
                });

                this.revealBoardContent();

            } else {

                // Variable to update gameStatus
                let status = "Not yet loosing"

                //If is not revealed nor flagged nor contains mine... is it empty?
                if (clickedTile.isEmpty) {

                    //if empty, reveal and behave as if user clicked on every surrounding tile
                    const currentBoard = [...this.state.boardData];
                    const updatedData = [...this.revealEmpty(x, y, currentBoard)];

                    //Check for current game progress
                    if (this.checkIfWin()) {

                        //if true, user won the game. Update status 
                        status = "YOU WON!"
                    }


                    this.setState({
                        boardData: updatedData,
                        gameStatus: status
                    });

                } else {

                    // If clickedTile !empty, show neighbours, update state
                    clickedTile.isRevealed = true;

                    //Create a new array of boardData to update the position of the revealed tile
                    const updatedBoardData = [...this.state.boardData];

                    // Assign the position of the revealed tile in the new array to the updated tile
                    updatedBoardData[x][y] = { ...clickedTile };

                    //Check for current game progress
                    if (this.checkIfWin()) {

                        //if true, user won the game. Update status 
                        status = "YOU WON!"
                    }

                    // Update state with updated board
                    this.setState({
                        boardData: updatedBoardData,
                        gameStatus: status
                    });

                }
            }

        }
    }

    // handles right clicks to flag or unflag a tile. Updates the counter of remaining mines and the 
    // board state with flagged/unflagged tiles
    rightClickHandler(event, x, y) {
        event.preventDefault();  // prevents default behaviour such as right click
        const clickedTile = { ...this.state.boardData[x][y] }
         
        //Current status of the game, will help to determine if a player wins
         let status = this.state.gameStatus;
        
         //ommit if revealed and if  game is ended
        if (!clickedTile.isRevealed && !(this.state.gameStatus === "YOU WON!")) {

            let minesLeft = this.state.mineCount;

            //if not revealed it can be flagged or not
            if (clickedTile.isFlagged) {

                //if flagged, unflag it
                clickedTile.isFlagged = false;
                minesLeft++;
            } else {

                //if not flagged, flag it
                clickedTile.isFlagged = true;
                minesLeft--;
            }

            //Update the state with new tile and check game status
            const updatedData = [...this.state.boardData];
            updatedData[x][y] = { ...clickedTile };

            this.setState({
                boardData: updatedData,
                mineCount: minesLeft,
            });
        }

        // check for current game progress. Did not find a suitable solution to update state immediately so I can call checkIfWin after flagging
        // a tile. Tried a functional setState() didnt work, nor did a normal call to setState with an object. 
        // TO-DO 

    }

    render() {
        const board = this.renderBoard(this.state.boardData);
        return (
            <div className={classes.board}>
                <div className={classes.gameInfo}>
                    <h1>
                        {this.state.gameStatus}
                    </h1>
                    <span className={classes.info}>
                        Mines remaining: {this.state.mineCount}
                    </span>
                </div>
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
/* 
    TO-DOS
    Enable some way of strict typeing to enum gameStatus and tile properties (Maybe typescript)
    Once strict typeing is available, merge findTiles() and findMines() into a single method. 
    Find a way to avoid calling to findTiles() and findMines(), setting this values inside the state once the board is populated with mines and
when the user flag tiles, respectively

*/