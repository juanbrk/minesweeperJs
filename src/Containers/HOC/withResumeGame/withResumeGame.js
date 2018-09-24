import React, { Component } from 'react';
import Modal from '../../../Components/UI/Modal/Modal';
import UserPrompt from '../../../Components/UserPrompt/UserPrompt';

import { connect } from 'react-redux';
import { actions as actionType } from '../../../store/actions';

/**
 * HOC that prompts user for resuming an unfinishedGame if there is one on server
 * @param {*} WrappedComponent Game component 
 * @param {*} axios axios instance that is used to query for unfinished games on server
 */
const withResumeGame = (WrappedComponent, axios) => {
     class Resume extends Component {
        constructor(props) {
            super(props);

            // bind functions to class
            this.checkForPendingGame = this.checkForPendingGame.bind(this);
            this.handleModalClosed = this.handleModalClosed.bind(this);
            this.resumeGameHandler = this.resumeGameHandler.bind(this);
            this.eraseHistoryFromServer = this.eraseHistoryFromServer.bind(this);
        }

        state = {
            pendingGame: null,
            showModal: false
        }

        // When component mounts, check for unfinished games 
        componentDidMount() {
            this.checkForPendingGame()
        }

        // Validates if /unfinishedGames on firebase !== null in order to prompt for resuming a game
        checkForPendingGame() {

            // is there an unfinished game?
            axios.get("/unfinishedgames.json")
                .then(response => {
                    //If there's a response, check if null 
                    if (response.data) {
                        // if response !null, theres an unfinished game

                        // for displaying inside the modal, we have to obtain the key value pairs of response
                        let pendingGameList = Object.entries(response.data);

                        // pendingGame == {boardData: ... , difficulty: .., ...}
                        let pendingGame = pendingGameList.slice(pendingGameList.length - 1)[0][1];
                        console.log(pendingGame);

                        //update state 
                        this.setState({
                            pendingGame: pendingGame,
                            showModal: true
                        });
                        

                        
                    }
                }).catch(error => {
                    alert("Something went wrong, but you can still play!");
                });

        }

        /**
     * Erases the node unfinishedgames from firebase. Triggered when the user finishes a game
     */
        eraseHistoryFromServer() {
            axios.delete("/unfinishedgames.json")
                .catch(error => {
                    alert("Something went wrong, but you can still keep playing");
                });
        }


        ////////////////////////////////////////////////////////////////////////////////// Handler
        handleModalClosed() {
            this.setState({ showModal: false });
            this.eraseHistoryFromServer()
        }

        /**
         * Handles click on resume button and updates the state to hide modal and updates store to store pending game
         */
        resumeGameHandler() {
            this.setState({  showModal: false })
            this.props.onRetrievedGame(this.state.pendingGame);
        }

        render() {

            let userPrompt = this.state.pendingGame ? <UserPrompt
                gameData={this.state.pendingGame}
                resume={this.resumeGameHandler}
                cancel={this.handleModalClosed} /> : null
            return (
                <React.Fragment>
                    <Modal
                        show={this.state.showModal}
                        close={this.handleModalClosed}> {userPrompt}
                    </Modal>
                    <WrappedComponent
                        {...this.props} />
                </React.Fragment>
            )
        }
    }

    const mapDispatchToProps = dispatch => {
        return {
            onRetrievedGame : (game) => dispatch({type: actionType.storePendingGame, pending: game }),
        }
    }

    return connect(null, mapDispatchToProps)(Resume)
}

export default withResumeGame;