import React from 'react'
import { useState, useEffect, useRef, useContext } from 'react'
import './TopBar.css'
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
  const [queryEndpoint, setQueryEndpoint] = useState(`${BACKEND_URL}/user/search/?q=${query}`)
  const response1 = useFetch(`${BACKEND_URL}/user/stats/`)
  const navigate = useNavigate();
  const { hasNotification, clearNotification} = useContext(RealTimeContext);
  const [notifications, setNotifications] = useState([]);
  const { auth }  = useAuth()
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenBlocked, setModalOpenBlocked] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleNotificationClick = (notif) => {
    console.log(notif);
    setSelectedNotification(notif);
    setModalOpen(true);
    setNotif(false); 
  };
  const handleListBlockedClick = () => {
    setModalOpenBlocked(true);
  }

  const handleClose = () => {
    setModalOpen(false);
    setNotif(false); 
  };
  const handleCloseBlocked = () => {
    setModalOpenBlocked(false)
  }

  const handleAccept = (id, type) => {
      handleClose();
      let url = `${BACKEND_URL}/user/friends-request/${id}/response/`;
      let body = JSON.stringify({ 'status': 'accept' });
  
      if (type === 'Game Challenge') {
          url = `${BACKEND_URL}/game-challenges/${id}/response/`; 
          body = JSON.stringify({ 'response': 'accepted' });
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
        console.log('Friend request accepted:', data);
        alert('Friend request accepted');
    })
    .catch(error => {
        console.error('Error accepting friend request:', error);
        alert('Error accepting friend request');
    });
  };

  const handleReject = (id, type) => {
    handleClose();
    let url = `${BACKEND_URL}/user/friends-request/${id}/response/`;
    let body = JSON.stringify({ 'status': 'accept' });

    if (type === 'Game Challenge') {
        url = `${BACKEND_URL}/game-challenges/${id}/response/`; 
        body = JSON.stringify({ 'response': 'accepted' });
    }

    fetch(url, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({ 'status' : 'reject' })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log('Friend request rejected:', data);
          alert('Friend request rejected');
      })
      .catch(error => {
          console.error('Error rejecting friend request:', error);
          alert('Error rejecting friend request');
      });
  };

  const handleIconClick = async () => {
    setNotif(!showNotif);

    if (!showNotif) {
      try {
        const response = await fetch(`${BACKEND_URL}/user/notifications/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
          clearNotification(); 
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
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


  const response = useFetch(queryEndpoint)
  useEffect(() => {
    if (response.data) {
      setResults(Array.isArray(response.data) ? response.data : []);
    }
  }, [response.data]);
  
  const handleChange = (e) => {
    setQuery(e.target.value);
    setDropdownActive(true);
  };
  const handleItemClick = (result) => {
    console.log("good")
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
  return (
    <div className='topbar-container'>
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
        <div ref={dropdownRef} className="icon-container"  onClick={handleIconClick}>
          <Icon  name='notification' className={showNotif ? 'topbar-notification-icon active-icon' : 'topbar-notification-icon' }/>
          {hasNotification && <span className="notification-badge"></span>}
          <div  className={showNotif ? "dropDwon active" : "dropDwon"}>
              {notifications.length > 0 ?
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
            <img src={`${BACKEND_URL}${profilData.avatar}`}/>
          </div>
          <span>{profilData.username}</span>
          <div  className={isProfilActive ? "dropDwonProfil profilActive" : "dropDwonProfil"}>
            <div className='dropList'>
              <p className='list'>View My Profil</p>
              <p className='list' onClick={handleListBlockedClick}>List Blocked</p>
              <p className='list'>Setting</p>
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