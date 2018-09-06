import React, { Component } from 'react';
import classes from './GameSetup.css';
//Importamos las dificultades del juego definidas por defecto. 
import { difficulties } from '../../../Components/Menu/Menu';

/*
    Component that will allow users to configure the game's difficulties to what they find fit
*/

class GameSetup extends Component {
    constructor(props) {
        super(props);

        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleWidthChange = this.handleWidthChange.bind(this);
        this.handleMinesChange = this.handleMinesChange.bind(this);
        this.handleDifficultyChanged = this.handleDifficultyChanged.bind(this);
    }

    state = {
        selectedDifficulty: null,
        height: null,
        width: null,
        mineCount: null
    }

    handleHeightChange(event) {
        this.setState({height: event.target.value});
    }

    handleWidthChange(event){
        this.setState({width: event.target.value});
    }

    handleMinesChange(event){
        this.setState({mineCount: event.target.value});
    }

    handleDifficultyChanged(event){
        this.setState({selectedDifficulty: event.target.value});
    }

    render() {
        return (
            <React.Fragment>
                <h2 className={classes.title}>Configure the game to fit your needs</h2>

                <div className={classes.selectDifficulty}>
                    <p>Please select the difficulty configuration you would like to update</p>
                    <select onChange={this.handleDifficultyChanged}>
                        <option value="">Please select</option>
                        <option value={difficulties.easy}>Easy</option>
                        <option value={difficulties.medium}>Medium</option>
                        <option value={difficulties.hard} >Hard</option>
                    </select>
                </div>

                <form className={classes.switchDifficultiesForm}>
                    <label>
                        Board height (# of rows):
                        <input 
                            type="number" 
                            name="rowsCount" 
                            min="1" 
                            max="10"
                            onChange={this.handleHeightChange}/>
                    </label>
                    <label>
                        Board width (# of columns - Max: 20):
                        <input 
                            type="number" 
                            name="colsCount" 
                            min="1" 
                            max="20"
                            onChange={this.handleWidthChange}/>
                    </label>
                    <label>
                        # of mines:
                        <input 
                            type="number" 
                            name="minesCount" 
                            min="1" 
                            max="10"
                            onChange={this.handleMinesChange}/>
                    </label>
                    <button 
                        type="button"
                        onClick={() => this.props.difficultyChanged(this.state.height, this.state.width, this.state.mineCount, this.state.selectedDifficulty)}
                            >Update values
                    </button>
                </form>


            </React.Fragment>
        );
    }

}

export default GameSetup;