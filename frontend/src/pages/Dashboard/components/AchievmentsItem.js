import React from 'react'
// import Icon from '../../../assets/Icon/icons'
import './achievmentsItem.css'

function AchievmentsItem({achiev}) {
  return (
    <div className='AchievmentsItemContainer'>
        <div className='IconContainer'>
            {/* <Icon name={achiev.icon} className="AchievmentsIcon"/> */}
            icon
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