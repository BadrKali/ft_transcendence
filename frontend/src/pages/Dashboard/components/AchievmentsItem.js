import React from 'react'
import Icon from '../../../assets/Icon/icons'
import './achievmentsItem.css'

function AchievmentsItem({achiev}) {
    // console.log(achiev.image)
  return (
    <div className={achiev.unlocked === "false" ? 'AchievmentsItemContainer unlockedAchiev' : 'AchievmentsItemContainer'}>
        <div className='IconContainer'>
            <Icon name={achiev.image} className="AchievmentsIcon"/> 
 
        </div>
        <div className='AchievmentsInfo'>
            <div className='AchievmentsName'>
                <p>{achiev.title}</p>
            </div>
            <div className='AchievmenstDescription'>
                <p style={{color: '#8D93AC'}}>{achiev.description}</p>
            </div>
        </div>
    </div>
  )
}

export default AchievmentsItem