import React from 'react'
import './TournamentsItem.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function TournamentsItem({players}) {
  console.log(players.player1.avatar);
  return (
    <div className="tournamentsItem-match-container">
      <div className={players.win ? 'tournamentsItem-container wone' : 'tournamentsItem-container losse'}>
          <div className="player-image">
              <img src={`${BACKEND_URL}${players.player1.avatar}`}/>
          </div>
          <div className="player-name">
            <p>{players.player1.username}</p>
          </div>
      </div>
      <div className={players.win ? 'tournamentsItem-container wone' : 'tournamentsItem-container losse'}>
        <div className="player-image">
          <img src={`${BACKEND_URL}${players.player2.avatar}`}/>

        </div>
        <div className="player-name">
          <p>{players.player2.username}</p>
        </div>
        </div>
    </div>

  )
}

export default TournamentsItem