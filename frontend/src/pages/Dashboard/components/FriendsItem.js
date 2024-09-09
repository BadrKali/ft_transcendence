import React, { useEffect, useState } from 'react'
import './friendItem.css'
import Lottie from 'lottie-react';
import online from '../../Chat/ChatAssets/online.json'
import offline from '../../Chat/ChatAssets/offline.json'
import { useTranslation } from 'react-i18next';

function FriendsItem({list, friendsStatus}) {
  const [isonline, setOnline] = useState(false);
  const { t } = useTranslation();


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
           <div className='FriendStatus'>
              {isonline ? <div className="statusOnline"> <Lottie animationData={online} /></div> : 
              <div className="statusOnline"> <Lottie animationData={offline} /></div>}
          </div>
       </div>
       <div className='FriendNameRand'>
            <div className='FriendName'>
                <p>{list.username}</p>
            </div>
            <div className='FriendRank'>
                <p  style={{color: '#8D93AC'}}>{t('Rank')} : Gold</p>
            </div>
       </div>
    </div>
  )
}

export default FriendsItem