import React, { Component } from 'react';
import GamePost from '../../../Components/UI/GamePost/GamePost';
import axios from 'axios';
import classes from './FinishedGames.css';
import Modal from '../../../Components/UI/Modal/Modal';
import GameSummary from '../../../Components/GameSummary/GameSummary';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import gamePost from '../../../Components/UI/GamePost/GamePost';

/**
 * Component that will show finished games retrieved from firebase and allows user to click
 * on them to display a game summary
 */

class FinishedGames extends Component {
    state = {
        games: null,
        gameSelected: null,
        dataFetched: false,
        postClicked: false,
        // loading === true when first rendering the page and set to false when fetched games
        loading: true
    }

    // Will get the saved games to display using this method
    componentDidMount() {
        axios.get("/games.json")
            .then(response => {
                // Save retrieved games and hide spinner
                this.setState({
                    games: response.data,
                    dataFetched: true,
                    loading: false
                })
            }).catch(error => {
                //hide spinner
               this.setState({loading:false});

               alert("Something went wrong, please try again")
            });
    }


    /////////////////////////////////////////////////////////////// Handlers
    handleModalClosed = () => {
        this.setState({ postClicked: false })
    }

    /**
     * Handles gamePost clicks. Updates state with clicked game info to display on modal
     */
    handleGameClicked = (gameId) => {

        // find objectClicked to fetch its stats
        const objectFetched = Object.entries(this.state.games).find(([key, _]) => {
            return gameId === key;
        });

        // Get the JS object nested inside objectFetched
        const gameFetched = objectFetched[1];
        this.setState({
            postClicked: true,
            gameSelected: gameFetched
        });




    }

    render() {

        // Check if data has been fetched to render components properly, if fetched store
        // in an array with Object.entries
        const games = this.state.dataFetched ? Object.entries(this.state.games) : null;

        // Check if games array had been populated yet. If so, iterate over and return gamePosts
        // else return null. (ternary operator)
        let gamePosts = this.state.games !== null ? games.map(([key, value]) => {

            // Access to the value object {} and retrieve data to render
            return <GamePost key={key} title={value.status} clicked={() => this.handleGameClicked(key)} />

        }) : null;

        // Determine if show gamePosts  or spinner according if there's a 
        // connection with the server going on
        if (this.state.loading) {
            gamePosts = <Spinner />;
        }

        let gameSummary = this.state.gameSelected ? <GameSummary
            gameResults={this.state.gameSelected}
            cancel={this.handleModalClosed}
            continue={this.handleModalClosed}
            title={"This is how you played"}
            showContinue /> : null;


        return (
            <React.Fragment>

                <h2 className={classes.title}>Take a look at your finished games</h2>
                <Modal
                    show={this.state.postClicked}
                    close={this.handleModalClosed}>  {gameSummary}
                </Modal>
                <section className={classes.games}>
                    {gamePosts}
                </section>

            </React.Fragment>
        );
    }
}

export default FinishedGames;