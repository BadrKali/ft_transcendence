import React from 'react'
import './friendItem.css'

function FriendsItem({list}) {
  return (
    <div className='listFriendCard'>
       <div className='firendImage'>
          <img src={`http://127.0.0.1:8000${list.avatar}`}/>
       </div>
       <div className='FriendNameRand'>
            <div className='FriendName'>
                <p>{list.username}</p>
            </div>
            <div className='FriendRank'>
                <p  style={{color: '#8D93AC'}}>Rank : Gold</p>
            </div>
       </div>
    </div>
  )
}

export default FriendsItem