import React, { useEffect, useState, useContext} from 'react';
import useAuth from '../../hooks/useAuth';
import { NotificationContext } from './NotificationContext';

const Notification = () => {
    const { auth } = useAuth();
    const { setHasNotification } = useContext(NotificationContext);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${auth.accessToken}`);

        ws.onopen = () => {
            console.log("WebSocket connected.");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);
            setHasNotification(true);
            alert(data.message);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected.");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        setSocket(ws);

        return () => {
            if (ws) {
                ws.close();
                console.log("WebSocket closed.");
            }
        };
    }, [auth.accessToken]);

    return null;
};

export default Notification;
