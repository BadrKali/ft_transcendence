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
  return (
    <div className='overView-container'>

        {joinedTournament ? (
          <JoinedTournament />
        ) : (
          <NoTournament />
        )}
    </div>
  )
}

export default TournamentInfo