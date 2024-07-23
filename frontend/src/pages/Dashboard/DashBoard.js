import React, { useEffect, useState } from 'react'
import './dashboard.css'
import DashProfil from './components/DashProfil'
import MatchHistory from './components/MatchHistory'
import Achievments from './components/Achievments'
import Friends from './components/Friends'
import useFetch from '../../hooks/useFetch'

const DashBoard = () => {
  const [profilData, setProfilData] = useState([]);

  const {data ,isLoading, error} = useFetch('http://localhost:8000/user/stats')
  useEffect(() => {
     if (data) {
       setProfilData(data);
     }
   }, [data]);

  return (
    <div className='dashboard-contianer'>
       <div className='page-title'>
           <h1>Welcome Back {profilData.username}</h1>
       </div>
       <div className="dashboard">
          <div className="profilHistoryAcgievmeants-container">
              <div className="profil-container">
                <DashProfil profilData={profilData}/>
              </div>
              <div className="historyAchievments-container">
                <div className="history-container">
                <MatchHistory /> 
                </div>
                <div className="achievments-container">
                <Achievments />
                </div>
              </div>
          </div>
          <div className="friends-container">
            <Friends /> 
          </div>
       </div>
    </div>
  )
}

export default DashBoard