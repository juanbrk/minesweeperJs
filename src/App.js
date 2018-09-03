import React, { Component } from 'react';
import './App.css';
import Game from './Containers/Game/Game';

const options = [
  {
    beginner: "easy",
    advanced: "medium",
    expert: "difficult",
  }
];
class App extends Component {

  render() {
    return (
      <div className={"App"}>
        <Game
          height={8}
          width={8}
          mines={14}
          difficulty={"medium"}
        />
      </div>


    );
  }
}

export default App;
