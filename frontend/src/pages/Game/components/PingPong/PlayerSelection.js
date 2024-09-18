import React, { useEffect, useRef } from 'react';
import useFetch from '../../../../hooks/useFetch';
import useAuth from '../../../../hooks/useAuth';
import players from '../../Data';
import defit from '../../Game-assets/defit.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WS_BACKEND_URL = process.env.REACT_APP_WS_BACKEND_URL;

const PlayerSelection = ({ onPlayerSelect, onCancel }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { data, isLoading, error } = useFetch(`${BACKEND_URL}/user/friends/list/`);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`${WS_BACKEND_URL}/ws/notifications/?token=${auth.accessToken}`);
    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };
    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleChallenge = async (player) => {
    const notification = {
      player_receiver_id: player.id,
    };
    try {
      const response = await axios.post(`${BACKEND_URL}/api/game/send-challenge/`, notification, {
            headers : {
              'Content-Type' : 'application/json',
              'Authorization': `Bearer ${auth.accessToken}`,
          }
      });
      console.log("Game Settings saved", response.data);
    } catch (error) {
      console.log("Failed to save game settings");
    }
    navigate('/invite-game', { replace : true });
  };

  return (
    <div className="player-selection-overlay">
      <div className="player-selection">
        <h2>ONLINE FRIENDS</h2>
        <ul>
          {data && data.map(player => (
            <li key={player.id} className='player-item'>
              <div className='player-info'>
                <img src={`${BACKEND_URL}${player.avatar}`} alt={player.username} className='player-image' />
                <p className='player-name'>{player.username}</p>
              </div>
              <button className='player-challenge' onClick={() => handleChallenge(player)}>INVITE</button>
            </li>
          ))}
        </ul>
        <button onClick={onCancel} className='cancel'>Cancel</button>
      </div>
    </div>
  );
};

export default PlayerSelection;
