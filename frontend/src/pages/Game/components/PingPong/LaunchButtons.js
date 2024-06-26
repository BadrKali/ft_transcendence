import React, { useState } from "react";
import ErrorModal from "./ErrorModal";
import PlayerSelection from "./PlayerSelection";

const LaunchButtons = ({ selectedMode, selectedBackground, selectedKeys, className }) => {
    const [showModal, setShowModal] = useState(false);
    const [showPlayerSelection, setShowPlayerSelection] = useState(false);

    const handleLaunchGame = () => {
        if (!selectedBackground || !selectedKeys) {
            setShowModal(true);
        } else if (selectedMode === 'Invite') {
            setShowPlayerSelection(true);
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
