import React, { useEffect, useState } from 'react'
import './dashboard.css'
import DashProfil from './components/DashProfil'
import MatchHistory from './components/MatchHistory'
import Achievments from './components/Achievments'
import Friends from './components/Friends'
import useFetch from '../../hooks/useFetch'
import LineChart from './components/LineChart'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const DashBoard = () => {
  const [profilData, setProfilData] = useState([]);

  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/user/stats`)
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
                <MatchHistory profilData={profilData} /> 
                </div>
                <div className="achievments-container">
                <Achievments />
                </div>
              </div>
              <div className='lineChart-container'>
                <h2>Graph Growth</h2>
                <LineChart />
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