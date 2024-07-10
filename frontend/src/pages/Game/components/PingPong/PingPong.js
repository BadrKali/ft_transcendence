import React, { useState } from 'react';
import Underground from './UnderGround';
import hell from '../../Game-assets/hell.png';
import forest from '../../Game-assets/forest.png';
import graveyard from '../../Game-assets/graveyard.png';
import LaunchButtons from './LaunchButtons';
import ToolsContainer from './ToolsContainer';
import GameMode from './GameMode';
import axios from 'axios';
import useAuth from "../../../../hooks/useAuth.js";

const PingPong = () => {
    const { auth } = useAuth();
    const [selectedBackground, setSelectedBackground] = useState(null);
    const handleBackgroundSelect = (background) => {
        setSelectedBackground(background);
    };

    const [selectedPaddle, setSelectedPaddle] = useState("#BC4F00");
    const handlePaddleSelect = (paddle) => {
        setSelectedPaddle(paddle);
    };

    const [selectedKeys, setSelectedKeys] = useState(null);
    const handleKeysSelect = (keys) => {
        setSelectedKeys(keys);
    };

    const [selectedMode, setSelectedMode] = useState("Invite");
    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
    };

    const handleLaunchGame = async () =>{
        const gameSettings = {
            background: selectedBackground,
            paddle: selectedPaddle,
            keys: selectedKeys,
            gameMode: selectedMode,
        }
        try  {
            const response = await axios.post('http://localhost:8000/api/game/game-settings/current-user/', gameSettings, {
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`,
                }
            });
            console.log("Game Settings saved", response.data);
        } catch (error) {
            console.log("Failed to save game settings");
        }
    }
    return (
        <div className="PingPong-container">
            <h1>Customise Your Game</h1>
            <div className="game-cutomisation">
                <Underground 
                    hell={hell}
                    forest={forest}
                    graveyard={graveyard}
                    onBackgroundSelect={handleBackgroundSelect} 
                />
            </div>
            <div className="tools-section">
                <ToolsContainer 
                    className="toolsContainer" 
                    onPaddleSelect={handlePaddleSelect} 
                    onKeysSelect={handleKeysSelect}
                />
                <GameMode 
                    className="gameModeContainer" 
                    setSelectedMode={handleModeSelect}
                />
                <LaunchButtons 
                    selectedMode={selectedMode} 
                    selectedBackground={selectedBackground} 
                    selectedKeys={selectedKeys} 
                    className="launchButtons-container"
                    onLaunch={handleLaunchGame}
                />
            </div>
        </div>
    );
};

export default PingPong;
