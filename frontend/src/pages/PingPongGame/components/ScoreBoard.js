import React from 'react';
import './scoreboard.css';

const ScoreBoard = ({ user1Score, user2Score, user1Name, user1Avatar, user2Name, user2Avatar }) => {
    return (
        <div className="scoreboard-container">
                <span className="username">{user1Name}</span>
                <img src={user1Avatar} alt="User 1 Avatar" className="avatar" />
                <div className="score">
                    <p className="user-score">{user1Score}</p>
                </div>
                <span className='line'></span>
                <div className="score">
                    <p className="user-score">{user2Score}</p>
                </div>
                <img src={user2Avatar} alt="User 2 Avatar" className="avatar" />
                <span className="username">{user2Name}</span>
        </div>
    );
};

export default ScoreBoard;
