import React from 'react'
import './TournamentInfo.css'
import Icon from '../../../../assets/Icon/icons'
import { avatars }from '../../../../assets/assets'

const TournamentInfo = () => {
  return (
    <div className='tournament-info-container'>
        <div className='tournament-info-item'>
            <Icon name='chump_cup' className="tournament-info-icon"/>
            <div className='tournament-info-item-txt'>
                <p>20 000 coin</p>
                <span>Total Prize Pool</span>
            </div>
        </div>
        <div className='tournament-info-item'>
            <Icon name='calendar' className="tournament-info-icon"/>
            <div className='tournament-info-item-txt'>
                <p>30 Sep  18:00</p>
                <span>Tournament Start</span>
            </div>
        </div>
        <div className='tournament-info-item'>
            <Icon name='game_mode' className="tournament-info-icon"/>
            <div className='tournament-info-item-txt'>
                <p>Game Mode</p>
                <span>1 v 1 li mat khser</span>
            </div>
        </div>
        <div className='tournament-info-item'>
            <Icon name='location' className="tournament-info-icon"/>
            <div className='tournament-info-item-txt'>
                <p>Map</p>
                <span>UnderGround Hell</span>
            </div>
        </div>
        <div className='tournament-subscribers'>
            <div className='tournament-subscribers-avatars'>
                <img className='image1' src={avatars[0].img}/>
                <img className='image2' src={avatars[1].img}/>
                <img className='image3' src={avatars[2].img}/>
                <img className='image4' src={avatars[3].img}/>
            </div>
            <span className='tournament-subscribers-counter'>7/10 Joined</span>
        </div>
    </div>
  )
}

export default TournamentInfo