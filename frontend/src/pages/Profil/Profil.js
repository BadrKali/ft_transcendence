import React, { useEffect, useState } from 'react'
import './profil.css'
import DashProfil from './components/DashProfil'
import MatchHistory from './components/MatchHistory'
import Achievments from './components/Achievments'
import Friends from './components/Friends'
import useFetch from '../../hooks/useFetch'
import Icon from '../../assets/Icon/icons'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'
import { useLocation } from 'react-router-dom';
import BlockUnblockButton from './components/BlockUnblockButton'
import AddFriendUnfriendButton from './components/AddFriendUnfriendButton'
import ChatFriendButton from './components/ChatFriendButton'
import ChallangefriendButton from './components/ChallangefriendButton'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;



const Profil = () => {
  const { userId } = useParams();
  const [profilData, setProfilData] = useState([]);
  const navigate = useNavigate();
  const { auth }  = useAuth()
  const location = useLocation();
  const { userData } = location.state || {};
  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/user/stats/${userData.id}`)

  useEffect(() => {
    if (data) {
      setProfilData(data);
    }
  }, [data]);
  
  if (error) {
    if (error === 'You are blocked from viewing this content.') {
        navigate('/')
        return null;
    }
    return <div>{error}</div>;
  } 


  return (
    <div className='dashboard-contianer'>
       <div className='profil-icons'>
          <div className='profil-buttons'>
            <AddFriendUnfriendButton FriendId={userData.id} />
            <ChatFriendButton />
            <ChallangefriendButton />
            <BlockUnblockButton blockedId={userData.id}/>
        </div>
       </div>
       <div className="dashboard-profil">
          <div className="profilHistoryAcgievmeants-container-profil">
              <div className="profil-container-profil">
                <DashProfil profil={profilData}/>
              </div>
              <div className="historyAchievments-container-profil">
                <div className="history-container-profil">
                <MatchHistory /> 
                </div>
                <div className="achievments-container-profil">
                <Achievments userId={userData.id}/>
                </div>
              </div>
          </div>
       </div>

    </div>
  )
}

export default Profil