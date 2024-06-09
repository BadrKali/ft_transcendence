import React from 'react'
import './TournamentsItem.css'

function TournamentsItem({players}) {
  return (
    <div className={players.win ? 'tournamentsItem-container wone' : 'tournamentsItem-container losse'}>
        <div className="player-image">
            <img src={players.image}/>
        </div>
        <div className="player-name">
          <p>{players.username}</p>
        </div>
    </div>
  )
}

export default TournamentsItem