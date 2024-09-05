import React, { useEffect, useState, useRef } from 'react';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';
import Waiting from '../components/Waiting';
import PlayerInfo from '../components/PlayerInfo';
import ScoreBoard from "../components/ScoreBoard";
import { useNavigate } from 'react-router-dom';
import hell from "../asstes/hell.png";
import forest from "../asstes/forest.png";
import graveyard from "../asstes/graveyard.png";
import avatar1 from '../asstes/avatar1.png';
import avatar2 from '../asstes/avatar2.png';
import exit from "../asstes/right-arrow.png";
import MatchResult from '../components/MatchResult';
import "../stylesheet/game-style.css";
import WaitForReconnection from '../components/WaitForReconnection';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WS_BACKEND_URL = process.env.REACT_APP_WS_BACKEND_URL;

const RealTimeGame = ({ mode }) => {
    const [opponentDisconnected, showOpponentDisconnected] = useState(false);
    const [opponent, setOpponent] = useState(null);
    const [endPoint, setEndPoint] = useState("");
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [background, setBackground] = useState(null);
    const [keys, setKeys] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [player1Id, setPlayer1Id] = useState(null);
    const [player2Id, setPlayer2Id] = useState(null);
    const [showWaiting, setShowWaiting] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [socket, setSocket] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const canvasRef = useRef(null);
    const [gameRunning, setGameRunning] = useState(true);
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [backToLobby, setBackToLobby] = useState(false);
    const [pauseGame, setPauseGame] = useState(false);
    const [message, setMessage] = useState("");
    const [profileData, setProfileData] = useState(null);
    const [won, setWon] = useState(false);
    const [winner, setWinner] = useState("");
    useEffect(() => {
        switch (mode) {
            case "invite":
                setEndPoint("invite-game-room");
                break;
            case "random":
                setEndPoint("game-room");
                break;
            case "tournament":
                setEndPoint("tournament-room");
                break;
            default:
                setEndPoint("");
        }
    }, [mode]);

    const { data: gameSettings, isLoading: gameSettingsLoading } = useFetch(`${BACKEND_URL}/api/game/game-settings/current-user/`);
    const { data: room } = useFetch(roomId ? `${BACKEND_URL}/api/game/${endPoint}/${roomId}` : null);
    const { data: player1 } = useFetch(player1Id ? `${BACKEND_URL}/user/stats/${player1Id}` : null);
    const { data: player2 } = useFetch(player2Id ? `${BACKEND_URL}/user/stats/${player2Id}` : null);
    const { data: currentUser } = useFetch(`${BACKEND_URL}/user/stats`);

    useEffect(() => {
        if (currentUser) {
            setProfileData(currentUser);
        }
        if (currentUser === player1) {
            setOpponent(player2);
        } else {
            setOpponent(player1);
        }
    }, [currentUser, player1, player2])

    const initializeWebSocket = () => {
        const ws = new WebSocket(`${WS_BACKEND_URL}/ws/game/?token=${auth.accessToken}`);
        ws.onopen = () => ws.send(JSON.stringify({ action: mode}));
        ws.onmessage = handleWebSocketMessage;
        ws.onclose = () => console.log("WebSocket connection closed");
        ws.onerror = (error) => console.error("WebSocket connection error:", error);
        setSocket(ws);
        return () => ws.close();
    };

    const handleWebSocketMessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket Message:", data); 
        switch (data.action) {
            case 'start_game':
                startNewGame(data);
                break;
            case 'connected':
                setRoomId(data.room_id);
                setShowWaiting(true);
                break;
            case 'update_game_state':
            case 'update_player_movement':
                setGameState(data.game_state);
                break;
            case 'game_over':
                endGame(data);
                break;
            case 'opponent_disconnected':
                showOpponentDisconnected(true);
                break;
            case 'opponent_back':
                showOpponentDisconnected(false);
                break;
            default:
                if (data.message) {
                    alert(data.message);
                }
                break;
        }
    };

    const startNewGame = (data) => {
        setMessage("game Startd");
        setShowWaiting(false);
        setRoomId(data.room_id);
        setPlayer1Id(data.player1_id);
        setPlayer2Id(data.player2_id);
        setGameState(data.game_state);
    };

    const endGame = (data) => {
        setGameRunning(false);
        setWinner(data.winner);
        setShowResult(true);
    };

    const initializeCanvas = () => {
        setMessage("helo baby");
        if (!gameState || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = gameState.canvas.width;
        canvas.height = gameState.canvas.height;
        const { ball, net } = gameState;
        const user1 = gameState.players[player1?.username];
        const user2 = gameState.players[player2?.username];
        setScore1(user1?.score || 0);
        setScore2(user2?.score || 0);

        const drawRect = (x, y, w, h, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        };

        const drawArc = (x, y, r, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        };

        const drawRoundedRect = (x, y, width, height, radius) => {
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
        };

        const drawNet = () => {
            for (let i = 0; i <= canvas.height; i++) {
                drawRect(net.x, net.y + i, net.width, net.height, net.color);
            }
        };

        const render = () => {
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
        };

        const loop = () => {
            if (!gameRunning) return;
            render();
        };
        loop();
    };

    const handleKeyDown = (evt) => {
        let direction = null;
        switch(evt.key) {
            case 'w':
                direction = 'up'
                break
            case 's':
                direction = 'down'
                break
            case 'ArrowUp':
                direction = 'up'
                break
            case 'ArrowDown':
                direction = 'down'
                break
            default:
                break
        }

        if (direction) {
            sendPlayerMovement(currentUser?.username, direction);
        }
    };

    const sendPlayerMovement = (username, direction) => {
        if (socket && username) {
            socket.send(JSON.stringify({
                action: 'player_movement',
                user: username,
                direction: direction,
            }));
        }
    };

    const handleExitGame = () => {
        setPauseGame(true);
        setShowExitPopup(true);
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                socket?.send(JSON.stringify({ action: 'user_left' }));
            } else {
                socket?.send(JSON.stringify({ action: 'user_back' }));
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
    
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [socket]);

    const confirmExitGame = (confirm) => {
        setShowExitPopup(false);
        if (confirm) {
            setGameRunning(false);
            socket.close();
            navigate('/game', {replace:true})
        } else {
            setPauseGame(false);
        }
    };

    useEffect(() => {
        if (gameSettings && !gameSettingsLoading) {
            setBackground(gameSettings.background === 'hell' ? hell : gameSettings.background === 'forest' ? forest : graveyard);
            setKeys(gameSettings.keys);
        }
    }, [gameSettingsLoading, gameSettings]);

    useEffect(() => {
        if (auth.accessToken) {
            initializeWebSocket();
        }
        return () => socket?.close();
    }, [auth.accessToken]);

    useEffect(() => {
        if (room) {
            setPlayer1Id(room.player1);
            setPlayer2Id(room.player2);
        }
    }, [room]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [keys, currentUser]);

    useEffect(() => {
        initializeCanvas();
    }, [gameState, player1, player2, gameRunning]);

    const handleStartGame = () => {
        setStartGame(true);
    }
    const handleBackToLobby = () => {
        setShowResult(false);
        socket.close();
        navigate('/game', { replace:true});
    }
    return (
        <div className="pingponggame-container random-game" style={{ backgroundImage: `url(${background})` }}>
            {room && player1 && player2 && (
                <div className="player-info-container">
                    <PlayerInfo player1={player1} player2={player2} onStartGame={handleStartGame} socket={socket}/>
                </div>
            )}
            {opponentDisconnected && (
                <WaitForReconnection opponent={opponent}/>
            )}
            {showResult && (
                <MatchResult player={currentUser} winner={winner} onBack={handleBackToLobby}/>
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
                    </div>
                </>
            )}
            <button className='exit-game-button' onClick={handleExitGame}>
                <img src={exit} alt="exit" className='exit-logo'/>
            </button>
            {showExitPopup && (
                <div className="exit-popup">
                    <div className="exit-popup-content">
                        <h2>BACK TO LOBBY ?</h2>
                        <div className="exit-popup-buttons">
                            <button onClick={() => confirmExitGame(true)}>Yes</button>
                            <button onClick={() => confirmExitGame(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div> 
    );
};

export default RealTimeGame;
