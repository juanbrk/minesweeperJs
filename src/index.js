import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose  } from 'redux'
import reducer from './store/reducer';

const logger = store => next => action =>{
    console.log("[Middleware]", action.type);
    next(action);
    console.log("[Middleware]",store.getState());
}

// Redux devTools constant to follow store changes. 
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store =createStore(
    reducer,
    composeEnhancers(applyMiddleware(logger))
    );


//Global default URL for posting and fetching data to firebase
axios.defaults.baseURL = "https://react-minesweeper-b33e6.firebaseio.com/";



ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));
registerServiceWorker();
