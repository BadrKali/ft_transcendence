import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import hell from "../asstes/hell.png";
import forest from "../asstes/forest.png";
import graveyard from "../asstes/graveyard.png";
import useFetch from '../../../hooks/useFetch';
import "./random.css"

const Random = () => {
    const { data: gameSettings, isLoading, error } = useFetch('http://localhost:8000/api/game/game-settings/current-user/');
    const { data: player, playerIsLoading, playerError } = useFetch('http://localhost:8000/user/stats/');
    const { auth } = useAuth();
    const [message, setMessage] = useState("");
    const [background, setBackground] = useState(null);
    const [paddle, setPaddle] = useState(null);
    const [keys, setKeys] = useState(null);
    const [username, setUserName] = useState('');
    const [room, setRoom] = useState(null);
    useEffect(() => {
        if (!isLoading && gameSettings) {
            if (gameSettings.background === 'hell') {
                setBackground(hell);
            } else if (gameSettings.background === 'forest') {
                setBackground(forest);
            } else if (gameSettings.background === 'graveyard') {
                setBackground(graveyard);
            }
            setPaddle(gameSettings.paddle)
            setKeys(gameSettings.keys)
            setUserName(gameSettings.user_name)
        }
    }, [isLoading, gameSettings]);
    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws/game/?token=${auth.accessToken}`);
        socket.onopen = () => {
            setMessage("WebSocket connection established");
            console.log("WebSocket connection established.");
            socket.send(JSON.stringify({ action: 'random' }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received:", data);
            if (data.action === 'start_game') {
                setMessage(`Game starting in room: ${data.room_id}`);
            } else if (data.message) {
                setMessage(data.message);
            }
        };

        socket.onclose = (event) => {
            setMessage("WebSocket connection closed");
            console.log("WebSocket connection closed:", event);
        };

        socket.onerror = (error) => {
            setMessage("WebSocket connection error");
            console.log("WebSocket error:", error);
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="pingponggame-container random-game" style={{ backgroundImage: `url(${background})` }}>
            <h1>{message || "Searching for a game..."}</h1>
            {/* {playerIsLoading && <p>Loading...</p>}
            {playerError && <p>Error: {playerError.message}</p>}
            {player && (
                <h1>{JSON.stringify(player, null, 2)}</h1>
            )} */}
        </div>
    );
}

export default Random;
