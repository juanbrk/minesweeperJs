import React, { Component } from 'react';
import axios from 'axios';

class  FinishedGames extends Component {
    state ={
        games: [],
    }
    render(){
        return(
            <h2>Esta es la pagina de juegos terminados</h2>
        );
    }
} 

export default FinishedGames;