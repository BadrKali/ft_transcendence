import React from 'react'
import { useEffect, useState } from 'react'
import './achievments.css'
import AchievmentsData from '../../../assets/AchievmentsData'
import AchievmentsItem from './AchievmentsItem'
import useFetch from '../../../hooks/useFetch'

function Achievments() {
  const [achievements, setAchievements] = useState(AchievmentsData.map(achiev => ({ ...achiev, unlocked: "false" })));

  const { data: userAchievements, isLoading, error } = useFetch('http://localhost:8000/api/game/achievements/me');

  useEffect(() => {
    if (userAchievements && userAchievements.length) {
      const updatedAchievements = achievements.map(achiev => {
        const isAchieved = userAchievements.some(userAchiev => userAchiev.achievement?.title  === achiev.title);
        return {...achiev, unlocked: isAchieved ? "true" : "false"};
      });
      setAchievements(updatedAchievements);
    }
  }, [userAchievements]);
  console.log(achievements)

  return (
    <div className='achievmentsContainer'>
        <div className='achievmentsHeader'>
            <h2>Achievements</h2>
        </div>
        <div className='achievmentsCard'>
            {achievements.map((achiev) => (
                <AchievmentsItem key={achiev.id} achiev={achiev}/>
            ))}
        </div>

    </div>
  )
}

export default Achievments