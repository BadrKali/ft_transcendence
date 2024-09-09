import React from 'react'
import './playerSelectedItem.css'

function PlayerSelectedItem({player}) {
    console.log(player)
  return (
    <div className='slectedPlayerItem'>
        <div className='imagePlayerSelected'>
            <img src={`http://127.0.0.1:8000${player.image}`}/>
        </div>
        <p>{player.label}</p>
    </div>
  )
}

export default PlayerSelectedItem