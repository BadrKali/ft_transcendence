import React from 'react'
import { useState } from 'react'
import './TournamentInfo.css'
import Icon from '../../../../assets/Icon/icons'
import { avatars }from '../../../../assets/assets'
import MainButton from '../../../../components/MainButton/MainButton'
import CreatTournamentPopUp from './CreatTournamentPopUp'
import JoinedTournament from './JoinedTournament'
import NoTournament from './NoTournament'

const TournamentInfo = () => {
  const [joinedTournament, setJoinedTournament] = useState(true);

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