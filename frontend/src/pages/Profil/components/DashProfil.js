import React from 'react'
import  { useState, useEffect } from 'react';
import './dashProfil.css'
import { avatars } from '../../../assets/assets'


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function DashProfil({profil}) {
  const [progress, setProgress] = useState('0%');

  useEffect(() => {
      setTimeout(() => {
        setProgress('67%');
      }, 500); 
    }, []);
    //  const winPer = Math.floor((playerData.games_won / playerData.games_played) * 100);
    const winPer = Math.floor((30 / 100) * 100);
    const lossPer = 100 - winPer ;
  return (
    <div className='profilInfo'>
      
        <div className="userInfo">
            <div className='userContainer'>
                <div className="userImage" >
                    <img src={`${BACKEND_URL}${profil.avatar}`}/>
                </div>
                <div className="userProgress">
                    <div className="progresInfo">
                        <div className="nameRank">
                            <h4>{profil.username}</h4>
                            <h4>Rank : {profil.rank}</h4>
                        </div>
                        <div className="userXp box">
                            <p>User_xp</p>
                            <p>900xp</p>
                        </div>
                        <div className="totalGames box">
                            <p>Total Games</p>
                            <p>{profil.games_played}</p>
                        </div>
                        <div className="win box">
                            <p>Win</p>
                            <p>{winPer}%</p>
                        </div>
                        <div className="Loss box">
                            <p>Loss</p>
                            <p>{lossPer}%</p>
                        </div>
                    </div>
                    <div className="progresBar">
                        <div className='emptyBar'>
                            <p>67%</p>
                            <div className='filledBar' style={{ width: progress }}></div>
                        </div>
                    </div>
            </div>
            </div>
        </div>

    </div>
  )
}

export default DashProfil