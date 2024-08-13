import React from 'react'
import { useState, useEffect } from 'react'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import History from '../../../assets/MatchHistoryData'
import HistoryItem from './HistoryItem'
import './matchHistory.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function MatchHistory({profilData}) {
  const [history, setHistory] = useState([]);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { auth }  = useAuth()



  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/api/game/game-history/${profilData.user_id}`)
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
        <h2>{t('Match History')}</h2>
      </div>
      <div className="historyCard">
        {history.length > 0 ? (
          history.map((historyItem) => (
            <div key={historyItem.id} onClick={() => handleItemClick(historyItem)}>
              <HistoryItem history={historyItem} />
            </div>
          ))
        ) : (
          <p>{t('No match history available.')}</p>
        )}
      </div>
    </div>
  )
}

export default MatchHistory