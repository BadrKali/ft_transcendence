import React, { createContext, useEffect, useContext, useState } from 'react';
import useAuth from '../hooks/useAuth';
import ToastContainer from '../components/ReactToastify/ToastContainer';
import GameChallengeNotification from '../components/Notification/GameChallengeNotification';
import { SuccessToast } from '../components/ReactToastify/SuccessToast'
import { ErrorToast } from '../components/ReactToastify/ErrorToast'
import {InfoToast} from '../components/ReactToastify/InfoToast';
import GameSettingsPopUp from '../components/GameSettingsPopUp/GameSettingsPopUp';
const WS_BACKEND_URL = process.env.REACT_APP_WS_BACKEND_URL;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const RealTimeContext = createContext({});

export const RealTimeProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [friendsStatus, setFriendsStatus] = useState({});
    const { auth } = useAuth();
    const [hasNotification, setHasNotification] = useState(false);
    const [gameChallenge, setGameChallenge] = useState(null);
    const [gameAccepted, setGameAccepted] = useState(false);
    const [joinGame, setJoinGame] = useState(false);
    const [showGameSettings, setShowGameSettings] = useState(false);
    const clearNotification = () => {
        setHasNotification(false);
    };

    useEffect(() => {
        if (!auth.accessToken) {
            return;
        }
        const ws = new WebSocket(`${WS_BACKEND_URL}/ws/notifications/?token=${auth.accessToken}`);

        ws.onopen = () => {
            console.log("Client Connected to the server");
        };

        ws.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log({dataFromServer});
            if (dataFromServer.type === 'match_notification') {
                setGameChallenge(dataFromServer);
            } else if (dataFromServer.type === 'status_update') {
                const { user_id, status } = dataFromServer;
                setFriendsStatus(prevStatus => ({
                    ...prevStatus,
                    [user_id]: status
                }));
            } else if (dataFromServer.type === 'notification') {
                setHasNotification(true);
                console.log(dataFromServer)
                // InfoToast("You have a new notification"); //add it here
            } else if (dataFromServer.type === 'join_game') {
                console.log("Joining Game From RealTimeProvider");
                setJoinGame(true);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket Client Disconnected');
        };

        ws.onerror = (error) => {
            console.error("WebSocket Error: ", error);
        };

        return () => {
            ws.close();
        };
    }, [auth.accessToken]);

    const handleAcceptGame = (id) => {
        setGameChallenge(null);
        let url = `${BACKEND_URL}/api/game/game-challenges/${id}/response/`;
        let body = JSON.stringify({ 'status': 'accepted' });
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            },
            body: body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Game challenge accepted:', data);
            setShowGameSettings(true);
        })
        .catch(error => {
            console.error('Error accepting game challenge:', error);
        });
        fetch(`${BACKEND_URL}/api/game/game-response/${id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            },
            body: body
        })
    }
    const handleRejectGame = (id) => {
        setGameChallenge(null);
        let url = `${BACKEND_URL}/api/game/game-challenges/${id}/response/`;
        let body = JSON.stringify({ 'status': 'rejected' });
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            },
            body: body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Game challenge rejected:', data);
            SuccessToast('Game challenge rejected');
        })
        .catch(error => {
            console.error('Error rejecting game challenge:', error);
        });
    }
    const handleExitGameSettings = () => {
        setShowGameSettings(false);
    }
return (
        <RealTimeContext.Provider value={{ setNotifications, notifications, friendsStatus, hasNotification, setHasNotification, clearNotification, gameChallenge, handleAcceptGame, handleRejectGame, gameAccepted, joinGame, setGameAccepted, setJoinGame, showGameSettings, setShowGameSettings }}>
            {children}
            <ToastContainer />
            {showGameSettings && (
                <GameSettingsPopUp onExit={handleExitGameSettings}/>
            )}
        </RealTimeContext.Provider>
    );
};

export const useRealTime = () => {
    return useContext(RealTimeContext);
};

export default RealTimeProvider;
