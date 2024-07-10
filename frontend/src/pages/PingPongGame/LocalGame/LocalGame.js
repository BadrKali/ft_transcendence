import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./localgame.css";
import hell from "../asstes/hell.png";
import forest from "../asstes/forest.png";
import graveyard from "../asstes/graveyard.png";
import ScoreBoard from '../components/ScoreBoard';
import Timeout from '../components/TimeOut';
import avatar from "../asstes/avatar3.png";
import pongy from "../asstes/pongy.png";
import exit from "../asstes/right-arrow.png"
import useFetch from '../../../hooks/useFetch';
import LocalGameLogic from './LocalGameLogic';
import Loading from '../components/Loading';


const LocalGame = () => {
    const { data: gameSettings, isLoading, error } = useFetch('http://localhost:8000/api/game/game-settings/current-user/');
    const [background, setBackground] = useState(null);
    const [paddle, setPaddle] = useState(null);
    const [keys, setKeys] = useState(null);
    const [username, setUserName] = useState('');
    useEffect(() => {
        if (!isLoading && gameSettings) {
            if (gameSettings.background === 'hell') {
                setBackground(hell);
            } else if (gameSettings.background === 'forest') {
                setBackground(forest);
            } else if (gameSettings.background === 'graveyard') {
                setBackground(graveyard);
            }
            setPaddle(gameSettings.paddle)
            setKeys(gameSettings.keys)
            setUserName(gameSettings.user_name)
        }
    }, [isLoading, gameSettings]);
    if (isLoading | !paddle | !keys) {
        <Loading/>
    }
    return (
        <div className="pingponggame-container" style={{ backgroundImage: `url(${background})` }}>
            {paddle && keys && username && <LocalGameLogic paddleColor={paddle} keys={keys} username={username}/>}
        </div>
    );
};

export default LocalGame;
