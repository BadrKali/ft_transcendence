import React from 'react'
import { useState, useEffect, useRef, useContext } from 'react'
import './TopBar.css'
import { useDebounce } from "@uidotdev/usehooks";
import Icon from '../../assets/Icon/icons'
import { avatars } from '../../assets/assets'
import NotificationItem from './NotificationItem'
import NoitfictaionData from '../../assets/NotificationData'
import axios from 'axios'
import SearchItem from './SearchItem'
import useFetch from '../../hooks/useFetch'
import { useNavigate } from 'react-router-dom';
import { RealTimeContext } from '../../context/RealTimeProvider'
import useAuth from '../../hooks/useAuth'
import NotificationPopup from './NotificationPopup'
import Lottie from 'lottie-react'
import EmptyBox from '../../assets/EmptyBox.json'
import ListBlockedPopup from './ListBlockedPopup'
import { SuccessToast } from '../ReactToastify/SuccessToast'
import { ErrorToast } from '../ReactToastify/ErrorToast'
import { InfoToast } from '../ReactToastify/InfoToast'
import LanguageSelector from './LanguageSelector'
import GameChallengeNotification from '../Notification/GameChallengeNotification'
import GameSettingsPopUp from '../GameSettingsPopUp/GameSettingsPopUp'
import { UserContext } from '../../context/UserContext'
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TopBar = () => {
  const [showNotif, setNotif] = useState(false)
  const dropdownRef = useRef(null);
  const dropdownSearchRef = useRef(null);
  const [isProfilActive, setProfilActive] = useState(false)
  const [isDropdownActive, setDropdownActive] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [profilData, setProfilData] = useState([]);
  const response1 = useFetch(`${BACKEND_URL}/user/stats/`)
  const navigate = useNavigate();
  const { hasNotification, clearNotification} = useContext(RealTimeContext);
  // const [notifications, setNotifications] = useState([]);
  const { auth }  = useAuth()
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenBlocked, setModalOpenBlocked] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const {gameChallenge, handleAcceptGame, handleRejectGame, gameAccepted, joinGame, setGameAccepted, showGameSettings, setShowGameSettings} = useContext(RealTimeContext);
  const { userData, userDataLoading, userDataError, updateUserFriends, notifications, setNotifications} = useContext(UserContext);
  const debouncedQuery = useDebounce(query, 300);
  const [queryEndpoint, setQueryEndpoint] = useState(`${BACKEND_URL}/user/search/?q=${query}`)

  

  const handleNotificationClick = (notif) => {
    setSelectedNotification(notif);
    setModalOpen(true);
    setNotif(false); 
  };
  const handleListBlockedClick = () => {
    setModalOpenBlocked(true);
  }

  const handleMyProfilClick = () => {
      navigate(`/user/${profilData.username}`)
  }

  const handleSettingClick = () => {
      navigate(`/setting`)
  }

  useEffect(() => {
    if (gameAccepted) {
      setGameAccepted(false);
      navigate('/invite-game', { replace:true });
    }
  }, [gameAccepted, navigate]);

  const handleClose = () => {
    setModalOpen(false);
    setNotif(false); 
  };
  const handleCloseBlocked = () => {
    setModalOpenBlocked(false)
  }

  const handleAccept = async (id, type) => {
    handleClose(); 

    let url = `${BACKEND_URL}/user/friends-request/${id}/response/`;
    let body = JSON.stringify({ 'status': 'accept' });

    try {
        if (type === 'Game Challenge') {
            url = `${BACKEND_URL}/api/game/game-challenges/${id}/response/`;
            body = JSON.stringify({ 'status': 'accepted' });
        } else if (type === 'Tournament') {

            const response = await fetch(`${BACKEND_URL}/user/tournament/invitations/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tournament details');
            }

            const data = await response.json();
            const tournamentId = data.tournament.id;

            url = `${BACKEND_URL}/user/tournament/invitations/${tournamentId}/response/`;
            body = JSON.stringify({ 'status': 'accept' });
        }


        const patchResponse = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            },
            body: body
        });

        if (!patchResponse.ok) {
            throw new Error('Network response was not ok');
        }

        const patchData = await patchResponse.json();
        console.log(`${type} accepted:`, patchData);
        SuccessToast(`${type} accepted`);

        if (type === '/    FRIEND REQUEST    /') {
          const friendsResponse = await fetch(`${BACKEND_URL}/user/friends/list/`, {
            method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${auth.accessToken}`
                }
              });
              
              if (!friendsResponse.ok) {
                throw new Error('Network response was not ok');
              }
              
              const updatedFriendsData = await friendsResponse.json();
              console.log(updatedFriendsData)
            updateUserFriends(updatedFriendsData);
        }

    } catch (error) {
        console.error(`Error accepting ${type.toLowerCase()}:`, error);
        ErrorToast(`Error accepting ${type.toLowerCase()}`);
    }
};


const handleReject = async (id, type) => {
    handleClose();
    let url = `${BACKEND_URL}/user/friends-request/${id}/response/`;
    let body = JSON.stringify({ 'status': 'reject' });

    if (type === 'Game Challenge') {
        url = `${BACKEND_URL}/api/game/game-challenges/${id}/response/`;
        body = JSON.stringify({ 'status': 'rejected' });
    }
    else if (type === 'Tournament') {
      try {

          const response =  await fetch(`${BACKEND_URL}/user/tournament/invitations/`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${auth.accessToken}`
              }
          });

          if (!response.ok) {
              throw new Error('Failed to fetch tournament details');
          }

          const data = await response.json();
          const tournamentId = data.tournament;
          console.log(data)

          url = `${BACKEND_URL}/user/tournament/invitations/${tournamentId}`;
          body = JSON.stringify({ 'status': 'reject' });

      } catch (error) {
          console.error('Error fetching tournament details:', error);
          ErrorToast('Error fetching tournament details');
          return;
      }
  }

    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
        },
        body: body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Game challenge rejected:', data);
        SuccessToast('Game challenge rejected');
    })
    .catch(error => {
        console.error('Error rejecting game challenge:', error);
        ErrorToast('Error rejecting game challenge');
    });
    // Send a Response to the oppenent
  //   fetch(`${BACKEND_URL}/api/game/game-response/${id}/`, {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${auth.accessToken}`
  //     },
  //     body: body
  // });
  };

  const handleIconClick = async () => {
    setNotif(!showNotif);
    clearNotification(); 
    await fetch(`${BACKEND_URL}/user/notifications/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
      }
    });
  };

  useEffect(() => {
    if (response1.data) {
      setProfilData(response1.data);
    }
  }, [response1.data]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotif(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 

  useEffect(() => {
    setQueryEndpoint(`${BACKEND_URL}/user/search/?q=${query}`)
  }, [query])


  useEffect(() => {
    if (debouncedQuery) {
      fetchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  const fetchResults = async () => {

      const response = await fetch((queryEndpoint), {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
      }
      })
      const data = await response.json();
      console.log(data)
      setResults(Array.isArray(data) ? data : []);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setDropdownActive(true);
  };

  const handleItemClick = (result) => {
  
    navigate(`/user/${result.username}`, {
      state: { userData: result },
    });
    setDropdownActive(false);
    setQuery('');

  };

  const handleProfilClick = (e) => {
    setProfilActive(!isProfilActive);
  };

  const handleClickOutsideSearch = (event) => {
    if (dropdownSearchRef.current && !dropdownSearchRef.current.contains(event.target)) {
      setDropdownActive(false);
    setQuery('');

    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideSearch);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSearch);
    };
  }, []);

  const handleNotifClick = () => {
    setNotif(!showNotif);
    clearNotification();
  };
  const handleExitGameSettings = () => {
    setShowGameSettings(false);
  }
  return (
    <div className='topbar-container'>
      {gameChallenge && (
            <GameChallengeNotification 
                notif={gameChallenge}
                message={`${gameChallenge.message}`}
                onAccept={handleAcceptGame}
                onReject={handleRejectGame}
            />
      )}
      {/* {showGameSettings && (
        <GameSettingsPopUp onExit={handleExitGameSettings}/>
      )} */}
      <div className='topbar-search'>
        <Icon name='search' className='topbar-search-icon'/>
        <input placeholder='Search' value={query}  type='text' onChange={handleChange}/>
        <div 
        ref={dropdownSearchRef} 
        className={isDropdownActive && results.length > 0 ? "search-dropDwon searchActiv" : "search-dropDwon"}
        >
        {results.map((result) => (
            <div 
              key={result.id} 
              onClick={() => handleItemClick(result)}
            >
              <SearchItem result={result} />
            </div>
          ))}
        </div>
      </div>
      <div className='topbar-profile'>
        <LanguageSelector />
        <div ref={dropdownRef} className="icon-container"  onClick={handleIconClick}>
          <Icon  name='notification' className={showNotif ? 'topbar-notification-icon active-icon' : 'topbar-notification-icon' }/>
          {hasNotification && <span className="notification-badge"></span>}
          <div  className={showNotif ? "dropDwon active" : "dropDwon"}>
              {notifications && notifications.length > 0 ?
                  notifications.map((notif) => (
                    <NotificationItem key={notif.id} notif={notif} onClick={() => handleNotificationClick(notif)}  />
                  )) : (
                    <div className="DropDownNotificationAnimation">
                        <div className="EmptyBox"> <Lottie animationData={EmptyBox} /> </div>
                    </div>
                  )
                }
          </div>
          {selectedNotification && (
            <NotificationPopup isOpen={modalOpen} onClose={handleClose} notif={selectedNotification} onAccept={handleAccept} onReject={handleReject} />
          )}
        </div>
        <div className='profile-pic-container'  onClick={handleProfilClick}>
          <div className='profile-pic'>
            <img src={`${BACKEND_URL}${userData.avatar}`}/>
          </div>
          <span>{userData.username}</span>
          <div  className={isProfilActive ? "dropDwonProfil profilActive" : "dropDwonProfil"}>
            <div className='dropList'>
              <p className='list' onClick={handleMyProfilClick}>View My Profil</p>
              <p className='list' onClick={handleListBlockedClick}>List Blocked</p>
              <p className='list' onClick={handleSettingClick}>Setting</p>
              <p className='list'>Log Out</p>
            </div>
          </div>
            <ListBlockedPopup isOpen={modalOpenBlocked} onClose={handleCloseBlocked} />
        </div>
      </div>
    </div>
  )
}

export default TopBar