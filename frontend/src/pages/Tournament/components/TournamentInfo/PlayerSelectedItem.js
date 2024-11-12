import React from 'react'
import './playerSelectedItem.css'
import { avatarsUnkown } from '../../../../assets/assets';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function PlayerSelectedItem({player, onRemove}) {
  const unknownAvatar = avatarsUnkown.img;

  let name = 'username'
  
  if (player.username)
    name = player.username
  else
    name = player.label

  return (
    <div className='slectedPlayerItem'>
       <button className="remove-button" onClick={onRemove}>x</button>
        <div className='imagePlayerSelected'>
            <img src={player.avatar ? `${BACKEND_URL}${player.avatar}` : unknownAvatar}/>
        </div>
        <p>{name}</p>
    </div>
  )
}

export default PlayerSelectedItem