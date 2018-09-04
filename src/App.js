import React, { Component } from 'react';
import './App.css';
import Game from './Containers/Game/Game';
import Layout from './Containers/Layout/Layout';
class App extends Component {

  render() {
    return (
      <div className={"App"}>
        <Layout>
          <Game />
        </Layout>
      </div>


    );
  }
}

export default App;
