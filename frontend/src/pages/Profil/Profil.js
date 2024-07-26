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





const Profil = () => {
  const { userId } = useParams();
  const [profilData, setProfilData] = useState([]);
  const navigate = useNavigate();
  const { auth }  = useAuth()
  const location = useLocation();
  const { userData } = location.state || {};
  const {data ,isLoading, error} = useFetch(`http://localhost:8000/user/stats/${userData.id}`)

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
  const handleAddFriend = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user/friends-request/${userData.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred while sending the friend request.');
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert(error.message);
    }
  };



  const handleItemClick = () => {
    navigate(`/chat`);
  };

  return (
    <div className='dashboard-contianer'>
       <div className='profil-icons'>
          <div className='profil-buttons'>
            <div className='AddFriend-button profil-button' onClick={handleAddFriend}>
                <Icon name='AddFriend' className='Add-Friend profil-icon' />
                <p>add Friend</p>
            </div>
            <div className='ChatFriend-button profil-button' onClick={() => handleItemClick()}>
                <Icon name='ChatFriend' className='Chat-Friend profil-icon' />
                <p>Message</p>
            </div>
            <div className='Challangefriend-button profil-button'>
                <Icon name='Challangefriend' className='Challange-friend profil-icon' />
                <p>Challange</p>
                
            </div>
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