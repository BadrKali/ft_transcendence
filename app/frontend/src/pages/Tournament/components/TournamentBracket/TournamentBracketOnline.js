import React, { useEffect, useState } from 'react'
import useFetch from '../../../../hooks/useFetch'
import './TournamentBracket.css'
import TournamentsItem from './TournamentsItem'
import Icon from '../../../../assets/Icon/icons'
import EightPlayer from '../../../../assets/TournamentEightPlayer'
// import FourPlayer from '../../../../assets/TournamentFourPlayers'
// import TwoPlayer from '../../../../assets/TournamentTwoPlayers'
import useAuth from '../../../../hooks/useAuth'
import TournamentPlayersItem from './TournamentPlayersItem'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { avatarsUnkown } from '../../../../assets/assets'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { UserContext } from '../../../../context/UserContext'


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function TournamentBracketOnline() {
  const { auth } = useAuth()
  const four_lines = new Array(4).fill(null);
  const two_lines = new Array(2).fill(null);
  const one_lines = new Array(1).fill(null);
  const {TounamentData, TounamenrLoading} = useContext(UserContext)
  const [matches, setMatches] = useState([]);
  // const {data: matches ,isLoading, error} = useFetch(`${BACKEND_URL}/api/user/tournament/SEMI-FINALS`)
  const [FourPlayer, setFourPlayer] = useState([]);
  const [TwoPlayer, setTwoPlayer] = useState([]);
  const { t } = useTranslation();
  const [playersByStage, setPlayersByStage] = useState({});
  const [loading, setLoading] = useState(true);
  const [semiFinalMatches, setSemiFinalMatches] = useState([]);
  const [finalMatches, setFinalMatches] = useState([]);
  const [winnerPlayer, setWinnerPlayer] = useState(null)

  const unknownAvatar = avatarsUnkown.img;

  const defaultTwoMatches = [
    { id: 1, player1: {}, player2: {} },
    { id: 2, player1: {}, player2: {} },
  ];

  const defaultOneMatch = [{ id: 1, player1: {}, player2: {} }];

  useEffect(() => {
    const fetchTournamentData = async () => {
  
      if (TounamentData.tournament_stage === "FINALS") {
        try {
          const response = await fetch(`${BACKEND_URL}/api/user/tournament/FINALS`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            if (data && data[0].winner) {
              try {
                const playerResponse = await fetch(
                  `${BACKEND_URL}/api/user/stats/${data[0].winner}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${auth.accessToken}`,
                    },
                  }
                );
  
                if (playerResponse.ok) {
                  const playerData = await playerResponse.json();
                  setWinnerPlayer(playerData)
                } 
              } catch (playerError) {
                console.error("Error fetching player data:", playerError);
              }
            } 
          } 
        } catch (error) {
          console.error("Error fetching tournament data:", error);
        }
      } 
    };
  
    fetchTournamentData();
  }, [TounamentData]);
  

  useEffect(() => {
    const fetchPlayerDetails = async (playerId) => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/stats/${playerId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch player data");
        }
  
        return await response.json();
      } catch (error) {
        console.error(`Error fetching player data for ID ${playerId}:`, error);
        return null; 
      }
    };
  
    const fetchPlayersByStage = async (matches) => {
      return await Promise.all(
        matches.map(async (match) => {
          const [player1Data, player2Data] = await Promise.all([
            fetchPlayerDetails(match.player1),
            fetchPlayerDetails(match.player2),
          ]);
  
          return {
            matchId: match.id,
            matchStage: match.matchStage, 
            tournament: match.tournament, 
            matchPlayed: match.matchPlayed, 
            player1: player1Data,
            player2: player2Data,
            winner: match.winner, 
            looser: match.loosers, 
          };
        })
      );
    };
  
    const fetchAllPlayers = async () => {
      try {
        setLoading(true);
  
      
        const [semiFinalResponse, finalResponse] = await Promise.all([
          fetch(`${BACKEND_URL}/api/user/tournament/SEMI-FINALS`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }),
          fetch(`${BACKEND_URL}/api/user/tournament/FINALS`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }),
        ]);
  
        const [semiFinalMatches, finalMatches] = await Promise.all([
          semiFinalResponse.ok ? semiFinalResponse.json() : [],
          finalResponse.ok ? finalResponse.json() : [],
        ]);
  
       
        const [semiFinalPlayers, finalPlayers] = await Promise.all([
          fetchPlayersByStage(semiFinalMatches),
          fetchPlayersByStage(finalMatches),
        ]);
  
    
        setSemiFinalMatches(semiFinalPlayers);
        setFinalMatches(finalPlayers);
  
        setPlayersByStage((prev) => ({
          ...prev,
          "SEMI-FINALS": semiFinalPlayers,
          "FINALS": finalPlayers,
        }));
      } catch (error) {
        console.error("Error fetching tournament data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllPlayers();
  }, [auth.accessToken]);
  
  const semiFinalMatche = semiFinalMatches.length > 0 ? semiFinalMatches : defaultTwoMatches;
  const finalPlayers = finalMatches.length > 0 ? finalMatches : defaultOneMatch;
  
  


  if (loading)
    {
      return(
        <div>loading....</div>
      )
    }

  return (
    <div className='bracket-container'>
        <div className="second-four-player">
            <div className="player-items">
                  {semiFinalMatche.map((players, index) => (
                    <TournamentsItem key={`${players.id}-${index}`} players={players}/>
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
                  {finalPlayers.map((players, index) => (
                    <TournamentsItem key={`${players.id}-${index}`} players={players}/>
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
        <div className="winner-tounament">
         <Icon name='TournamentWin' className='tournament-win' />
        </div>
        <div className='TournamentPlayers'>
                <h2>{t('SEMI FINAL')}</h2>
            {semiFinalMatche.map((players, index ) => (
                    <TournamentPlayersItem key={`${players.id}-${index}`} players={players}/>
                  ))}
               <h2>{t('FINAL')}</h2>
            {finalPlayers.map((players, index ) => (
                    <TournamentPlayersItem key={`${players.id}-${index}`} players={players}/>
                  ))}
              <div className='TournamentWinner'>
                <h2>{t('WINNER')}</h2>
                <div className="TheWinnerCard">
                  <div className="WinnerImage">
                    <img 
                      src={winnerPlayer?.avatar ? `${BACKEND_URL}${winnerPlayer.avatar}` : unknownAvatar} 
                      alt={winnerPlayer?.username || t("Unknown Player")} 
                    />
                  </div>
                  <div className="WinnerNameRank">
                    <h2>{winnerPlayer?.username || t("Unknown Player")}</h2>
                    <p>{t('Rank')} : {winnerPlayer?.rank || "N/A"}</p>
                  </div>
                </div>

              </div>
        </div>
        
    </div>
  )
}

export default TournamentBracketOnline