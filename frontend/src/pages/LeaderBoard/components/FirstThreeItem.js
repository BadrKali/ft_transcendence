import React from 'react'
import './firstThreeItem.css'
import Icon from '../../../assets/Icon/icons'

function FirstThreeItem({player, iconName}) {
  return (
    <div className='firstThree-Container'>
        <div className='player-Image'>
            <img src={player.image}/>
        </div>
        <div className='playerNameRanke'>
            <p>{player.username}</p>
            <p className='rankParag'>Rank : {player.rank}</p>
        </div>
        <div className='rankIcon'>
            <Icon name={iconName} className="goldIcon" />
        </div>
    </div>
  )
}

export default FirstThreeItem