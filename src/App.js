import React, { Component } from 'react';
import './App.css';
import Board from './Containers/Board/Board';

class App extends Component {
  render() {
    //DEBUG PURPOSE ONLY ZONE

    //DEBUG PURPOSE ONLY ZONE

    return (
      <div className="App">
      <Board
        height={7}
        width={7}
        mineCount={3}
      />
      </div>
    );
  }
}

export default App;
