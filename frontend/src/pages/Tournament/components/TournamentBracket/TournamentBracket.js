import React, { useEffect, useState } from 'react'
import useFetch from '../../../../hooks/useFetch'
import './TournamentBracket.css'
import TournamentsItem from './TournamentsItem'
import Icon from '../../../../assets/Icon/icons'
import EightPlayer from '../../../../assets/TournamentEightPlayer'
// import FourPlayer from '../../../../assets/TournamentFourPlayers'
// import TwoPlayer from '../../../../assets/TournamentTwoPlayers'
import useAuth from '../../../../hooks/useAuth'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function TournamentBracket() {
  const { auth } = useAuth()
  const four_lines = new Array(4).fill(null);
  const two_lines = new Array(2).fill(null);
  const one_lines = new Array(1).fill(null);
  const {data: matches ,isLoading, error} = useFetch(`${BACKEND_URL}/user/tournament/SEMI-FINALS`)
  const [FourPlayer, setFourPlayer] = useState([]);
  const [TwoPlayer, setTwoPlayer] = useState([]);
  const defaultTwoMatches = [
    { id: 1, player1: {}, player2: {} },
    { id: 2, player1: {}, player2: {} },
  ];

  const defaultOneMatches = [
    { id: 1, player1: {}, player2: {} },
  ];

  console.log(matches)
  useEffect(() => {
    if (matches) {
      const fetchPlayerDetails = async (playerId) => {
        const response = await fetch(`${BACKEND_URL}/user/stats/${playerId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch player data');
        }
        return response.json();
      };
      
      const fetchAllPlayers = async () => {
        const playerData = [];
        
        for (const match of matches) {
          const [player1Data, player2Data] = await Promise.all([
            fetchPlayerDetails(match.player1),
            fetchPlayerDetails(match.player2)
          ]);
          
          playerData.push({
            matchId: match.id,
            player1: player1Data,
            player2: player2Data,
          });
        }
        
        setFourPlayer(playerData);
      };
      
      fetchAllPlayers().catch(error => console.error(error));
    }
  }, [matches]);
  
  const matchesToDisplayTwo = FourPlayer.length > 0 ? FourPlayer : defaultTwoMatches;
  const matchesToDisplayOne = TwoPlayer.length > 0 ? FourPlayer : defaultOneMatches;
 
  return (
    <div className='bracket-container'>
        {/* <div className="first-eight-players">
            <div className="player-items">
                {EightPlayer.map((players) => (
                  <TournamentsItem key={players.id} players={players}/>
                ))}
            </div>
            <div className="eight-lines">
                 {four_lines.map((_, index) => (
                    <div className="two-lines" key={index}>
                      <div className="first-line"></div>
                    </div>
                  ))}
            </div>
            <div className="last-line">
                {four_lines.map((_, index) => (
                    <div className="t-lines" key={index}>
                    </div>
                  ))}
            </div>
        </div> */}
        <div className="second-four-player">
            <div className="player-items">
                  {matchesToDisplayTwo.map((players) => (
                    <TournamentsItem key={players.id} players={players}/>
                  ))}
              </div>
              <div className="four-lines">
                  {two_lines.map((_, index) => (
                    <div className="two-lines" key={index}>
                      <div className="first-line"></div>
                    </div>
                  ))}
              </div>
              <div className="last-line">
                  {two_lines.map((_, index) => (
                    <div className="t-lines" key={index}>
                    </div>
                  ))}
              </div>
        </div>
        <div className="final-game-players">
              <div className="player-items">
                  {matchesToDisplayOne.map((players) => (
                    <TournamentsItem key={players.id} players={players}/>
                  ))}
              </div>
              <div className="final-lines">
                  {one_lines.map((_, index) => (
                    <div className="one-lines" key={index}>
                      <div className="first-line"></div>
                    </div>
                  ))}
              </div>
              <div className="last-line">
                  {one_lines.map((_, index) => (
                    <div className="t-lines" key={index}>
                    </div>
                  ))}
              </div>
        </div>
        <div className="winner">
         <Icon name='TournamentWin' className='tournament-win' />
        </div>
    </div>
  )
}

export default TournamentBracket