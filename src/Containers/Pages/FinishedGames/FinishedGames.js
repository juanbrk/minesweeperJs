import React, { Component } from 'react';
import GamePost from '../../../Components/UI/GamePost/GamePost';
import axios from 'axios';
import classes from './FinishedGames.css';

class FinishedGames extends Component {
    state = {
        games: null,
        dataFetched: false
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
    render() {

        // Check if data has been fetched to render components properly, if fetched store
        // in an array with Object.entries
        const games = this.state.dataFetched ? Object.entries(this.state.games) : null;

        // Check if games array had been populated yet. If so, iterate over and return gamePosts
        // else return null. (ternary operator)
        const gamePosts = this.state.games !== null ? games.map(([key, value]) => {

            // Access to the value object {} and retrieve data to render
            return <GamePost key={key} title={value.status} />

        }) : null;
        return (
            <React.Fragment>
                
                <h2 className={classes.title}>Esta es la pagina de juegos terminados</h2>
                <section className={classes.games}>
                    {gamePosts}
                </section>

            </React.Fragment>
        );
    }
}

export default FinishedGames;