import React from 'react';
import classes from './GamePost.css';

const gamePost = (props) => (
    <article className={classes.gamePost}>
        <h1>Title</h1>
        <div className="Info">
            <div className="Author">Author</div>
        </div>
    </article>
);

export default gamePost;