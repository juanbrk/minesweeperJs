import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

//Global default URL for posting and fetching data to firebase
axios.defaults.baseURL="https://react-minesweeper-b33e6.firebaseio.com/";

// Global interceptor for every request, handle requests configurations and errors. 
axios.interceptors.request.use(request => {
    //Edit request config

    //always return request
    return request;
}, error =>{

    //Handles request setting errors. 
    console.log(error);

    //always return Promise.reject((error)) to forward it to local catchs on requests
    return Promise.reject(error);
});


// Global interceptor for handling responses when connecting to the server
axios.interceptors.response.use(response => {
    //Edit request config

    //always return response
    return response;
}, error =>{
    //Handles request setting errors. 
    console.log(error);

    //always return Promise.reject((error)) to forward it to local catchs on requests
    return Promise.reject(error);
})

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>), document.getElementById('root'));
registerServiceWorker();
