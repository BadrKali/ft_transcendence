import React from 'react'
import './playerSelectedItem.css'
import { avatarsUnkown } from '../../../../assets/assets';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function PlayerSelectedItem({player}) {
  const unknownAvatar = avatarsUnkown.img;

  return (
    <div className='slectedPlayerItem'>
        <div className='imagePlayerSelected'>
            <img src={player.image ? `${BACKEND_URL}${player.image}` : unknownAvatar}/>
        </div>
        <p>{player.username}</p>
    </div>
  )
}

export default PlayerSelectedItem