import React, { useState } from 'react';

const Paddles = ({ onPaddleSelect }) => {
    const paddleColors = ['#BC4F00', '#036145', '#8D0202', '#002194'];

    const [selectedColor, setSelectedColor] = useState(paddleColors[0]);

    const handlePaddleClick = (color) => {
        setSelectedColor(color);
        onPaddleSelect(color);
    };

    return (
        <div className="paddle-container">
            <h2>Paddle</h2>
            <div className="paddle-selector">
                {paddleColors.map((color, index) => (
                    <div 
                        key={index}
                        className={`paddle-display ${selectedColor === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handlePaddleClick(color)}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default Paddles;