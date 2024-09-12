import React, { useEffect } from 'react'
import { useState } from 'react'
import useFetch from '../../../../hooks/useFetch'
import './TournamentInfo.css'
import Icon from '../../../../assets/Icon/icons'
import { avatars }from '../../../../assets/assets'
import MainButton from '../../../../components/MainButton/MainButton'
import CreatTournamentPopUp from './CreatTournamentPopUp'
import JoinedTournament from './JoinedTournament'
import NoTournament from './NoTournament'
import Lottie from 'lottie-react'
import loadingAnimation from '../../../../components/OauthTwo/loading-animation.json'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const TournamentInfo = () => {
  const [joinedTournament, setJoinedTournament] = useState(false);
  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/user/tournament/`)


  useEffect (() => {
    if (data && Object.keys(data).length > 0)
        setJoinedTournament(true)
    else
        setJoinedTournament(false)

  },[data])

  if (isLoading || !data){
    return (
      <div className='oauth-loading'>
        <Lottie animationData={loadingAnimation} style={{ width: 400, height: 400 }} />; 
      </div>
    )
  }

  return (
    <div className='overView-container'>
        {joinedTournament ? (
          <JoinedTournament TournamentData={data} isLoadingData={isLoading}/>
        ) : (
          <NoTournament setJoinedTournament={setJoinedTournament}/>
        )}
    </div>
  )
}

export default TournamentInfo