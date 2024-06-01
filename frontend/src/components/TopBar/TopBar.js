import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './TopBar.css'
import Icon from '../../assets/Icon/icons'
import { avatars } from '../../assets/assets'
import NotificationItem from './NotificationItem'
import NoitfictaionData from '../../assets/NotificationData'

const TopBar = () => {
  const [showNotif, setNotif] = useState(false)
  const dropdownRef = useRef(null);

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

  return (
    <div className='topbar-container'>
      <div className='topbar-search'>
        <Icon name='search' className='topbar-search-icon'/>
        <input placeholder='Search' type='text'/>
      </div>
      <div className='topbar-profile'>
        <div ref={dropdownRef} className="icon-container"  onClick={() => setNotif(!showNotif)}>
          <Icon  name='notification' className={showNotif ? 'topbar-notification-icon active-icon' : 'topbar-notification-icon' }/>
          <div  className={showNotif ? "dropDwon active" : "dropDwon"}>
                  {NoitfictaionData.map((notif) => (
                    <NotificationItem key={notif.id} notif={notif} />
                  ))}
          </div>
        </div>
        <div className='profile-pic-container'>
          <div className='profile-pic'>
            {/* <div className='topbar-online-status'></div> */}
            <img src={avatars[0].img}/>
          </div>
          <span>Perdoxii_noyat</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar