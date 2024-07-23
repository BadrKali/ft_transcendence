import React from 'react'
import './leaderBoard.css'
import FirstThreeItem from './components/FirstThreeItem'
import LeaderBoardData from '../../assets/LeaderBoardData'
import RestItem from './components/RestItem'

const LeaderBoard = () => {
  const [first, second, third, ...rest] = LeaderBoardData;

  return (
    <div className='leaderBoard-Container'>
      <div className='page-title'>
        <h1>LeaderBoard</h1>
      </div>
      <div className='leaderBoard-List-Container'>
        <div className='leaderBoard-List'>
            <div className='leaderBoard-FirstThree'>
                <FirstThreeItem key={first.id} player={first} iconName="gold"/>
                <FirstThreeItem key={second.id} player={second} iconName="silver"/>
                <FirstThreeItem key={third.id} player={third} iconName="copper"/>
            </div>
            <div className='leaderBoard-RestList'>
                <div className='restList-Header'>
                      <p>player</p>
                      <p>Matchs Played</p>
                      <p>Win</p>
                      <p>Loss</p>
                      <p>Rank</p>
                </div>
                <div className='restList-Players'>
                    {rest.map((players, index) => (
                      <RestItem key={players.id} players={players} index={index}/>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderBoard