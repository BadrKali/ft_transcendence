import ScoreBoard from "../components/ScoreBoard";
import avatar1 from '../asstes/avatar1.png';
import avatar2 from '../asstes/avatar2.png';
import { useRef, useEffect } from 'react';

const GameLogic = ({ player1, player2, game_state }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = game_state.canvas.width;
        canvas.height = game_state.canvas.height;

        const ball = game_state.ball;
        const net = game_state.net;

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
            for (let i = 0; i <= canvas.height; i++) {
                drawRect(net.x, net.y + i, net.width, net.height, net.color);
            }
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(22, 22, 37, 0.9)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawNet();
            drawArc(ball.x, ball.y, ball.radius, ball.color);
        }

        function game() {
            render();
        }

        let framePerSecond = 50;
        let loop = setInterval(game, 1000 / framePerSecond);

        return () => {
            clearInterval(loop);
        };
    }, [game_state]);

    return (
        <div className="game-logic-container">
            {player1 && player2 &&
                <ScoreBoard
                    user1Score={0}
                    user2Score={0}
                    user1Name={player1.username}
                    user2Name={player2.username}
                    user1Avatar={avatar1}
                    user2Avatar={avatar2}
                />
            }
            <div className="game-container">
                <canvas className='canvas-container' ref={canvasRef}></canvas>
            </div>
        </div>
    );
}

export default GameLogic;
