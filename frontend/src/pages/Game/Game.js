import React, { useState } from 'react';
import PingPong from './components/PingPong';
import './game.css'
import pingLogo from './Game-assets/ping.svg'
import XOLogo from './Game-assets/XO.svg'

const Game = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
  };

  return (
    <div className='game-container'>
        <div className='page-title'>
          <h1>Game Lobby</h1>
          <div className="gameArea">
            <div className={`ping-pong gameComponent ${selectedGame === 'ping-pong' ? 'selected' : ''}`}
              onClick={() => handleSelectGame('ping-pong')}>
                <img src={pingLogo} className='gameLogo' alt=''/>
                <p className='gameTitle'>Ping Pong</p>
                {/* {selectedGame === 'ping-pong' && <PingPong/>} */}
            </div>
            <div className={`XO gameComponent ${selectedGame === 'XO' ? 'selected' : ''}`}
              onClick={() => handleSelectGame('XO')}>
              <img src={XOLogo} className='gameLogo' alt=''/>
              <p className='gameTitle'>XO Game</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Game