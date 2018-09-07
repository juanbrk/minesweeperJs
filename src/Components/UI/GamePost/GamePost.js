import React from 'react';
import classes from './GamePost.css';

const gamePost = (props) => (
    <article 
        className={classes.gamePost}
        onClick={props.clicked}>
        <h1>{props.title}</h1>
        <div className="Info">
            <span>Date to be here</span>
        </div>
    </article>
);

export default gamePost;