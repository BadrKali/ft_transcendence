import React from 'react'
import { useState } from 'react'
import './TournamentInfo.css'
import Icon from '../../../../assets/Icon/icons'
import { avatars }from '../../../../assets/assets'
import MainButton from '../../../../components/MainButton/MainButton'
import CreatTournamentPopUp from './CreatTournamentPopUp'

const TournamentInfo = () => {
    const [modalCreat, setModalCreat] = useState(false);
    const handleCreatTournament = () => {

        setModalCreat(true);
        console.log(modalCreat)
    }

    const handleClosePopup = () => {
        setModalCreat(false)
      }
  return (
    <div className='overView-container'>
       {/* <MainButton type="submit" onClick={handleCreatTournament} content="Creat Tournament"/> */}
       <button onClick={handleCreatTournament}>Creat Tournament</button>
       <CreatTournamentPopUp isOpen={modalCreat} onClose={handleClosePopup}/>
    </div>
  )
}

export default TournamentInfo