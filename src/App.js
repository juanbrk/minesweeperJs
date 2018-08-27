import React, { Component } from 'react';
import './App.css';
import Tile from './Components/Tile/Tile'

class App extends Component {
  render() {
    let num = 0;
    let numi = 4;
    return (
      <div className="App">
        <Tile 
        containsMine={true}
        isRevealed={false}
        isFlagged={false}/>
        <Tile 
        containsMine={false}
        isRevealed={false}
        isFlagged={true}/>
        <Tile 
        containsMine={false}
        isRevealed={false}
        isFlagged={false}
        neighbour={num}/>
        <Tile 
        containsMine={false}
        isRevealed={false}
        isFlagged={false}
        neighbour={numi}/>
        <Tile 
        containsMine={false}
        isRevealed={false}
        isFlagged={false}/>
      </div>
    );
  }
}

export default App;
