import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorModal from "./ErrorModal";
import PlayerSelection from "./PlayerSelection";
import Loading from "../../../PingPongGame/components/Loading";
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LaunchButtons = ({ selectedMode, selectedBackground, selectedKeys, className, onLaunch }) => {
    const [showModal, setShowModal] = useState(false);
    const [showPlayerSelection, setShowPlayerSelection] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { auth } = useAuth();

    const checkInviteRoom = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/game/check-invite-room`, {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`,
                }
            });
            setIsLoading(false);
            return response.data;
        } catch (error) {
            console.error("Failed to check invite room:", error);
            setIsLoading(false);
            return { exists: false };
        }
    };

    const handleLaunchGame = async () => {
        onLaunch();
        if (!selectedBackground || !selectedKeys) {
            setShowModal(true);
            return;
        }

        setIsLoading(true);
        setTimeout(async () => {
            setIsLoading(false);
            if (selectedMode === 'Invite') {
                const check = await checkInviteRoom();
                if (check.exists) {
                    navigate("/invite-game-reconnection");
                } else {
                    setShowPlayerSelection(true);
                }
            } else if (selectedMode === 'Pongy!') {
                navigate("/bot-game");
            } else if (selectedMode === 'Local') {
                navigate("/local-game");
            } else if (selectedMode === 'Random') {
                navigate("/random-game");
            }
        }, 1000);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handlePlayerSelect = () => {
        setShowPlayerSelection(false);
    };

    // if (isLoading) {
    //     return <Loading />;
    // }

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