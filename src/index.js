import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from './store/reducer';

const store =createStore(reducer);


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
