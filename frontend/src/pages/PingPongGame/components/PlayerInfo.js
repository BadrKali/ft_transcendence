import React, { useEffect, useState } from 'react';
import './playerInfo.css';
import avatar1 from '../asstes/avatar1.png';
import avatar2 from '../asstes/avatar2.png';
import vs from '../asstes/VS.png';

const PlayerInfo = ({ player1, player2, onStartGame}) => {
    const [timer, setTimer] = useState(2);
    const [isGameStarting, setIsGameStarting] = useState(false);

    useEffect(() => {
        if (timer === 0) {
            setIsGameStarting(true);
            onStartGame(true);
            return;
        }

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);
    if (!player1 || !player2) {
        return <div><h1>Loading...</h1></div>;
    }
    return (
        <div className="player-info-container">
            {!isGameStarting && (
                <>
                    <img src={vs} alt="" className='vs-image'/>
                    <div className='player-container'>
                        <div className="player-img-container">
                            <img src={avatar1} alt="PlayerAvatar"/>
                            <h1 className='player-username'>{player1.username}</h1>
                        </div>
                        <div className="players-informations">
                            <div className="info">
                                <div className="data">
                                    <h2>{player1.rank}</h2>
                                </div>
                                <div className="title-container">
                                    <h2>RANK</h2>
                                </div>
                                <div className="data">
                                    <h2>{player2.rank}</h2>
                                </div>
                            </div>
                            <div className="info">
                                <div className="data">
                                    <h2>{player1.games_played}</h2>
                                </div>
                                <div className="title-container">
                                    <h2>GAMES PLAYED</h2>
                                </div>
                                <div className="data">
                                    <h2>{player2.games_played}</h2>
                                </div>
                            </div>
                            <div className="info">
                                <div className="data">
                                    <h2>0</h2>
                                </div>
                                <div className="title-container">
                                    <h2>WIN RATE</h2>
                                </div>
                                <div className="data">
                                    <h2>0</h2>
                                </div>
                            </div>
                        </div>
                        <div className="player-img-container">
                            <img src={avatar2} alt="PlayerAvatar"/>
                            <h1 className='player-username'>{player2.username}</h1>
                        </div>
                    </div>
                    <div className="timer-container">
                        <h2>Starting in: {timer}s</h2>
                    </div>
                </>
            )}
            {/* {isGameStarting && <h1>The game is starting!</h1>} */}
        </div>
    );
}

export default PlayerInfo;
