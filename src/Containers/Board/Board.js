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
                    clicked={() => this.props.tileClicked(rowIndex, colIndex)}
                    containsMine={dataRowTile.containsMine}
                    isRevealed={dataRowTile.isRevealed}
                    isFlagged={dataRowTile.isFlagged}
                    neighbour={dataRowTile.neighbour}
                    cMenu={(event) => this.rightClickHandler(event, rowIndex, colIndex)} />
            );
        });
    }
    ////////////////////////////////////////////////// handler methods
    

    // handles right clicks to flag or unflag a tile. Updates the counter of remaining mines and the 
    // board state with flagged/unflagged tiles
    rightClickHandler(event, x, y) {
        event.preventDefault();  // prevents default behaviour such as right click
        const clickedTile = { ...this.state.boardData[x][y] }

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

            // Update state with new information 

            if (minesLeft === 0) {

                //If user flagged possible last tile containing a mine, check if won with a setState callback to checkIfWin()
                this.setState(
                    {
                        boardData: updatedData,
                        mineCount: minesLeft,
                    },
                    () => {
                        this.checkIfWin(this.state.mineCount)
                    });
            } else {

                //If remaining mines !== 0 update only boardData and minesLeft counter
                this.setState({
                    boardData: updatedData,
                    mineCount: minesLeft
                })
            }

        }


    }

    // method that handles change in board prop passed from <Game>. This is a result of lifting state upt from <Board> to <Game>
    // DONT THINK I ACTUALLY NEED THIS
    handleChange(e){
        this.props.onBoardChange(e.target.value);
    }

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
    height: PropTypes.number,
    width: PropTypes.number,
    mines: PropTypes.number

}
/* 
    TO-DOS
    Enable some way of strict typeing to enum gameStatus and tile properties (Maybe typescript)
    Once strict typeing is available, merge findTiles() and findMines() into a single method. 
    Find a way to avoid calling to findTiles() and findMines(), setting this values inside the state once the board is populated with mines and
when the user flag tiles, respectively

*/