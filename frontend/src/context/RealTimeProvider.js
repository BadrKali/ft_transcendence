import React, { createContext, useEffect, useContext, useState } from 'react';
import useAuth from '../hooks/useAuth';

const RealTimeContext = createContext({});

export const RealTimeProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [friendsStatus, setFriendsStatus] = useState({});
    const { auth } = useAuth();

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${auth.accessToken}`);

        ws.onopen = () => {
            console.log("Client Connected to the server");
        };

        ws.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            if (dataFromServer.type === 'status_update') {
                const { user_id, status } = dataFromServer;
                setFriendsStatus(prevStatus => {
                    const newStatus = {
                        ...prevStatus,
                        [user_id]: status
                    };
                    return newStatus
                    // console.log('Updated friendsStatus:', newStatus);
                });
            } else if (dataFromServer.type === 'notification') {
                setNotifications(prevNotifications => [
                    ...prevNotifications,
                    dataFromServer.message
                ]);
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
        <RealTimeContext.Provider value={{ setNotifications, notifications, friendsStatus }}>
            {children}
        </RealTimeContext.Provider>
    );
};

export const useRealTime = () => {
    return useContext(RealTimeContext);
};

export default RealTimeProvider;


