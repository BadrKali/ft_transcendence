import React from 'react';
import './game-end-pop-up.css';

const GameEndPopup = ({ winner, loser, onClose }) => {
    return (
        <div className="popup-container">
            <div className="popup-content">
                <h2>Game Over</h2>
                <p>Winner: {winner}</p>
                <p>Loser: {loser}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default GameEndPopup;
