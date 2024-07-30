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
    const [game_state, setGameState] = useState(null);
    const canvasRef = useRef(null);

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
            } else if (data.action === 'update_game_state')  {
                setGameState(data.game_state);
                setMessage("Game_state received");
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
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = game_state.canvas.width;
        canvas.height = game_state.canvas.height;

        const ball = game_state.ball;
        const net = game_state.net;
        const user1 = game_state.players[player1.username]
        const user2 = game_state.players[player2.username]

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

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(22, 22, 37, 0.9)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawNet();
            ctx.fillStyle = user1.color;
            drawRoundedRect(user1.x, user1.y, user1.width, user1.height, 9);
            ctx.fillStyle = user2.color;
            drawRoundedRect(user2.x, user2.y, user2.width, user2.height, 9);
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
        // function game() {
        //     render();
        // }
        let framePerSecond = 100;
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
    }, [game_state]);

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
                        user1Score={0}
                        user2Score={0}
                        user1Name={player1.username}
                        user2Name={player2.username}
                        user1Avatar={avatar1}
                        user2Avatar={avatar2}
                    />
                    <div className="game-container">
                        <canvas className='canvas-container' ref={canvasRef}></canvas>
                        {/* <h1>{}</h1> */}
                    </div>
                </>
            )}
        </div> 
    );
};

export default Random;
