import React from 'react'
import History from '../../../assets/MatchHistoryData'
import HistoryItem from './HistoryItem'
import './matchHistory.css'

function MatchHistory() {
  return (
    <div className="macthContainer">
        <div className="matchHeader">
            <h2>Match History</h2>
        </div>
        <div className="historyCard">
            {History.match_history.map((history) => (
                <HistoryItem key={history.id} history={history}/>
            ))}
        </div>

    </div>
  )
}

export default MatchHistory