import React from 'react'
import { useState, useEffect } from 'react'
import './friends.css'
import History from '../../../assets/MatchHistoryData'
import FriendsItem from './FriendsItem'
import useFetch from '../../../hooks/useFetch'
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react'
import NoOneTotalkTo from '../../Chat/ChatAssets/NoOneTotalkTo.json'
import style from '../../Chat/Components/ContactSection/ContactSection.module.css'


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Friends() {
  const [listFriend, setListFriend] = useState([]);
  const navigate = useNavigate();

  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/user/friends/list/`)
  useEffect(() => {
    if (data) {
      setListFriend(data);
    }
  }, [data]);

  function handleItemClick(list) {
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
            <div className="ConversationContainerAnimation">
              <div className="NoOneToTalkTost"> <Lottie animationData={NoOneTotalkTo} /> </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Friends