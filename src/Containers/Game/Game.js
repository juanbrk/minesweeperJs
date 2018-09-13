import React, { PureComponent } from 'react';
import Board from '../../Components/Board/Board';
import classes from './Game.css';
import Menu from '../../Components/Menu/Menu';
import Modal from '../../Components/UI/Modal/Modal';
import GameSummary from '../../Components/GameSummary/GameSummary';
import axios from 'axios';
import Spinner from '../../Components/UI/Spinner/Spinner';

const GAMESTATUSES = {
    notInitialized: "Make your first move",
    inProgress: "Not yet loosing",
    won: "YOU WON!",
    lost: "GAME OVER",
}


class game extends PureComponent {
    constructor(props) {
        super(props);

        //Check which of this binding methods is actually necessary
        this.initializeBoard = this.initializeBoard.bind(this);
        this.populateBoardWithMines = this.populateBoardWithMines.bind(this);
        this.restartClickHandler = this.restartClickHandler.bind(this);
        this.changeDifficulty = this.changeDifficulty.bind(this);
        this.tileClickedHandler = this.tileClickedHandler.bind(this);
        this.rightClickHandler = this.rightClickHandler.bind(this);
        this.handleModalClosed = this.handleModalClosed.bind(this);

    }

    state = {
        endTime: null,
        height: null,
        difficulty: null,
        mineCount: null,
        movesCount: 0,
        startTime: null,
        //Will be set when the board is initialized
        gameStatus: GAMESTATUSES.notInitialized,
        //Will be selected from the dropDown menu
        width: null,
        //Will be rendered once the difficulty has been selected 
        boardData: null,
        finished: false,
        loading: false,
        // will be loaded with an object if checkForPendingGame() finds an unfinished game on server
        pendingGame: null
    }


    //////////////////////////////////////////////////////////////////////////////////////////// Lifecycle hooks

    // When component is mounted check if theres an unfinishedGame to load and present to the user
    componentDidMount() {

        // If user didnt play yet, check for unfinished game
        if (this.state.movesCount === 0) {

            // is there an unfinished game?
            axios.get("/unfinishedgames.json")
                .then(response => {
                    //If there's a response, check if null 
                    if (response.data) {
                        // if response !null, theres an unfinished game
                        this.setState({
                            pendingGame: response.data,
                        }, () => {
                            // TODO prompt user about resuming the game 

                            //WTF this is super clumsy, should find a better way to persist board and retrieve it
                            // maybe redux?

                            //If user wants to resume the game, fetch data and update
                            const responseData = Object.entries(response.data);
                            const data = responseData.slice(responseData.length-1)[0][1];
                            this.setState(data)

                            /**
                             * Couldn't figure out how to prompt the user for resuming the game
                             * Didnt find a way to render a component before render() gets called
                             * I've made a question on SO about this: https://stackoverflow.com/questions/52320443/in-react-is-it-possible-to-render-a-component-inside-another-components-class
                             */

                        });
                    }
                }).catch(error => {
                });


        }
    }



    //////////////////////////////////////////////////////////////////////////////////////////// class methods

    // Method that creates a board according to the difficulty selected by the user. Will be passed down to Board as a prop.
    // mineCount, height and width will be set inside this method. If not difficulty has been chosen yet, it will return null
    initializeBoard() {

        //Board will be rendered if difficulty has been selected, if not, it wont 
        if (this.state.difficulty !== null) {
            let height = this.state.height;
            let width = this.state.width;
            let mines = this.state.mineCount;
            
            //Render board 
            const emptyTiles = this.createEmptyArray(height, width);
            const populatedBoardWithMines = this.populateBoardWithMines(emptyTiles, height, width, mines);
            const populatedBoardWithNeighbours = this.populateTilesWithNeighbours(populatedBoardWithMines, height, width);

            //Update state with new values 
            this.setState({
                boardData: populatedBoardWithNeighbours,
                gameStatus: GAMESTATUSES.notInitialized,
            });



        } else {
            //If this.state.difficulty === null
            return null;
        }
    }

    //Creates a 2D array with empty "tiles" objects in it. Every tile will have its .isEmpty property set to true They will be loaded with info later. 
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
    * @param tilesArr
    * @param height
    * @param width
    * @param mines
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

    // Method that gets the amount of mines that a tile's neighbours have and returns a new (updated) array with information on every 
    // tile and its neighbouring tiles.  Every mine with neighbouring mines will have its .neighbour property set to !=== 0 and its
    // .isEmpty property set to false
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

    // looks for neighbouring tiles taking into account index restrictions and returns them as an array of tiles
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
                }
            });
        });
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
                }
            });
        });
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

                //if both arrays are equal, game is won. Update gameStatus
                this.setState({
                    gameStatus: GAMESTATUSES.won,
                    endTime: new Date().toString(),
                    finished: true,
                });
            }

        }
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

        this.setState({ boardData: updatedData });
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




    //---------------------------------------------------- Handler methods

    /*
        handles tile click. Accepts 2D[x][y] indexes to reveal the tile that was clicked. This reveal will be done according to the content
        of the mine which can be a bomb, or not. If not a bomb and it is not empty, it shows the number of neighbouring tiles containing 
        mines. If not a bomb and empty, it starts a recursive function to reveal all empty neighbouring tiles and its neighbouring tiles
        containing mines
     */
    tileClickedHandler = (x, y) => {
        //Obtain the clicked object, this will allow us to update state in a immutable way later
        const clickedTile = { ...this.state.boardData[x][y] };

        // Check if first move of the user
        const isFirstMove = this.state.movesCount === 0;

        //Check if clicked tile has not been revealed or flagged yet, if revealed do nothing. 
        if (!clickedTile.isRevealed && !clickedTile.isFlagged && !(this.state.gameStatus === GAMESTATUSES.won)) {

            //If not revealed yet, check for mines
            if (clickedTile.containsMine) {

                //If contains mine, player looses, game status is updated and board content revealed
                alert("There is a mine, you explode! and lose btw");

                //Check if player looses on first move, if so set endtime === startTime
                if (isFirstMove) {

                    //Every time user looses history will be null and erased from server

                    this.setState(prevState => {

                        return {
                            gameStatus: GAMESTATUSES.lost,
                            movesCount: prevState.movesCount + 1,
                            startTime: new Date().toString(),
                            endTime: new Date().toString(),
                            finished: true
                        }
                    });

                } else {

                    //if movesCount >0 startTime != endTime
                    this.setState(prevState => {
                        return {
                            gameStatus: GAMESTATUSES.lost,
                            movesCount: prevState.movesCount + 1,
                            endTime: new Date().toString(),
                            finished: true,
                        }
                    });
                }

                this.revealBoardContent();

            } else {

                //if clicked mine !containsmine

                // Variable to update gameStatus
                let status = GAMESTATUSES.inProgress

                //If is not revealed nor flagged nor contains mine... is it empty?
                if (clickedTile.isEmpty) {

                    //if empty, reveal and behave as if user clicked on every surrounding tile
                    const currentBoard = [...this.state.boardData];
                    const updatedData = [...this.revealEmpty(x, y, currentBoard)];

                    //Check if this is the first click, to start clocking gameDuration 
                    if (isFirstMove) {

                        // update state and save history to server with a callback
                        this.setState(prevState => {
                            return {
                                boardData: updatedData,
                                gameStatus: status,
                                movesCount: prevState.movesCount + 1,
                                startTime: new Date().toString(),
                            }
                        },
                            /*DONT KNOW IF THIS IS RECCOMENDED OR NOT, COULDNT FIND ANY INFO THAT HELPS*/
                            () => {
                                this.postHistoryToServer(this.state);
                            });
                    } else {

                        //if not the first click just update state with status, movesCount, gameStatus and history
                        this.setState(prevState => {
                            return {
                                boardData: updatedData,
                                gameStatus: status,
                                movesCount: prevState.movesCount + 1,
                            }
                        }, this.postHistoryToServer(this.state));
                    }



                } else {

                    // If clickedTile !empty, show neighbours, update state
                    clickedTile.isRevealed = true;

                    //Create a new array of boardData to update the position of the revealed tile
                    const updatedBoardData = [...this.state.boardData];

                    // Assign the position of the revealed tile in the new array to the updated tile
                    updatedBoardData[x][y] = { ...clickedTile };

                    //Check if this is the first click, to start clocking gameDuration
                    if (isFirstMove) {
                        this.setState(prevState => {
                            return {
                                boardData: updatedBoardData,
                                gameStatus: status,
                                movesCount: prevState.movesCount + 1,
                                startTime: new Date().toString(),
                            }
                        }, () => {
                            this.postHistoryToServer(this.state);
                        });
                    } else {

                        //if not the first click just update state with status, movesCount and gameStatus 

                        this.setState(prevState => {
                            return {
                                boardData: updatedBoardData,
                                gameStatus: status,
                                movesCount: prevState.movesCount + 1,
                            }
                        }, () => {
                            this.postHistoryToServer(this.state);
                        });
                    }

                }
            }

        }
    }

    restartClickHandler = () => {
        const newData = this.initializeBoard(this.state.height, this.state.width, this.state.mineCount);
        this.setState({
            board: newData,
            gameStatus: GAMESTATUSES.notInitialized,
            movesCount: 0,
            startTime: null,
            endTime: null,
            finished: false,
        });

    }


    //Method that will set the selected Difficulty from the user to the state difficulty, and using a setState callback, initialize the
    // board.
    changeDifficulty(dif) {

        let difficultySelected = dif;
        let heightForDifficulty = null;
        let widthForDifficulty = null;
        let minesForDifficulty = null;

        // Set the width,height and mine count of the board according to the difficulty selected. 
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

        // setState callback to initialize state properties and the board via callback
        this.setState(
            {
                difficulty: difficultySelected,
                height: heightForDifficulty,
                width: widthForDifficulty,
                mineCount: minesForDifficulty,
                movesCount: 0
            }, () => {
                this.initializeBoard();
            });
    }

    // handles right clicks to flag or unflag a tile. Updates the counter of remaining mines and the 
    // board state with flagged/unflagged tiles
    rightClickHandler(event, x, y) {
        event.preventDefault();  // prevents default behaviour such as right click
        const clickedTile = { ...this.state.boardData[x][y] }


        //ommit if revealed and if  game is ended
        if (!clickedTile.isRevealed && !(this.state.gameStatus === GAMESTATUSES.won)) {

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

                // If user flagged possible last tile containing a mine, check if won with a setState callback to checkIfWin()
                // and save history to server in the same callback 
                this.setState(prevState => {
                    return {
                        boardData: updatedData,
                        mineCount: minesLeft,
                        movesCount: prevState.movesCount + 1,
                    }

                },
                    () => {
                        (() => { this.checkIfWin(this.state.mineCount) })();
                        (() => { this.postHistoryToServer })()

                    });
            } else {

                //If remaining mines !== 0 update only boardData, minesLeft, movesCount and history

                //Check if this is the first move to start clocking gameTime
                if (this.state.movesCount === 0) {

                    //If it is first move, set startTime
                    this.setState(prevState => {
                        return {
                            boardData: updatedData,
                            mineCount: minesLeft,
                            movesCount: prevState.movesCount + 1,
                            startTime: new Date().toString(),
                        }
                    }, () => {
                        this.postHistoryToServer(this.state);
                    });

                } else {

                    // If not first move, update state without setting startTime
                    this.setState(prevState => {
                        return {
                            boardData: updatedData,
                            mineCount: minesLeft,
                            movesCount: prevState.movesCount + 1,
                        }
                    }, () => {
                        this.postHistoryToServer(this.state);
                    });
                }
            }
        }
    }

    //Method to handle status change of the game when clicking tiles from Board.
    handleStatusChange(newStatus) {
        this.setState({ gameStatus: newStatus });
    }

    // If modal is closed, erase history from   server
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
            ended: this.state.endTime,
            height: this.state.height,
            level: this.state.difficulty,
            minesLeft: this.state.mineCount,
            moves: this.state.movesCount,
            started: this.state.startTime,
            status: this.state.gameStatus,
            width: this.state.width,
        }


        //TODO configure games to sort properties in a pre-defined way to enhance UX
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
                this.setState({ loading: false });

                alert("Something went wrong, please try again")
            });

        //erase history from firebase
        this.eraseHistoryFromServer();
    }

    /**
     * Erases the node unfinishedgames from firebase. Triggered when the user finishes a game
     */
    eraseHistoryFromServer() {
        axios.delete("/unfinishedgames.json")
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    /**
     * Posts history to server on the unfinishedGames node to keep track of every movement the user
     * does. So in case the page reloads, progress from the lost game can be recovered
     * 
     * TODO use redux instead of server-saving
     */
    postHistoryToServer(state) {

        // I should actually update the node with the last game state instead of posting new
        // objects.
        axios.post("/unfinishedgames.json", state)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }


    //////////////////////////////////////////////////////////////////// render

    render() {
        // dynamically rendering the board according to if the difficulty has been selected yet or not 
        // this will later be passed on to <Board> as prop
        let boardData = this.state.difficulty || this.state ? this.state.boardData : null;

        // Determine if show GameSummary  or spinner according if there's a 
        // connection with the server going on
        let gameSummary = <GameSummary
            gameResults={this.state}
            save={this.saveGameHandler}
            cancel={this.handleModalClosed}
            title={"Your last game stats:"}
            showSave showCancel />

        if (this.state.loading) {
            gameSummary = <Spinner />;
        }

        return (
            <div className="container">
                <div>
                    <Menu
                        mineCount={this.state.mineCount}
                        gameStatus={this.state.gameStatus}
                        restartClick={this.restartClickHandler}
                        difficultyChangedHandler={(e) => this.changeDifficulty(e)}
                        selectedDifficulty={this.state.difficulty} />
                </div>
                <Modal
                    show={this.state.finished}
                    close={this.handleModalClosed}>
                    {gameSummary}
                </Modal>
                <div className={classes.board}>
                    <Board
                        data={boardData}
                        gameStatus={this.state.gameStatus}
                        onStatusChange={(e) => this.handleStatusChange(e)}
                        tileClicked={this.tileClickedHandler}
                        tileFlagged={this.rightClickHandler}
                    />
                </div>

            </div>
        );

    }

};

export default game;
