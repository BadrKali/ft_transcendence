import React from 'react'
import './achievments.css'
import AchievmentsData from '../../../assets/AchievmentsData'
import AchievmentsItem from './AchievmentsItem'

function Achievments() {
  return (
    <div className='achievmentsContainer'>
        <div className='achievmentsHeader'>
            <h2>Achievements</h2>
        </div>
        <div className='achievmentsCard'>
            {AchievmentsData.map((achiev) => (
                <AchievmentsItem key={achiev.id} achiev={achiev}/>
            ))}
        </div>

    </div>
  )
}

export default Achievments