import React from 'react'
// import pingPongComponent from './components/pingPongMainComponents'
import './game.css'
import pingLogo from './Game-assets/ping.svg'
import XOLogo from './Game-assets/XO.svg'

const Game = () => {
  return (
    <div className='game-container'>
        <div className='page-title'>
          <h1>Game Lobby</h1>
          <div className="gameArea">
            <div className="ping-pong">
                <img src={pingLogo} className='gameLogo' alt=''/>
                <p className='gameTitle'>Ping Pong</p>
            </div>
            <div className="XO">
              <img src={XOLogo} className='gameLogo' alt=''/>
              <p className='gameTitle'>XO Game</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Game