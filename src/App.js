import React, { Component } from 'react';
import './App.css';
import Game from './Containers/Game/Game';
import GameSetup from './Containers/Pages/GameSetup/GameSetup';
import FinishedGames from './Containers/Pages/FinishedGames/FinishedGames';
import BoardSetup from './Containers/Pages/BoardSetup/BoardSetup';
import Layout from './Containers/Layout/Layout';
import {Route, Switch} from 'react-router-dom'
// import that will allow routing

class App extends Component {

  render() {
    return (
      //App is wrapped with <BrowserRouter>
      <div className={"App"}>
        <Layout>
          <Switch>
            <Route exact path='/' component={Game} />
            <Route path='/game-setup' component={GameSetup} />
            <Route path='/board-setup' component={FinishedGames} />
            <Route path='/finished-games' component={BoardSetup} />
          </Switch>
        </Layout>
      </div>




    );
  }
}

export default App;
