import "./waiting.css";
import React, { useEffect, useState } from 'react';
import '../stylesheet/game-style.css';
import rectangle from '../asstes/rec2.png';
import avatar1 from '../asstes/avatar1.png';
import avatar2 from '../asstes/avatar2.png';
import avatar3 from '../asstes/avatar4.png';
// import vs from '../asstes/VS.png';

const Waiting = ({player}) => {
    const [timer, setTimer] = useState(10);
    const [noPlayerFound, setNoPlayerFound] = useState(false);

    useEffect(() => {
        if (timer === 0) {
            setNoPlayerFound(true);
            return;
        }

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 3000);

        return () => clearInterval(interval);
    }, [timer]);

    return (
        <div className="player-info-container">
            {!noPlayerFound && (
                <>
                    {player ? (
                    <div className='player-container'>
                            <div className="player-img-container">
                                <img src={avatar1} alt="PlayerAvatar"/>
                                <h1 className='player-username'>{player.username}</h1>
                            </div>
                            <div className="players-informations">
                                <div className="info">
                                    <div className="data">
                                        <h2>{player.rank}</h2>
                                    </div>
                                    <div className="title-container">
                                        <h2>RANK</h2>
                                    </div>
                                    <div className="data waiting">
                                        <h2>?</h2>
                                    </div>
                                </div>
                                <div className="info">
                                    <div className="data">
                                        <h2>{player.games_played}</h2>
                                    </div>
                                    <div className="title-container">
                                        <h2>GAMES PLAYED</h2>
                                    </div>
                                    <div className="data waiting">
                                        <h2>?</h2>
                                    </div>
                                </div>
                                <div className="info">
                                    <div className="data">
                                        <h2>0</h2>
                                    </div>
                                    <div className="title-container">
                                        <h2>WIN RATE</h2>
                                    </div>
                                    <div className="data waiting">
                                        <h2>?</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="player-img-container waiting-img-container">
                                <div className="waiting-img-strip">
                                    <img src={avatar1} alt="Waiting" className="waiting waiting-img" />
                                    <img src={avatar2} alt="Waiting" className="waiting waiting-img" />
                                    <img src={avatar3} alt="Waiting" className="waiting waiting-img" />
                                    <img src={avatar1} alt="Waiting" className="waiting waiting-img" />
                                </div>
                            </div>
                        </div>
                ) : (
                    <h1>ERROR ...</h1>
                )}
                </>
            )}
            {noPlayerFound && <h1>NO PLAYER FOUND</h1>}
        </div>
    );
}
  
export default Waiting;