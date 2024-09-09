import './leaderBoard.css'
import FirstThreeItem from './components/FirstThreeItem'
import LeaderBoardData from '../../assets/LeaderBoardData'
import RestItem from './components/RestItem'
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth'

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {auth} = useAuth()

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('http://localhost:8000/user/leaderboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${auth.accessToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        setError('Failed to fetch leaderboard data');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchLeaderboardData();
  }, []);

  console.log(leaderboardData)


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const [first, second, third, ...rest] = leaderboardData;


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