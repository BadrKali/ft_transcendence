import './leaderBoard.css'
import FirstThreeItem from './components/FirstThreeItem'
import LeaderBoardData from '../../assets/LeaderBoardData'
import RestItem from './components/RestItem'
import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';
import sadFace from '../../assets/sadFace.json'
import useAuth from '../../hooks/useAuth'
import EmptyRestItem from './components/EmptyRestItem';
import loadingAnimation from '../../components/OauthTwo/loading-animation.json'

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {auth} = useAuth()
  const { t } = useTranslation();

  const defaultsecond = {user_id: 2, username: 'Uknown Player', rank: 'None'};
  const defaultthird = {user_id: 3, username: 'Uknown Player', rank: 'None'};
  const defaultrest = new Array(20).fill(null);

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


  if (isLoading) return (
    <div className='oauth-loading'>
        <Lottie animationData={loadingAnimation} style={{ width: 400, height: 400 }} />; 
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  const [first, second, third, ...rest] = leaderboardData || [];

  const secondPlayer = second ? second : defaultsecond;
  const thirdPlayer = third ? third : defaultthird;
  const restPlayer = rest ? rest : defaultrest;

  console.log(secondPlayer)
  console.log(thirdPlayer)
  console.log(defaultrest)
  return (
    <div className='leaderBoard-Container'>
      <div className='page-title'>
        <h1>LeaderBoard</h1>
      </div>
      <div className='leaderBoard-List-Container'>
        <div className='leaderBoard-List'>
            <div className='leaderBoard-FirstThree'>
                {first && <FirstThreeItem key={first.user_id} player={first} iconName="gold"/>}
                {secondPlayer && <FirstThreeItem key={secondPlayer.user_id} player={secondPlayer} iconName="silver"/>}
                {thirdPlayer && <FirstThreeItem key={thirdPlayer.user_id} player={thirdPlayer} iconName="copper"/>}
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
                {rest.length > 0 ? (
                      rest.map((players, index) => (
                        <RestItem key={players.id} players={players} index={index + 4}/>
                      ))
                    ) : (
                      // defaultrest.map((_, index) => (
                      //     <EmptyRestItem key={index} index={index + 4} />
                      // ))
                      <div className='sadFaceAnimationGame'>
                        <div className='sadeFaceGame'><Lottie  animationData={sadFace} /> </div>
                        <h3>{t('No more players')}</h3>
                       </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderBoard