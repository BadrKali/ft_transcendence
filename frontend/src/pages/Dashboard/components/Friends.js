import React from 'react'
import { useState, useEffect } from 'react'
import './friends.css'
import History from '../../../assets/MatchHistoryData'
import FriendsItem from './FriendsItem'
import useFetch from '../../../hooks/useFetch'
import { useNavigate } from 'react-router-dom';

function Friends() {
  const [listFriend, setListFriend] = useState([]);
  const navigate = useNavigate();

  const {data ,isLoading, error} = useFetch(`http://localhost:8000/user/friends/list/`)
  useEffect(() => {
    if (data) {
      setListFriend(data);
    }
  }, [data]);

  function handleItemClick(list) {
    console.log("baaaaa")
    navigate(`/user/${list.username}`, {
      state: { userData: list },
    });
  }

  return (
    <div className='friendsContainer'>
      <div className='friendsBox'>
        <div className='headerFrends'>
          <h2>FRIENDS</h2>
        </div>
        <div className='listFriends'>
          {listFriend.length > 0 ? (
            listFriend.map((list) => (
              <div key={list.id} onClick={() => handleItemClick(list)}>
                <FriendsItem list={list} />
              </div>
            ))
          ) : (
            <div className='emptyFriendsMessage'>
              <p>Looks like your friends list is empty. Why not invite some buddies to join you here?</p>
              <button >Invite Friends</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Friends