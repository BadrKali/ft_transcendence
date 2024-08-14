import React, { createContext, useEffect, useContext, useState } from 'react';
import useAuth from '../hooks/useAuth';
import ToastContainer from '../components/ReactToastify/ToastContainer';
import {InfoToast} from '../components/ReactToastify/InfoToast';

const WS_BACKEND_URL = process.env.REACT_APP_WS_BACKEND_URL;
export const RealTimeContext = createContext({});

export const RealTimeProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [friendsStatus, setFriendsStatus] = useState({});
    const { auth } = useAuth();
    const [hasNotification, setHasNotification] = useState(false);

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
            if (dataFromServer.type === 'status_update') {
                const { user_id, status } = dataFromServer;
                setFriendsStatus(prevStatus => ({
                    ...prevStatus,
                    [user_id]: status
                }));
            } else if (dataFromServer.type === 'notification') {
                setHasNotification(true);
                InfoToast("You have a new notification"); //add it here

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

    return (
        <RealTimeContext.Provider value={{ setNotifications, notifications, friendsStatus, hasNotification, setHasNotification, clearNotification }}>
            {children}
            <ToastContainer />
        </RealTimeContext.Provider>
    );
};

export const useRealTime = () => {
    return useContext(RealTimeContext);
};

export default RealTimeProvider;
