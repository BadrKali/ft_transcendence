import React, {useState} from 'react';
import Underground from './UnderGround';
import hell from '../../Game-assets/hell.png';
import forest from '../../Game-assets/forest.png';
import graveyard from '../../Game-assets/graveyard.png';
import LaunchButtons from './LaunchButtons';
import ToolsContainer from './ToolsContainer';
import GameMode from './GameMode';
const PingPong = () => {
    const [selectedBackground, setSelectedBackground] = useState(null);
    const handleBackgroundSelect = (background) => {
        setSelectedBackground(background);
    };
    return (
        <div className="PingPong-container">
            <h1>Customise Your game</h1>
            <div className="game-cutomisation">
                <Underground 
                    hell={hell}
                    forest={forest}
                    graveyard={graveyard}
                    onBackgroundSelect={handleBackgroundSelect} />
                    {/* <LaunchButtons selectedBackground={selectedBackground} className="launchButtons-container"/> */}
            </div>
            <div className="tools-section">
                <ToolsContainer className="toolsContainer"/>
                <GameMode className="gameModeContainer"/>
            </div>
        </div>
    );
}

export default PingPong;