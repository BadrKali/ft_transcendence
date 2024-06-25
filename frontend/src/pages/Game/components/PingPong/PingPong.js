import React, {useState} from 'react';
import Underground from './UnderGround';
import PickTools from './PickTools';
import hell from '../../Game-assets/hell.png';
import forest from '../../Game-assets/forest.png';
import graveyard from '../../Game-assets/graveyard.png';
import LaunchButtons from './LaunchButtons';
import ToolsContainer from './ToolsContainer';
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
                {/* <div className="tools-section">
                    <ToolsContainer className="toolsContainer"/>
                </div> */}
                    {/* <LaunchButtons selectedBackground={selectedBackground} className="launchButtons-container"/> */}
            </div>
        </div>
    );
}

export default PingPong;