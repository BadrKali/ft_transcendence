import React, { useState } from "react";
import local from "../../Game-assets/local.png";
import invite from "../../Game-assets/invite.png";
import pongy from "../../Game-assets/pongy.png";
import leftArrow from "../../Game-assets/leftFlesh.png";
import rightArrow from "../../Game-assets/rightFlesh.png";

const GameMode = ({ className }) => {
    const modes = [
        { name: "Invite", img: invite },
        { name: "Local", img: local },
        { name: "Pongy!", img: pongy }
    ];
    const [selectedModeIndex, setSelectedModeIndex] = useState(0);

    const handleLeftClick = () => {
        setSelectedModeIndex((prevIndex) => (prevIndex === 0 ? modes.length - 1 : prevIndex - 1));
    };

    const handleRightClick = () => {
        setSelectedModeIndex((prevIndex) => (prevIndex === modes.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className={`${className} gameModeContainer`}>
            <h1 className="title">Game Mode</h1>
            <div className="mode-selector">
                <img 
                    src={leftArrow} 
                    className="arrow-icon" 
                    alt="Left Arrow" 
                    onClick={handleLeftClick} 
                />
                <div className="mode-display">
                    <div className="mode-image-container">
                        <img 
                            src={modes[selectedModeIndex].img} 
                            alt={modes[selectedModeIndex].name} 
                            className="mode-image" 
                        />
                    </div>
                    <h1 className="mode-title">{modes[selectedModeIndex].name}</h1>
                </div>
                <img 
                    src={rightArrow} 
                    className="arrow-icon" 
                    alt="Right Arrow" 
                    onClick={handleRightClick} 
                />
            </div>
        </div>
    );
}

export default GameMode;
