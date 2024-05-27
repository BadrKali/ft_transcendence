import React from 'react'
import './dashboard.css'
import DashProfil from './components/DashProfil'
import MatchHistory from './components/MatchHistory'
import Achievments from './components/Achievments'
import Friends from './components/Friends'

const DashBoard = () => {
  return (
    <div className='dashboard-contianer'>
        <div className='page-title'>
            <h1>Welcome Back Perdoxi</h1>
        </div>
        <div className="dashboard">
            <div className="profil">
              <DashProfil />
            </div>
            <div className="matchHistory">
              <MatchHistory /> 
            </div>
            <div className="achievments">
              <Achievments />
            </div>
            <div className="friends">
              <Friends /> 
            </div>
        </div>
    </div>
  )
}

export default DashBoard