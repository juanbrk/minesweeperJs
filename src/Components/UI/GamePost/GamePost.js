import React from 'react';
import classes from './GamePost.css';

const gamePost = (props) => (
    <article 
        className={classes.gamePost}
        onClick={props.clicked}>
        <h1 className={classes.title}>{props.title}</h1>
        <div className={classes.info}>
            <span>{props.date}</span>
        </div>
    </article>
);

export default gamePost;