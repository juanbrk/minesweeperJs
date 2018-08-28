import React, { Component } from 'react';
import './App.css';
import BoardRow from './Components/BoardRow/BoardRow';
import Board from './Containers/Board/Board';

class App extends Component {
  render() {
    //DEBUG PURPOSE ONLY

    let arrayTiles = [
      {
      containsMine: false,
      isRevealed:false,
      isFlagged:true,
      neighbour: 0
    },
      {
      containsMine: true,
      isRevealed:false,
      isFlagged:true,
      neighbour: 5
    },
      {
      containsMine: false,
      isRevealed:false,
      isFlagged:true,
      neighbour: 4
    },
      {
      containsMine: true,
      isRevealed:false,
      isFlagged:true,
      neighbour: 1
    },
      {
      containsMine: true,
      isRevealed:false,
      isFlagged:true,
      neighbour: 1
    },

    ];

    //DEBUG PURPOSE ONLY

    return (
      <div className="App">
      <Board
        height={5}
        width={6}
      />


   
      </div>
    );
  }
}

export default App;
