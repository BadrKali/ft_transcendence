import React, {useState} from "react";
import leftArrow from '../../Game-assets/left-arrow.png';
import rightArrow from '../../Game-assets/right-arrow.png';
import sKey from '../../Game-assets/s.png';
import upKey from '../../Game-assets/up.png';
import downKey from '../../Game-assets/down.png';
import wKey from '../../Game-assets/w.png';

const ToolsContainer = ( {className, onPaddleSelect, onKeysSelect}) => {
    const paddleColors = ['#BC4F00', '#33FF57', '#3357FF', '#F3FF33', '#FF33F5'];
    const [currentColorIndex, setCurrentColorIndex] = useState(0);

    const handleLeftClick = () => {
        setCurrentColorIndex((prevIndex) => (prevIndex - 1 + paddleColors.length) % paddleColors.length);
        onPaddleSelect(paddleColors[(currentColorIndex - 1 + paddleColors.length) % paddleColors.length]);
    };

    const handleRightClick = () => {
        setCurrentColorIndex((prevIndex) => (prevIndex + 1) % paddleColors.length);
        onPaddleSelect((prevIndex) => (prevIndex + 1) % paddleColors.length);
    };

    const [selectedOption, setSelectedOption] = useState(null);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        onKeysSelect(option);
    };

    return (
        <div className={className}>
            <div className="keys-container">
                <h1>Keys</h1>
                <div className="keys-selection">
                    <div className={`ws-container container ${selectedOption === 'ws' ? 'selectedOption' : ''}`} onClick={() => handleSelectOption('ws')}>
                        <img src={wKey} alt="" className='key' />
                        <img src={sKey} alt="" className='key' />
                    </div>
                    <div className={`up-down-container container ${selectedOption === 'up-down' ? 'selectedOption' : ''}`} onClick={() => handleSelectOption('up-down')}>
                        <img src={upKey} alt="" className='key' />
                        <img src={downKey} alt="" className='key' />
                    </div>
                </div>
            </div>
            <div className="paddle-container">
                <h2>Paddle</h2>
                <div className="paddle-selector">
                    <img src={leftArrow} alt="Left Arrow" onClick={handleLeftClick} className="arrow-icon" />
                    <div className="paddle-display" style={{ backgroundColor: paddleColors[currentColorIndex] }}></div>
                    <img src={rightArrow} alt="Right Arrow" onClick={handleRightClick} className="arrow-icon" />
                </div>
            </div>
        </div>
    );
}
 
export default ToolsContainer;