import React from 'react'
import './TournamentsItem.css'
import { avatars } from '../../../../assets/assets';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function TournamentsItem({players}) {
  const unknownAvatar = avatars[4].img;

  return (
    <div className="tournamentsItem-match-container">
      <div className={players.win ? 'tournamentsItem-container wone' : 'tournamentsItem-container losse'}>
          <div className="player-image">
            <img src={players.player1?.avatar ? `${BACKEND_URL}${players.player1.avatar}` : unknownAvatar} alt={players.player1?.username || 'Unknown Player'} />
          </div>
          <div className="player-name">
            <p>{players.player1?.username || 'Unknown Player'}</p>
          </div>
      </div>
      <div className={players.win ? 'tournamentsItem-container wone' : 'tournamentsItem-container losse'}>
        <div className="player-image">
            <img src={players.player2?.avatar ? `${BACKEND_URL}${players.player2.avatar}` : unknownAvatar} alt={players.player2?.username || 'Unknown Player'} />

        </div>
        <div className="player-name">
          <p>{players.player2?.username || 'Unknown Player'}</p>
        </div>
        </div>
    </div>

  )
}

export default TournamentsItem