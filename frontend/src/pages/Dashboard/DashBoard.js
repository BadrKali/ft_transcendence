import React, { useEffect, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../../components/TopBar/LanguageSelector'
import './dashboard.css'
import DashProfil from './components/DashProfil'
import MatchHistory from './components/MatchHistory'
import Achievments from './components/Achievments'
import Friends from './components/Friends'
import useFetch from '../../hooks/useFetch'
import LineChart from './components/LineChart'
import { UserContext } from '../../context/UserContext'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const DashBoard = () => {
  const [profilData, setProfilData] = useState([]);
  const { t } = useTranslation();
  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/user/stats`)
  const {userData} = useContext(UserContext)
  useEffect(() => {
     if (data) {
       setProfilData(data);
     }
   }, [data]);

   console.log(userData);
  return (
    <div className='dashboard-contianer'>
       <div className='page-title'>
           <h1>{t('Welcome back')} {userData.username}</h1>
       </div>
       <div className="dashboard">
          <div className="profilHistoryAcgievmeants-container">
              <div className="profil-container">
                <DashProfil profilData={userData}/>
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