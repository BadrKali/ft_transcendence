import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorModal from "./ErrorModal";
import PlayerSelection from "./PlayerSelection";

const LaunchButtons = ({ selectedMode, selectedBackground, selectedKeys, className }) => {
    const [showModal, setShowModal] = useState(false);
    const [showPlayerSelection, setShowPlayerSelection] = useState(false);
    const navigate = useNavigate();
    const handleLaunchGame = () => {
        if (!selectedBackground || !selectedKeys) {
            setShowModal(true);
        } else if (selectedMode === 'Invite') {
            setShowPlayerSelection(true);
        } else if (selectedMode === 'Pongy!') {
            navigate("/pingponggame");
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handlePlayerSelect = () => {
        setShowPlayerSelection(false);
    };

    return (
        <div className={className}>
            <div>
                <button onClick={handleLaunchGame} className="play-button buttons">Play</button>
                {showModal && (
                    <ErrorModal onClose={closeModal} />
                )}
                {showPlayerSelection && (
                    <PlayerSelection onPlayerSelect={handlePlayerSelect} onCancel={() => setShowPlayerSelection(false)} />
                )}
            </div>
        </div>
    );
};

export default LaunchButtons;
