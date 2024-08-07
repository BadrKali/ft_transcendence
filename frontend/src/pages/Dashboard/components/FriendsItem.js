import React, { useEffect, useState } from 'react'
import './friendItem.css'

function FriendsItem({list, friendsStatus}) {
  const [isonline, setOnline] = useState(false);

  useEffect(() => {
    console.log(list.username + "   ", list.is_online )
  }, [])
  useEffect(() => {
    if (typeof friendsStatus === 'object' && friendsStatus !== null) {
      const friendStatus = friendsStatus[list.id];

      if (friendStatus) {
        setOnline(friendStatus === 'online');
      } else {
        if (list.is_online)
            setOnline(true)
        else
          setOnline(false)
      }
    }
    else{
      if (list.is_online)
        setOnline(true)
      else
        setOnline(false)

    }
    if (list.is_online)
        setOnline(true)
  }, [friendsStatus, list.id]);



  return (
    <div className='listFriendCard'>
       <div className='firendImage'>
          <img src={`http://127.0.0.1:8000${list.avatar}`}
          style={{ filter: isonline ? 'none' : 'grayscale(100%)' }}/>
          
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