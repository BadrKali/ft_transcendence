import React, { useState } from 'react'
import './Tournament.css'
import Icon from '../../assets/Icon/icons'
import TournamentInfo from './components/TournamentInfo/TournamentInfo'
import TournamentBracket from './components/TournamentBracket/TournamentBracket'


const Tournament = () => {


  const [tournamentMenuItem, setTournamentMenuItem] = useState('overview')
  return (
    <div className='tournment-container'>
      <div className='page-title'>
          <h1>Tournament</h1>
      </div>
      <div className='tournament-menu'>
        <div className={`tournament-menu-item ${tournamentMenuItem === 'overview' ? 'active-tournament-menu' : ''}`} onClick={() => {
          setTournamentMenuItem('overview')
        }}>
          <Icon name='view' className='tournament-icon' />
          <span>Overview</span>
        </div>
        <div className={`tournament-menu-item ${tournamentMenuItem === 'bracket' ? 'active-tournament-menu' : ''}`} onClick={() => {
          setTournamentMenuItem('bracket')
        }}>
          <Icon name='bracket' className='tournament-icon'/>
          <span>Bracket</span>
        </div>
      </div>
      <div className='tournament-menu-content'>
        {tournamentMenuItem === 'overview' && <TournamentInfo/>}
        {tournamentMenuItem === 'bracket' && <TournamentBracket />}
      </div>
    </div>
  )
}

export default Tournament