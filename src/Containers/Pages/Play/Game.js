import React, { PureComponent } from 'react';
import Board from '../../../Components/Board/Board';
import classes from './Game.css';
import Menu from '../../../Components/Menu/Menu';
import Modal from '../../../Components/UI/Modal/Modal';
import GameSummary from '../../../Components/GameSummary/GameSummary';
import axios from 'axios';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import moment from 'moment';
import withResumeGame from '../../HOC/withResumeGame/withResumeGame'

import { connect } from 'react-redux';
import { actions as actionType } from '../../../store/actions';
import { gameStatus } from './gameStatus';

class game extends PureComponent {
    constructor(props) {
        super(props);

        //Check which of this binding methods is actually necessary
        this.initializeBoard = this.initializeBoard.bind(this);
        this.populateBoardWithMines = this.populateBoardWithMines.bind(this);
        this.changeDifficulty = this.changeDifficulty.bind(this);
        this.tileClickedHandler = this.tileClickedHandler.bind(this);
        this.rightClickHandler = this.rightClickHandler.bind(this);
        this.handleModalClosed = this.handleModalClosed.bind(this);

    }

    state = {
        height: null,
        //Will be selected from the dropDown menu
        width: null,
        finished: false,
        loading: false,
    }


    //////////////////////////////////////////////////////////////////////////////////////////// Lifecycle hooks
    componentDidUpdate() {
        if (this.props.post) {
            // if an action that was dispatched needs to post to server when updating, this.props.post will be true

            //if an action that was dispatched makes the component check if the game is won when updating, this.props.check will be true
            (this.props.check) ? this.checkIfWin() : null;

            //post history to server
            return this.postHistoryToServer();

        }

    }

    //////////////////////////////////////////////////////////////////////////////////////////// class methods

    // Method that creates a board depending on the difficulty selected by the user. Will be passed down to Board as a prop.
    // mineCount, height and width will be set inside this method. If not difficulty has been chosen yet, it will return null
    initializeBoard(dif, m) {

        //Board will be rendered if difficulty has been selected, if not, it wont 
        if (dif !== null) {
            let height = this.state.height;
            let width = this.state.width;
            let mines = m;

            //Render board 
            const emptyTiles = this.createEmptyArray(height, width);
            const populatedBoardWithMines = this.populateBoardWithMines(emptyTiles, height, width, mines);
            const populatedBoardWithNeighbours = this.populateTilesWithNeighbours(populatedBoardWithMines, height, width);

            this.props.onBoardInitialized(populatedBoardWithNeighbours)

        } else {
            //If this.state.difficulty === null
            return null;
        }
    }


    /**
    * Creates a 2D array with empty "tiles" objects in it. Every tile will have its .isEmpty property set to true They
    *  will be loaded with info later. 
    * @param height number of rows the returned array will have
    * @param width number of columns the returned array will have
    * @returns an empty[height][width] array  
    */
    //
    createEmptyArray(height, width) {
        let emptyTilesArr = [];
        for (let i = 0; i < height; i++) {
            emptyTilesArr.push([]);
            for (let j = 0; j < width; j++) {
                emptyTilesArr[i][j] = {
                    containsMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: true,
                    isFlagged: false,
                    rowIndex: i,
                    colIndex: j
                };
            }
        }
        return emptyTilesArr;
    }


    /**
    * Populates board with mines. Every tile that will hold a mine will have its .containsMine set to true
    * and its .isEmpty property set to false
    * @param tilesArr empty 2D array
    * @param height #of rows the returned array will store
    * @param width # of columns the returned array will store
    * @param mines # of mines to be planted on the returned array
    * @returns tilesArr populated with as many mines as were passed in mines   
    */
    populateBoardWithMines(tilesArr, height, width, mines) {
        let xPosition = 0, yPosition = 0, minesPlanted = 0, init = 0;

        while (minesPlanted < mines) {
            //generate random inclusive number with perfectly even distribution among widht and height
            xPosition = Math.floor(Math.random() * (height - init)) + init;
            yPosition = Math.floor(Math.random() * (width - init)) + init;

            if (!(tilesArr[xPosition][yPosition].containsMine)) {

                //If no mine at x,y plant one
                tilesArr[xPosition][yPosition].containsMine = true;
                tilesArr[xPosition][yPosition].isEmpty = false;
                minesPlanted++;

            }
        }

        /*
            Tried to create an array that holds every mine's position to store it inside state, but I got this warning
            Can't call setState on a component that is not yet mounted. Maybe there's a lifecycle hook to call that fixes this
        */
        return (tilesArr);
    }


    /**
     * gets the amount of mines that a tile's neighbours store and returns a new  array with information on every
     * tile and its neighbouring tiles. Every mine with neighbouring mines will have its .neighbour property !=== 0 
     * and its .isEmpty property set to false
     * @param data array that will be populated with every tile's neighbours information
     * @param height #of rows the returned array will store
     * @param width # of columns the returned array will store
     * @returns an array where every tile stores the # of mines that its neighbouring tiles contain
     */
    populateTilesWithNeighbours(data, height, width) {

        //Create a new copy of the original array to avoid reference issues
        let updatedData = [...data];

        //We get the neighbours of the tile and then check how many of them have mines
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                //Had to check for !data[i][j] === undefined because it was throwing neighbouringTile is Undefined error even though when 
                // debugging everything seems fine and every neighbouringTile has data in it. 
                if (!updatedData[i][j].containsMine) {
                    let mine = 0;
                    const neighbours = this.traverseBoard(updatedData[i][j].rowIndex, updatedData[i][j].colIndex, updatedData);
                    //Replaced .map() method with a forEach() below
                    neighbours.forEach(neighbouringTile => {
                        if (neighbouringTile.containsMine) {
                            mine++;
                        }
                    });
                    // If no neighbour has mines, then continues being empty. If some neighbour contains mine, thats the number that this tile will store
                    if (mine !== 0) {
                        updatedData[i][j].neighbour = mine;
                        updatedData[i][j].isEmpty = false;

                    }
                }
            }
        }
        return (updatedData);
    }

    /**
     * looks for neighbouring tiles taking into account index restrictions and returns them as an array of tiles
     * @param row x position of the tile in the 2D data array for which we want to find its neighbours
     * @param col y position of the tile in the 2D data array for which we want to find its neighbours 
     * @param data 2D array with every tile on the board where we want to find surrounding mines for tile in position [row][data] 
     * @returns an array of tiles that surround the tile in the position data[row][col]
     */
    // 
    traverseBoard(row, col, data) {
        const el = [];
        //up
        if (row > 0) {
            el.push(data[row - 1][col]);
        }
        //down
        if (row < this.state.height - 1) {
            el.push(data[row + 1][col]);
        }
        //left
        if (col > 0) {
            el.push(data[row][col - 1]);
        }
        //right
        if (col < this.state.width - 1) {
            el.push(data[row][col + 1]);
        }
        // top left
        if (row > 0 && col > 0) {
            el.push(data[row - 1][col - 1]);
        }
        // top right
        if (row > 0 && col < this.state.width - 1) {
            el.push(data[row - 1][col + 1]);
        }
        // bottom right
        if (row < this.state.height - 1 && col < this.state.width - 1) {
            el.push(data[row + 1][col + 1]);
        }
        // bottom left
        if (row < this.state.height - 1 && col > 0) {
            el.push(data[row + 1][col - 1]);
        }
        return el;
    }

    /**
     * Iterates over the board and places each mine's position inside an array.
     * @param board 2D array where the mines are to be found
     * @returns a 2D array  containing the positions of every mine in the board array
     */
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
                }
            });
        });
        return minesAt;
    }

    /**
     * Iterates over the board and places each flag inside an array. 
     * @param board 2D array where the flags are to be found
     * @returns a 2D array  containing the positions of every flag in the board array
     */
    getFlags(board) {
        /*
            If tiles properties implemented with enum, getMines() and getFlags() could be somehow be joined into a single method. 
        */
        let flagsAt = [];
        board.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                if (board[rowIndex][colIndex].isFlagged) {
                    flagsAt.push([rowIndex, colIndex]);
                }
            });
        });
        return flagsAt;
    }

    /**
     * Check game progress to validate if game is ended and player won
     * 
     */
    checkIfWin() {

        //No need to create a new array, Ill just reference the one inside state
        const data = this.props.board;

        //get mines as an array of positions
        const mineArray = this.getMines(data);

        //get flags as array of positions
        const flagArray = this.getFlags(data);

        if (JSON.stringify(mineArray) === JSON.stringify(flagArray)) {

            //MM-DD-YYYY hh:mm 12hr 
            const dateTime = moment(new Date()).format("MM-DD-YYYY h:mm:ss a");
            //if both arrays are equal, game is won. Update state to show modal and dispatch actions to update store
            this.setState({ finished: true });

            //dispatch actions to update store
            this.props.onGameWon(dateTime);
        }
    }



    // 
    /**
     * reveals the content of every tile on the board and updates the state with the revealed board. Called when
     *  Game over or ended because of a win.
     * @returns a 2D array with every with its. isRevealed property set to true 
     */
    revealBoardContent = () => {

        //Create a new array from the currentBoardData from state
        const updatedData = [...this.props.board];

        //Update every tile isRevealedProperty  to true and flagged to false
        updatedData.forEach((datarow) => {

            datarow.forEach((dataItem) => {

                dataItem.isRevealed = true;
                dataItem.isFlagged = false;

            });

        });
        this.props.onUpdateBoard(updatedData);
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

            //Check if empty. If flagged or already revealed, ommit it
            if (!neighbouringTile.isFlagged && !neighbouringTile.isRevealed && !neighbouringTile.containsMine) {

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
        return board;
    }


    /**
     * Method that will update state.difficulty to the  selected Difficulty from the user and using a setState callback, initialize the
     * board. Also if theres a pending game, erase it from server. 
     * @param dif user selected difficulty
     */
    changeDifficulty(dif) {

        let difficultySelected = dif;
        let heightForDifficulty = null;
        let widthForDifficulty = null;
        let minesForDifficulty = null;

        // Set the width,height and mine count of the board depending on the difficulty selected. 
        switch (difficultySelected) {
            //Hardcoded for the moment, will be different in the future
            case "beginner":
                heightForDifficulty = 6;
                widthForDifficulty = 6;
                minesForDifficulty = 5;
                break;
            case "intermediate":
                heightForDifficulty = 8;
                widthForDifficulty = 8;
                minesForDifficulty = 16;
                break;
            case "advanced":
                heightForDifficulty = 10;
                widthForDifficulty = 10;
                minesForDifficulty = 56;
                break;
            default:
                break;
        }

        //TODO handle this.initializeBoard() inside componentDidUpdate
        // setState callback to initialize state properties and dispatch the board to store via callback
        this.setState(
            {
                height: heightForDifficulty,
                width: widthForDifficulty,
            }, () => {
                this.initializeBoard(difficultySelected, minesForDifficulty);
            });

        //Dispatch actions to update store with level
        this.props.onDifficultySelected(difficultySelected, heightForDifficulty, widthForDifficulty, minesForDifficulty);

        this.eraseHistoryFromServer();

    }




    //////////////////////////////////////////////////////////////////                HANDLERS

    /**
     *handles tile click. Accepts 2D[x][y] indexes to reveal the tile that was clicked. This reveal will be done depending on the content
     *of the mine which can be a bomb, or not. If not a bomb and it is not empty, it shows the number of neighbouring tiles containing 
     *mines. If not a bomb and empty, it starts a recursive function to reveal all empty neighbouring tiles and its neighbouring tiles
     *containing mines
     * @param x row of the clicked tile inside 2D array that is the board
     * @param y column where the clicked tile is located at inside 2D array that is the board
     */
    tileClickedHandler = (x, y) => {
        //Obtain the clicked object, this will allow us to update state in a immutable way later
        const clickedTile = { ...this.props.board[x][y] };

        //Check if clicked tile has not been revealed or flagged yet, if revealed do nothing. 
        if (!clickedTile.isRevealed && !clickedTile.isFlagged && !(this.props.status === gameStatus.won)) {

            //If not revealed yet, check for mines
            if (clickedTile.containsMine) {

                //If contains mine, player looses, game status is updated and board content revealed
                alert("There is a mine, you explode! and lose btw");

                // end the game and dispatch actions to update store
                this.finishGameAndDispatchActions();
                //reveal every tile
                this.revealBoardContent();

            } else {
                //if clicked mine !containsmine

                //If is not revealed nor flagged nor contains mine... is it empty?
                if (clickedTile.isEmpty) {

                    //if empty, reveal and behave as if user clicked on every surrounding tile
                    const currentBoard = [...this.props.board];
                    const updatedData = [...this.revealEmpty(x, y, currentBoard)];
                    // reveal tile and dispatch actions to update store
                    this.revealTileAndDispatchActions(updatedData);

                } else {

                    // If clickedTile !empty, show neighbours, update state
                    clickedTile.isRevealed = true;

                    //Create a new array of boardData to update the position of the revealed tile
                    const updatedBoardData = [...this.props.board];

                    // Assign the position of the revealed tile in the new array to the updated tile
                    updatedBoardData[x][y] = { ...clickedTile };
                    // reveal tile and dispatch actions to update store
                    this.revealTileAndDispatchActions(updatedBoardData);
                }
            }

        }
    }

    /**
     * handles right clicks to flag or unflag a tile. Updates the counter of remaining mines and the 
     * board state with flagged/unflagged tiles
     * @param {*} event event that triggered this method call
     * @param {*} x row where the clicked tile is located at inside the 2D board aray
     * @param {*} y column where the clicked tile is located at inside the 2D board aray
     */
    rightClickHandler(event, x, y) {
        event.preventDefault();  // prevents default behaviour such as right click
        const clickedTile = { ...this.props.board[x][y] }


        //ommit if revealed and if  game is ended
        if (!clickedTile.isRevealed && !(this.props.status === gameStatus.won)) {

            let minesLeft = this.props.mines;

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
            const updatedData = [...this.props.board];
            updatedData[x][y] = { ...clickedTile };

            // Update store with new information 
            this.flagTileAndDispatchActions(updatedData, minesLeft);
        }
    }

    /**
     * Handles click for closing displayed modal. when closed, also erase history from   server
     */
    handleModalClosed() {

        //Update state
        this.setState({
            finished: false,
        });

        // erase finishedGames from server
        this.eraseHistoryFromServer();

    }

    ///////////////////////////////////////////////////////////////////// server handling

    /**
     * Handles POST connections with the server and shows/hides the spinner. 
     */
    saveGameHandler = () => {

        //show spinner
        this.setState({ loading: true });

        const game = {
            level:this.props.level,
            moves:  this.props.moves,
            minesLeft: this.props.mines,
            started: this.props.start,
            ended: this.props.end,
            status: this.props.status,
        }

        /**
         * const currentGame = {
            height: this.props.height,
            width: this.props.width,
            difficulty: this.props.level,
            mineCount: this.props.mines,
            movesCount: this.props.moves,
            startTime: this.props.start,
            boardData: this.props.board,
            status: gameStatus.inProgress
        }
         */

        axios.post("/games.json", game)
            .then(response => {
                //hide spinner and Modal
                this.setState({
                    loading: false,
                    finished: false
                });

                alert("Game saved");
            })
            .catch(error => {
                //hide spinner
                this.setState({ loading: false, finished: false });

                alert("Something went wrong, but you can still keep playing")
            });

        //erase history from firebase
        this.eraseHistoryFromServer();
    }



    /**
     * Posts history to server on the unfinishedGames node to keep track of every movement the user
     * does. So in case the page reloads, progress from the lost game can be recovered
     * 
     */
    postHistoryToServer() {

        const currentGame = {
            height: this.props.height,
            width: this.props.width,
            difficulty: this.props.level,
            mineCount: this.props.mines,
            movesCount: this.props.moves,
            startTime: this.props.start,
            boardData: this.props.board,
            status: gameStatus.inProgress

        }
        axios.post("/unfinishedgames.json", currentGame)
            .then(response => {
            })
            .catch(error => {
                alert("Something went wrong inside the code, you can keep playing though");
            });

        /**
         * state = {
    
}
         */
    }

    // TO-DO import this method from withResumeGame or smth to respect DRY
    eraseHistoryFromServer() {
        axios.delete("/unfinishedgames.json")
            .catch(error => {
                alert("Something went wrong, but you can still keep playing");
            });
    }

    ///////////////////////////////////////////////////////////////////// DISPATCHING ACTIONS
    /**
     * Reveals clicked tiles that does not contain mines and dispatch actions to update store. 
     * @param {number[][]} updatedData board data after the revealed tile/s that will update the current board in store 
     */
    revealTileAndDispatchActions(updatedData) {

        //Check if this is the first click, to start clocking gameDuration 
        if (this.props.moves === 0) {

            //MM-DD-YYYY hh:mm 12hr 
            const dateTime = moment(new Date()).format("MM-DD-YYYY h:mm:ss a");

            // dispatch actions to update store
            this.props.onRevealFirstTile(updatedData, dateTime);

        } else {
            //if not the first click just update state with status, movesCount, gameStatus and history

            // dispatch actions to update store
            this.props.onRevealTile(updatedData)

        }

    }

    /**
     * update store after a player loses. Updates state to showModal. 
     */
    finishGameAndDispatchActions() {

        //MM-DD-YYYY hh:mm 12hr 
        const dateTime = moment(new Date()).format("MM-DD-YYYY h:mm:ss a");

        //Check if player looses on first move, if so set endtime === startTime
        if (this.props.moves === 0) {

            //dispatch actions to update store
            this.props.onLosingOnFirstMove(dateTime);

        } else {

            //if movesCount > 0 startTime != endTime

            // update state to showModal
            this.props.onFinishGame(dateTime);
        }

        // update state to showModal
        this.setState({ finished: true })
    }

    flagTileAndDispatchActions(updatedData, minesLeft) {

        if (minesLeft === 0) {
            // If user flagged possible last tile containing a mine, check if won with an action that will update store 
            // and will trigger a call to checkIfWin() on componentDidUpdate in conjunction with postHistoryToServer(). 

            this.props.onFlaggedTileCheckIfWin(updatedData, minesLeft);

        } else {

            //If remaining mines !== 0 update only boardData, minesLeft, movesCount and history

            //If it is first move, set startTime
            if (this.props.moves === 0) {

                const dateTime = moment(new Date()).format("MM-DD-YYYY h:mm:ss a");
                // onFlagOnFirstMove: (data, mines, dateTime)
                // flag tile and dispatch actions to update store
                this.props.onFlagOnFirstMove(updatedData, minesLeft, dateTime)

            } else {

                // If not first move, update state without setting startTime
                // onFlagTile: (data, mines)
                this.props.onFlagTile(updatedData, minesLeft);

            }
        }


    }

    //////////////////////////////////////////////////////////////////// render

    render() {

        let gameResults = this.state.finished ? {
            level: this.props.level,
            moves: this.props.moves,
            minesLeft: this.props.mines,
            started: this.props.start,
            ended: this.props.end,
            status: this.props.status,
        } : null;

        // Determine to whether show <GameSummary>  or <Spinner> depending if there's a  connection with the server going on
            let gameSummary = gameResults ? <GameSummary
            gameResults={gameResults}
            save={this.saveGameHandler}
            cancel={this.handleModalClosed}
            title={"Your last game stats:"}
            modalTitle={this.props.status}
            showSave showCancel /> : null;

        if (this.state.loading) {
            gameSummary = <Spinner />;
        }

        return (
            <div className="container">
                <div>
                    <Menu
                        mineCount={this.props.mines}
                        gameStatus={this.props.status}
                        difficultyChangedHandler={(e) => this.changeDifficulty(e)}
                        selectedDifficulty={this.props.level} />
                </div>
                <Modal
                    show={this.state.finished}
                    close={this.handleModalClosed}>
                    {gameSummary}
                </Modal>
                <div className={classes.board}>
                    <Board
                        data={this.props.board}
                        tileClicked={this.tileClickedHandler}
                        tileFlagged={this.rightClickHandler}
                    />
                </div>

            </div>
        );

    }

};

const mapStateToProps = (state) => {
    return {
        board: state.boardData,
        moves: state.movesCount,
        status: state.gameStatus,
        mines: state.mineCount,
        level: state.difficulty,
        height: state.height,
        width: state.width,
        start: state.startTime,
        end: state.endTime,
        post: state.postToServer,
        check: state.checkIfWin
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onDifficultySelected: (dif, h, w, m, b) => dispatch({ type: actionType.setLevel, difficulty: dif, height: h, width: w, mineCount: m }),
        onBoardInitialized: (data) => dispatch({ type: actionType.setBoard, board: data }),
        onLosingOnFirstMove: (dateTime) => dispatch({ type: actionType.endOnFirstMove, time: dateTime }),
        onFinishGame: (timeEnded) => dispatch({ type: actionType.finishGame, time: timeEnded }),
        onRevealFirstTile: (data, dateTime) => dispatch({ type: actionType.revealFirstTile, board: data, time: dateTime }),
        onRevealTile: (data) => dispatch({ type: actionType.revealTile, board: data }),
        onFlaggedTileCheckIfWin: (data, mines) => dispatch({ type: actionType.checkIfWin, board: data, mineCount: mines }),
        onFlagOnFirstMove: (data, mines, dateTime) => dispatch({ type: actionType.flagFirstMove, board: data, mineCount: mines, time: dateTime }),
        onFlagTile: (data, mines) => dispatch({ type: actionType.flagTile, board: data, mineCount: mines }),
        onGameWon: (endTime) => dispatch({ type: actionType.gameWon, time: endTime }),
        onUpdateBoard: (data) => dispatch({type: actionType.updateBoard, board: data })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withResumeGame(game, axios));


