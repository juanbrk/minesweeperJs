import React, { Component } from 'react';
import './App.css';
import Game from './Containers/Game/Game';
import GameSetup from './Containers/Pages/GameSetup/GameSetup';
import FinishedGames from './Containers/Pages/FinishedGames/FinishedGames';
import BoardSetup from './Containers/Pages/BoardSetup/BoardSetup';
import Layout from './Containers/Layout/Layout';
import { Route, Switch } from 'react-router-dom'
// import that will allow routing

class App extends Component {
  constructor(props) {
    super(props)

    this.handleDifficultyChange = this.handleDifficultyChange.bind(this);
  }

  state = {
    hasDifficultyChanged: false,
    newHeight: null,
    newWidth: null,
    newMineCount: null,
    //modifiedDifficulty specifies which level has been modified
    modifiedDifficulty: null
  }

  //Callback methdo passed as prop to <Route ... GameStatus, will modify a specific difficulty for the game
  handleDifficultyChange(height, width, mines, difficulty) {
    this.setState({
      hasDifficultyChanged: true,
      newHeight: height,
      newWidth: width,
      newMineCount: mines,
      modifiedDifficulty: difficulty
    })
  }

  render() {
    return (
      //App is wrapped with <BrowserRouter>
      <div className={"App"}>
        <Layout>
          <Switch>
            <Route
              exact path='/'
              render={() => (
                /*
                  If user changed difficulty we render a game with some props passed, if not no prop is passsed
                  the <Game> doesnt accept props. This is a conditional rendering using a ternary operator
                */
                this.state.hasDifficultyChanged ? <Game height={this.state.newHeight}
                  width={this.state.newWidth}
                  mines={this.state.newMineCount}
                  difficulty={this.state.modifiedDifficulty}
                /> : <Game />
                
              )
              }
            />
            <Route
              path='/game-setup'
              render={() => <GameSetup difficultyChanged={this.handleDifficultyChange} />}
            />
            <Route path='/board-setup' component={FinishedGames} />
            <Route path='/finished-games' component={BoardSetup} />
          </Switch>
        </Layout>
      </div>




    );
  }
}

export default App;
