import React, { useState } from 'react';
import leftArrow from '../../Game-assets/left-arrow.png';
import rightArrow from '../../Game-assets/right-arrow.png';

const PickTools = ({className}) => {
  const paddleColors = ['#BC4F00', '#33FF57', '#3357FF', '#F3FF33', '#FF33F5'];
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const handleLeftClick = () => {
    setCurrentColorIndex((prevIndex) => (prevIndex - 1 + paddleColors.length) % paddleColors.length);
  };

  const handleRightClick = () => {
    setCurrentColorIndex((prevIndex) => (prevIndex + 1) % paddleColors.length);
  };

  return (
    <div className={className}>
        <h2>Paddle</h2>
        <div className="paddle-selector">
            <img src={leftArrow} alt="Left Arrow" onClick={handleLeftClick} className="arrow-icon" />
            <div className="paddle-display" style={{ backgroundColor: paddleColors[currentColorIndex] }}></div>
            <img src={rightArrow} alt="Right Arrow" onClick={handleRightClick} className="arrow-icon" />
        </div>
    </div>

  );
};

export default PickTools;
