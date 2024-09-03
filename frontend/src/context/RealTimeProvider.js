import React, { createContext, useEffect, useContext, useState } from 'react';
import useAuth from '../hooks/useAuth';
import ToastContainer from '../components/ReactToastify/ToastContainer';
import GameChallengeNotification from '../components/Notification/GameChallengeNotification';
import { SuccessToast } from '../components/ReactToastify/SuccessToast'
import { ErrorToast } from '../components/ReactToastify/ErrorToast'
import {InfoToast} from '../components/ReactToastify/InfoToast';
import GameSettingsPopUp from '../components/GameSettingsPopUp/GameSettingsPopUp';
import { UserContext } from './UserContext';

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
    const {updateUserNotification} =  useContext(UserContext)

    const [shouldFetchNotifications, setShouldFetchNotifications] = useState(false);


    useEffect(() => {
        if (shouldFetchNotifications) {
            const fetchNotifications = async () => {
                try {
                    const response = await fetch(`${BACKEND_URL}/user/notifications/`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth.accessToken}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch notifications');
                    }
                    const NotificationFetch = await response.json();
                    console.log(NotificationFetch)
                    updateUserNotification(NotificationFetch);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                } finally {
                    setShouldFetchNotifications(false);
                }
            };
    
            fetchNotifications();
        }
    }, [shouldFetchNotifications]);
    
    const clearNotification = () => {
        setHasNotification(false);
    };

    useEffect(() => {
        if (!auth.accessToken) {
            return;
        }
        const ws = new WebSocket(`${WS_BACKEND_URL}/ws/notifications/?token=${auth.accessToken}`);

        ws.onopen = async () => {
            console.log("Client Connected to the server");
        
            try {
                const response = await fetch(`${BACKEND_URL}/user/missed-notifications/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.accessToken}`
                    }
                });
        
                if (response.ok) {
                    const data = await response.json();
                    if (data.hasNotification) {
                        setHasNotification(true);  
                        // setNotifications(data.notifications);  
                        console.log(data)
                    }
                } else {
                    console.error('Failed to fetch missed notifications');
                }
            } catch (error) {
                console.error('Error fetching missed notifications:', error);
            }
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
                    setShouldFetchNotifications(true);
            
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
