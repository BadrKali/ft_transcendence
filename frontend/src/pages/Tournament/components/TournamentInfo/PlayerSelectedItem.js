import React from 'react'
import './playerSelectedItem.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function PlayerSelectedItem({player}) {
    console.log(player)
  return (
    <div className='slectedPlayerItem'>
        <div className='imagePlayerSelected'>
            <img src={`${BACKEND_URL}${player.image}`}/>
        </div>
        <p>{player.label}</p>
    </div>
  )
}

export default PlayerSelectedItem