import React, { useEffect, useState } from 'react'
import useFetch from '../../../../hooks/useFetch'
import { useContext } from 'react'
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
import { UserContext } from '../../../../context/UserContext'
import TournamentBracketOnline from './TournamentBracketOnline'
import TournamentBracketOffline from './TournamentBracketOffline'


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function TournamentBracket() {
  const [isOnline, setIsOnline] = useState(false);
  const {TounamentData, TounamenrLoading} = useContext(UserContext)

  

  useEffect(() => {
      setIsOnline(TounamentData.is_online);
    }, [TounamentData.is_online]);

  return (
    <div className='bracket-container'>
       {isOnline ? (
        <TournamentBracketOnline /> 
       ) : (
        <TournamentBracketOffline />
       )}
    </div>
  )
}

export default TournamentBracket