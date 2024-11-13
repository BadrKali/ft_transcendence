import React from 'react'
import { useState, useEffect, useContext } from 'react';
import useFetch from '../../../hooks/useFetch';
import './historyItem.css'
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { UserContext } from '../../../context/UserContext';


function formatTimeAgo(dateString) {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  }

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function HistoryItem( {history} ) {
    const {userData} = useContext(UserContext)
    const { t } = useTranslation();
    const [isWineer, setIsWinner] = useState(false);
    const [player, setPlayer] = useState(null);
    let winPer = 0;



    
    useEffect(() => {
        if (userData.user_id === history.winner_user.user_id) {
            setIsWinner(true);
            setPlayer(history.loser_user);
     
        
        }else{
            setPlayer(history.winner_user);
   
        }
      }, [userData, history]);
  
      if (!player) return <div>Loading...</div>;

if (player.games_played){

    winPer = Math.floor((30 / 100) * 100);
}
  return (
    <div className={isWineer ? "card won" : "card loss"}>
        <div className="playerImage">
            <img src={`${BACKEND_URL}${player.avatar}`} />
        </div>
        <div className="playerInfo">
            <div className="nameRank">
                <h4>{player.username}</h4>
                <p style={{color: '#737373', paddingTop:'5px'}}>{t('Rank')} : {player.rank}</p>
            </div>
            <div className='playerInfoBox'>
                <div className="totalGames box">
                    <p>{t('Total Games')}</p>
                    <p className='parg' style={{color: '#8D93AC'}}>{player.games_played}</p>
                </div>
                <div className="win box">
                    <p>{t('Win')}</p>
                    <p className='parg' style={{color: '#8D93AC'}}>{winPer}%</p>
                </div>
                <div className={isWineer ? "defeat box true" : "defeat box false"}>
                    <p>{t('DEFEAT')}</p>
                    <p className='parg clr'>{history.winner_score}:{history.loser_score}</p>
                </div>
                <div className="Loss box">
                    {/* <p>{t('Played')}</p> */}
                    <p className='parg' style={{color: '#8D93AC'}}>{formatTimeAgo(history.played_at)}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HistoryItem