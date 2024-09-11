import React from 'react'
import './firstThreeItem.css'
import Icon from '../../../assets/Icon/icons'
import { avatars } from '../../../assets/assets'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


function FirstThreeItem({player, iconName}) {
  const unknownAvatar = avatars[4].img;

  return (
    <div className='firstThree-Container'>
        <div className='player-Image'>
            <img src={ player.avatar ? `${BACKEND_URL}${player.avatar}` : unknownAvatar}/>
        </div>
        <div className='playerNameRanke'>
            <h3>{player.username}</h3>
            <p className='rankParag'>Rank : {player.rank}</p>
        </div>
        <div className='rankIcon'>
            <Icon name={iconName} className="goldIcon" />
        </div>
    </div>
  )
}

export default FirstThreeItem