import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import hell from "../asstes/hell.png";
import forest from "../asstes/forest.png";
import graveyard from "../asstes/graveyard.png";
import useFetch from '../../../hooks/useFetch';
import "./random.css";
import Waiting from './Waiting';
import PlayerInfo from './PlayerInfo';
import GameLogic from './GameLogic';

const Random = () => {
    const { data: gameSettings, isLoading: gameSettingsLoading } = useFetch('http://localhost:8000/api/game/game-settings/current-user/');
    const { auth } = useAuth();
    const [message, setMessage] = useState("");
    const [background, setBackground] = useState(null);
    const [paddle, setPaddle] = useState(null);
    const [keys, setKeys] = useState(null);
    const [username, setUserName] = useState('');
    const [roomId, setRoomId] = useState(null);
    const [player1Id, setPlayer1Id] = useState(null);
    const [player2Id, setPlayer2Id] = useState(null);
    const [showWaiting, setShowWaiting] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [socket, setSocket] = useState(null);
    const [game_state, setGameState ] = useState(null);
    const { data: room, isLoading: roomLoading, error: roomError } = useFetch(roomId ? `http://localhost:8000/api/game/game-room/${roomId}` : null);
    const { data: player1, isLoading: player1Loading, error: player1Error } = useFetch(player1Id ? `http://localhost:8000/user/stats/${player1Id}` : null);
    const { data: player2, isLoading: player2Loading, error: player2Error } = useFetch(player2Id ? `http://localhost:8000/user/stats/${player2Id}` : null);
    const { data: currentUser, isLoading:currentIsLoading, error: currentError } = useFetch(`http://localhost:8000/user/stats`);

    const handleStartGame = () => {
        setStartGame(true);
    }

    useEffect(() => {
        if (!gameSettingsLoading && gameSettings) {
            if (gameSettings.background === 'hell') {
                setBackground(hell);
            } else if (gameSettings.background === 'forest') {
                setBackground(forest);
            } else if (gameSettings.background === 'graveyard') {
                setBackground(graveyard);
            }
            setPaddle(gameSettings.paddle);
            setKeys(gameSettings.keys);
            setUserName(gameSettings.user_name);
        }
    }, [gameSettingsLoading, gameSettings]);

    useEffect(() => {
        if (!auth.accessToken) return;

        const socket = new WebSocket(`ws://localhost:8000/ws/game/?token=${auth.accessToken}`);
        setSocket(socket);

        socket.onopen = () => {
            socket.send(JSON.stringify({ action: 'random' }));
        };
        
        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.action === 'start_game') {
                setShowWaiting(false);
                setRoomId(data.room_id);
                setPlayer1Id(data.player1_id);
                setPlayer2Id(data.player2_id);
                setGameState(data.game_state);
            } else if (data.action === 'connected') {
                setShowWaiting(true);
                setRoomId(data.room_id);
            } else if (data.message) {
                setMessage(data.message);
            }
        };

        socket.onclose = () => {
            setMessage("WebSocket connection closed");
        };
        
        socket.onerror = (error) => {
            setMessage("WebSocket connection error");
        };
        
        return () => {
            socket.close();
        };
    }, [auth.accessToken]);

    useEffect(() => {
        if (room) {
            setPlayer1Id(room.player1);
            setPlayer2Id(room.player2);
        }
    }, [room]);

    return (
        <div className="pingponggame-container random-game" style={{ backgroundImage: `url(${background})` }}>
            {room && player1 && player2 && (
                <div className="player-info-container">
                    <PlayerInfo player1={player1} player2={player2} onStartGame={handleStartGame}/>
                </div>
            )}
            {showWaiting && (
                <Waiting player={currentUser}/>
            )}
            {startGame && (
                <GameLogic
                    player1={player1}
                    player2={player2}
                    game_state={game_state}
                />
            )}
        </div> 
    );
};

export default Random;
