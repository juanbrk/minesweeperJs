import React, { Component } from 'react';
import GamePost from '../../../Components/UI/GamePost/GamePost';
import axios from 'axios';
import classes from './FinishedGames.css';
import Modal from '../../../Components/UI/Modal/Modal';
import GameSummary from '../../../Components/GameSummary/GameSummary';

/**
 * Component that will show finished games retrieved from firebase and allows user to click
 * on them to display a game summary
 */

class FinishedGames extends Component {
    state = {
        games: null,
        dataFetched: false,
        postClicked: false
    }

    // Will get the saved games to display using this method
    componentDidMount() {
        axios.get("/games.json")
            .then(response => {
                // Save retrieved games 
                this.setState({
                    games: response.data,
                    dataFetched: true
                })
            })
    }


    /////////////////////////////////////////////////////////////// Handlers
    handleModalClosed =()=> {
        this.setState({ postClicked: false })
    }

    handlePostClicked = () =>{
        this.setState({postClicked:true})
    }
    render() {

        // Check if data has been fetched to render components properly, if fetched store
        // in an array with Object.entries
        const games = this.state.dataFetched ? Object.entries(this.state.games) : null;

        // Check if games array had been populated yet. If so, iterate over and return gamePosts
        // else return null. (ternary operator)
        const gamePosts = this.state.games !== null ? games.map(([key, value]) => {

            // Access to the value object {} and retrieve data to render
            return <GamePost key={key} title={value.status} clicked={this.handlePostClicked} />

        }) : null;


        // TO-DO allow user to click on the gamePost to visualize a summary of how it played on
        // the clicked game

        // let gameSummary = <GameSummary
        //     gameResults={this.state}
        //     save={this.saveGameHandler}
        //     cancel={this.handleModalClosed}
        //     title={"This is how you played"} />

        return (
            <React.Fragment>
                
                <h2 className={classes.title}>Take a look at your finished games</h2>
                <Modal
                    show={this.state.postClicked}
                    close={this.handleModalClosed}>
                        {/* {gameSummary} */}
                </Modal>
                <section className={classes.games}>
                    {gamePosts}
                </section>

            </React.Fragment>
        );
    }
}

export default FinishedGames;