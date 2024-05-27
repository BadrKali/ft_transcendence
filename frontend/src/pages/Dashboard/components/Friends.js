import React from 'react'
import './friends.css'
import History from '../../../assets/MatchHistoryData'
import FriendsItem from './FriendsItem'

function Friends() {
  return (
    <div className='friendsContainer'>
        <div className='friendsBox'>
            <div className='headerFrends'>
              <h2>FRIENDS</h2>
            </div>
            <div className='listFriends'>
              {History.match_history.map((history) => (
                    <FriendsItem key={history.id} history={history}/>
              ))}
            </div>
            <div className='buttonAddFriends'>
              <button><p>ADD FRIEND</p></button>
            </div>
        </div>
    </div>
  )
}

export default Friends