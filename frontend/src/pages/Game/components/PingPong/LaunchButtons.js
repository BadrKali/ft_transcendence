import React, {useState} from "react";
import ErrorModal from "./ErrorModal";
const LaunchButtons = ({selectedBackground, className}) => {
    const [showModal, setShowModal] = useState(false);
    const handleLaunchGame = () => {
        if (!selectedBackground) {
          setShowModal(true);
        }
      };
    const closeModal = () => {
        setShowModal(false);
    };
    return (
        <div className={className}>
            <div>
                <button onClick={handleLaunchGame} className="play-button buttons">Play</button>
                {showModal && (
                    <ErrorModal 
                    onClose={closeModal} 
                    />
                )}
            </div>
            <div>
                <button onClick={handleLaunchGame} className="aIBattle-button buttons">AI Battle</button>
                {showModal && (
                    <ErrorModal 
                    onClose={closeModal}
                    />
                )}
            </div>
        </div>
    );
}
 
export default LaunchButtons;