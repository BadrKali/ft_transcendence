import React, { useEffect, useState } from 'react';
import './scoreboard.css';
import useFetch from '../../../hooks/useFetch';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ScoreBoard = ({ user1Score, user2Score, user1Id, user2Id }) => {
    const [user1, setUser1] = useState(null);
    const [user2, setUser2] = useState(null);

    const { data: player1, loading: loading1 } = useFetch(user1Id ? `${BACKEND_URL}/user/stats/${user1Id}` : null);
    const { data: player2, loading: loading2 } = useFetch(user2Id ? `${BACKEND_URL}/user/stats/${user2Id}` : null);

    useEffect(() => {
        if (player1) setUser1(player1);
    }, [player1]);

    useEffect(() => {
        if (player2) setUser2(player2);
    }, [player2]);

    if (loading1 || loading2 || !user1 || !user2) {
        return <div></div>;
    }

    return (
        <div className="scoreboard-container">
            <div className="player-info">
                <span className="username">{user1.username}</span>
                <img src={`${BACKEND_URL}${user1.avatar}`} alt="User 1 Avatar" className="avatar" />
                <div className="score">
                    <p className="user-score">{user1Score}</p>
                </div>
            </div>

            <span className="line"></span>

            <div className="player-info">
                <div className="score">
                    <p className="user-score">{user2Score}</p>
                </div>
                <img src={`${BACKEND_URL}${user2.avatar}`} alt="User 2 Avatar" className="avatar" />
                <span className="username">{user2.username}</span>
            </div>
        </div>
    );
};

export default ScoreBoard;
