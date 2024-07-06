import React from 'react'
import './historyItem.css'
function HistoryItem( {history} ) {
  return (
    <div className={history.won ? "card won" : "card loss"}>
        <div className="playerImage">
            <img src={history.image} />
        </div>
        <div className="playerInfo">
            <div className="nameRank">
                <h4>{history.player_name}</h4>
                <p style={{color: '#737373', paddingTop:'5px'}}>Rank : {history.rank}</p>
            </div>
            <div className='playerInfoBox'>
                <div className="totalGames box">
                    <p>Total Games</p>
                    <p className='parg' style={{color: '#8D93AC'}}>{history.total_games}</p>
                </div>
                <div className="win box">
                    <p>Win</p>
                    <p className='parg' style={{color: '#8D93AC'}}>{history.win_percentage}</p>
                </div>
                <div className="Loss box">
                    <p>Loss</p>
                    <p className='parg' style={{color: '#8D93AC'}}>{history.loss_percentage}</p>
                </div>
                <div className={history.won ? "defeat box true" : "defeat box false"}>
                    <p>DEFEAT</p>
                    <p className='parg clr'>{history.match_score}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HistoryItem