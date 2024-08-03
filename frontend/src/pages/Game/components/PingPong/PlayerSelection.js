import React from 'react';
import players from '../../Data';
import defit from '../../Game-assets/defit.png'
import useFetch from '../../../../hooks/useFetch';
import useAuth from '../../../../hooks/useAuth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WS_BACKEND_URL = process.env.REACT_APP_WS_BACKEND_URL;

const PlayerSelection = ({ onPlayerSelect, onCancel }) => {
  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/user/friends/list/`)
  return (
    <div className="player-selection-overlay">
        <div className="player-selection">
            <h2>ONLINE FRIENDS</h2>
            <ul>
                {data && data.map(player => (
                <li key={player.id} >
                    <img src={player.avatar} alt={player.username} className='player-image'/>
                    <div className='player-info'>
                    <p className='player-name'>{player.username}</p>
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
