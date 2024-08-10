import React from 'react'
import { useState, useEffect } from 'react'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';      
import History from '../../../assets/MatchHistoryData'
import HistoryItem from './HistoryItem'
import './matchHistory.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function MatchHistory({profil}) {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const { auth }  = useAuth()


  console.log(profil)
  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/api/game/game-history/${profil.user_id}`)
  useEffect(() => {
     if (data) {
       setHistory(data);
     }
   }, [data]);

 

   const handleItemClick = async (history) => {
      let playerId = history.winner_user;
      if (history.is_winner) {
        playerId = history.loser_user;
      }
   
   
        const url = `${BACKEND_URL}/user/stats/${playerId}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`,
                },
            });
            if (response.ok) {
                const dataa = await response.json();
                console.log(dataa)
                navigate(`/user/${dataa.username}`, {
                  state: { userData: dataa },
                });
            
            } else {
                console.error('Error fetching block status:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching block status:', error);
        }
    
      };
  return (
    <div className="macthContainer">
        <div className="matchHeader">
            <h2>Match History</h2>
        </div>
        <div className="historyCard">
        {history.length > 0 ? (
            history.map((historyItem) => (
              <div key={historyItem.id} onClick={() => handleItemClick(historyItem)} >
                <HistoryItem  history={historyItem} />
              </div>
            ))
          ) : (
            <p>No match history available.</p>
        )}
        </div>

    </div>
  )
}

export default MatchHistory