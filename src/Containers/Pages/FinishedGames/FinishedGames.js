import React, { Component } from 'react';
import GamePost from '../../../Components/UI/GamePost/GamePost';
import axios from 'axios';
import classes from './FinishedGames.css';
import Modal from '../../../Components/UI/Modal/Modal';
import GameSummary from '../../../Components/GameSummary/GameSummary';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import moment from 'moment';


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

    // Will fetch  saved games that will be displayed
    componentDidMount() {
        this.fetchSavedGames();
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

    //////////////////////////////////////////////////////////////////// Server fetching
    fetchSavedGames() {
        axios.get("/games.json")
            .then(response => {
                // Save retrieved games and hide spinner
                this.setState({
                    games: response.data,
                    dataFetched: true,
                    loading: false
                });
            }).catch(error => {
                //hide spinner
                this.setState({ loading: false });
                alert("We couldn't retrieve your games, please try reloading");
            });
    }

    render() {

        // Check if data has been fetched adn games !== null to render components properly, if fetched store
        // in an array with Object.entries
        const games = this.state.games ? Object.entries(this.state.games) : null;

        // Check if games array had been populated yet. If so, iterate over and return gamePosts
        // else return null. (ternary operator). games is reversed to display newer games first
        let gamePosts = this.state.games !== null ? games.reverse().map(([key, value]) => {
            //Fri Sep 07 2018 12:54:01 GMT-0300 (Argentina Standard Time)"
            const date = moment(value.started, 'MM-DD-YYYY h:mm:ss a').format('ll');
            // Access to the value object {} and retrieve data to render
            return <GamePost
                key={key}
                title={value.status}
                clicked={() => this.handleGameClicked(key)}
                date={date} />

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

            // Check if game !== null to display an empty message or a CTA message
            let subtitle = this.state.games  ?    "Click on any game to see how you performed": "You'll see your progress stored here after saving a game";
            

        return (
            <React.Fragment>

                <h2 className={classes.title}>Take a look at your finished games</h2>
                <h3 className={classes.subtitle}>{subtitle}</h3>
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