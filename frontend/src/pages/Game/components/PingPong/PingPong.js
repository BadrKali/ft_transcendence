import React, {useState} from 'react';
import Underground from './UnderGround';
import PickTools from './PickTools';
import hell from '../../Game-assets/hell.png';
import forest from '../../Game-assets/forest.png';
import graveyard from '../../Game-assets/graveyard.png';
import LaunchButtons from './LaunchButtons';
const PingPong = () => {
    const [selectedBackground, setSelectedBackground] = useState(null);
    const handleBackgroundSelect = (background) => {
        setSelectedBackground(background);
    };
    return (
        <div className="PingPong-container">
            <h1>Choose Your Arena</h1>
            <Underground 
                hell={hell}
                forest={forest}
                graveyard={graveyard}
                onBackgroundSelect={handleBackgroundSelect} />
            <div className="tools-section">
                <PickTools className="tools-container"/>
                <LaunchButtons selectedBackground={selectedBackground} className="launchButtons-container"/>
            </div>
        </div>
    );
}

export default PingPong;