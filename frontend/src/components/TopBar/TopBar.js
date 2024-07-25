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
import { NotificationContext } from '../Notification/NotificationContext'
import useAuth from '../../hooks/useAuth'
import NotificationPopup from './NotificationPopup'

const TopBar = () => {
  const [showNotif, setNotif] = useState(false)
  const dropdownRef = useRef(null);
  const dropdownSearchRef = useRef(null);
  const [isDropdownActive, setDropdownActive] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [profilData, setProfilData] = useState([]);
  const [queryEndpoint, setQueryEndpoint] = useState(`http://localhost:8000/user/search/?q=${query}`)
  const response1 = useFetch('http://localhost:8000/user/stats/')
  const navigate = useNavigate();
  const { hasNotification, clearNotification} = useContext(NotificationContext);
  const [notifications, setNotifications] = useState([]);
  const { auth }  = useAuth()
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleNotificationClick = (notif) => {
    setSelectedNotification(notif);
    setModalOpen(true);
    setNotif(false); 
  };

  const handleClose = () => {
    setModalOpen(false);
    setNotif(false); 
  };

  const handleAccept = (id) => {
      handleClose();
      fetch(`http://localhost:8000/user/friends-request/${id}/response/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
        },
        body: JSON.stringify({ 'status' : 'accept' })
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

  const handleReject = (id) => {
    handleClose();
    fetch(`http://localhost:8000/user/friends-request/${id}/response/`, {
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
          // Update UI or state as necessary
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
        const response = await fetch('http://localhost:8000/user/notifications/', {
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
    setQueryEndpoint(`http://localhost:8000/user/search/?q=${query}`)
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
                  {notifications.map((notif) => (
                    <NotificationItem key={notif.id} notif={notif} onClick={() => handleNotificationClick(notif)}  />
                  ))}
          </div>
          {selectedNotification && (
          <NotificationPopup isOpen={modalOpen} onClose={handleClose} notif={selectedNotification} onAccept={handleAccept} onReject={handleReject} />
      )}
        </div>
        <div className='profile-pic-container'>
          <div className='profile-pic'>
            {/* <div className='topbar-online-status'></div> */}
            <img src={`http://127.0.0.1:8000${profilData.avatar}`}/>
          </div>
          <span>{profilData.username}</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar