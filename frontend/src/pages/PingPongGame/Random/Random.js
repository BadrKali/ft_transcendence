import React, { useEffect, useState, useRef } from 'react';
import useAuth from '../../../hooks/useAuth';
import hell from "../asstes/hell.png";
import forest from "../asstes/forest.png";
import graveyard from "../asstes/graveyard.png";
import useFetch from '../../../hooks/useFetch';
import "./random.css";
import Waiting from './Waiting';
import PlayerInfo from './PlayerInfo';
import ScoreBoard from "../components/ScoreBoard";
import avatar1 from '../asstes/avatar1.png';
import avatar2 from '../asstes/avatar2.png';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WS_BACKEND_URL = process.env.REACT_APP_WS_BACKEND_URL;



const Random = () => {
    const { data: gameSettings, isLoading: gameSettingsLoading } = useFetch(`${BACKEND_URL}/api/game/game-settings/current-user/`);
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
    const [game_state, setGameState] = useState(null);
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const canvasRef = useRef(null);

    const { data: room, isLoading: roomLoading, error: roomError } = useFetch(roomId ? `${BACKEND_URL}/api/game/game-room/${roomId}` : null);
    const { data: player1, isLoading: player1Loading, error: player1Error } = useFetch(player1Id ? `${BACKEND_URL}/user/stats/${player1Id}` : null);
    const { data: player2, isLoading: player2Loading, error: player2Error } = useFetch(player2Id ? `${BACKEND_URL}/user/stats/${player2Id}` : null);
    const { data: currentUser, isLoading:currentIsLoading, error: currentError } = useFetch(`${BACKEND_URL}/user/stats`);

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

        const socket = new WebSocket(`${WS_BACKEND_URL}/ws/game/?token=${auth.accessToken}`);
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
            } else if (data.action === 'update_game_state')  {
                setGameState(data.game_state);
            } else if (data.action === 'update_player_movement') {
                setGameState(data.game_state);
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

    useEffect(() => {
        if (!game_state || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = game_state.canvas.width;
        canvas.height = game_state.canvas.height;

        const ball = game_state.ball;
        const net = game_state.net;

        const user1 = game_state.players[player1?.username];
        const user2 = game_state.players[player2?.username];
        setScore1(user1.score)
        setScore2(user2.score)
        console.log('Game State:', game_state);
        console.log('Player 1:', user1);
        console.log('Player 2:', user2);

        function drawRect(x, y, w, h, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        }

        function drawArc(x, y, r, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }

        function drawNet() {
            for (let i = 0; i <= canvas.height; i += net.height * 2) {
                drawRect(net.x, net.y + i, net.width, net.height, net.color);
            }
        }

        function handleKeyDown(evt) {
            if (keys === "ws") {
                switch (evt.key) {
                    case 'w':
                        sendPlayerMovement(currentUser?.username, "up");
                        break;
                    case 's':
                        sendPlayerMovement(currentUser?.username, "down");
                        break;
                    default:
                        break;
                }
            } else {
                switch (evt.key) {
                    case 'ArrowUp':
                        sendPlayerMovement(currentUser?.username, "up");
                        break;
                    case 'ArrowDown':
                        sendPlayerMovement(currentUser?.username, "down");
                        break;
                    default:
                        break;
                }
            }
        }

        function sendPlayerMovement(username, direction) {
            if (socket && username) {
                socket.send(JSON.stringify({ 
                    action: 'player_movement',
                    user: username,
                    direction: direction,
                }));
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(22, 22, 37, 0.9)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawNet();

            if (user1) {
                ctx.fillStyle = user1.color;
                drawRoundedRect(user1.x, user1.y, user1.width, user1.height, 9);
            }

            if (user2) {
                ctx.fillStyle = user2.color;
                drawRoundedRect(user2.x, user2.y, user2.width, user2.height, 9);
            }

            drawArc(ball.x, ball.y, ball.radius, ball.color);
        }

        function drawRoundedRect(x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
        }

        let framePerSecond = 50;
        let interval = 1000 / framePerSecond;
        let lastTime = Date.now();

        function loop() {
            const now = Date.now();
            const deltaTime = now - lastTime;

            if (deltaTime > interval) {
                render();
                lastTime = now - (deltaTime % interval);
            }

            requestAnimationFrame(loop);
        }

        loop();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [game_state, player1, player2]);

    return (
        <div className="pingponggame-container random-game" style={{ backgroundImage: `url(${background})` }}>
            {room && player1 && player2 && (
                <div className="player-info-container">
                    <PlayerInfo player1={player1} player2={player2} onStartGame={handleStartGame} socket={socket}/>
                </div>
            )}
            {showWaiting && (
                <Waiting player={currentUser}/>
            )}
            {startGame && (
                <>
                    <ScoreBoard
                        user1Score={score1}
                        user2Score={score2}
                        user1Name={player1.username}
                        user2Name={player2.username}
                        user1Avatar={avatar1}
                        user2Avatar={avatar2}
                    />
                    <div className="game-container">
                        <canvas className='canvas-container' ref={canvasRef}></canvas>
                        <h1>{message}</h1>
                    </div>
                </>
            )}
        </div> 
    );
};

export default Random;
