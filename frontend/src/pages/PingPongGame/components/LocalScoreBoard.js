import React, { useEffect, useState } from 'react';
import './scoreboard.css';
import useFetch from '../../../hooks/useFetch';
import avatar1 from "../../../assets/avatar1.png"
import avatar2 from "../../../assets/avatar2.png"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LocalScoreBoard = ({ user1Score, user2Score, user1, user2 }) => {
    return (
        <div className="scoreboard-container">
            <div className="player-info">
                <span className="username">{user1.username}</span>
                <img src={avatar1} alt="User 1 Avatar" className="avatar" />
                <div className="score">
                    <p className="user-score">{user1Score}</p>
                </div>
            </div>

            <span className="line"></span>

            <div className="player-info">
                <div className="score">
                    <p className="user-score">{user2Score}</p>
                </div>
                <img src={avatar2} alt="User 2 Avatar" className="avatar" />
                <span className="username">{user2.username}</span>
            </div>
        </div>
    );
};

export default LocalScoreBoard;
