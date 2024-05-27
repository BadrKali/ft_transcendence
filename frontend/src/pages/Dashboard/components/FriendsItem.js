import React from 'react'
import './friendItem.css'

function FriendsItem({history}) {
  return (
    <div className='listFriendCard'>
       <div className='firendImage'>
            <img className={history.active ? "online" : "offline"} src={history.image}/>
       </div>
       <div className='FriendNameRand'>
            <div className='FriendName'>
                <p>{history.player_name}</p>
            </div>
            <div className='FriendRank'>
                <p  style={{color: '#8D93AC'}}>{history.rank}</p>
            </div>
       </div>
    </div>
  )
}

export default FriendsItem