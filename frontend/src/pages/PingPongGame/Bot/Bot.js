import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./bot.css";
import hell from "../asstes/hell.png";
import forest from "../asstes/forest.png";
import graveyard from "../asstes/graveyard.png";
import ScoreBoard from '../components/ScoreBoard';
import Timeout from '../components/TimeOut';
import avatar from "../asstes/avatar3.png";
import pongy from "../asstes/pongy.png";
import exit from "../asstes/right-arrow.png"
import useFetch from '../../../hooks/useFetch';
import GameLogic from './GameLogic';
import Loading from '../components/Loading';


const BOT = () => {
    const { data: gameSettings, isLoading, error } = useFetch('http://localhost:8000/api/game/game-settings/current-user/');
    const [background, setBackground] = useState(null);
    const [paddle, setPaddle] = useState(null);
    useEffect(() => {
        if (!isLoading && gameSettings) {
            if (gameSettings.background === 'hell') {
                setBackground(hell);
            } else if (gameSettings.background === 'forest') {
                setBackground(forest);
            } else if (gameSettings.background === 'graveyard') {
                setBackground(graveyard);
            }
        }
    }, [isLoading, gameSettings]);
    if (isLoading) {
        <Loading/>
    }
    return (
        <div className="pingponggame-container" style={{ backgroundImage: `url(${background})` }}>
            {/* <Loading/> */}
            <GameLogic paddleColor={paddle}/>
        </div>
    );
};

export default BOT;
