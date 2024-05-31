import React from 'react';
import players from '../../Data';
import defit from '../../Game-assets/defit.png'
const PlayerSelection = ({ onPlayerSelect, onCancel }) => {
  return (
    <div className="player-selection-overlay">
        <div className="player-selection">
            <h2>ONLINE FRIENDS</h2>
            <ul>
                {players.map(player => (
                <li key={player.id} >
                    <img src={player.picture} alt={player.name} className='player-image'/>
                    <div className='player-info'>
                    <p className='player-name'>{player.name}</p>
                    <p className='player-rank'>Rank: {player.rank}</p>
                    </div>
                    <button className='player-challenge' onClick={() => onPlayerSelect(player)}><img src={defit} alt=""/></button>
                </li>
                ))}
            </ul>
            <button onClick={onCancel} className='cancle'>Cancel</button>
        </div>
    </div>
  );
};

export default PlayerSelection;
