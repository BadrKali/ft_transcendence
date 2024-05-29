import React from 'react'
import './TopBar.css'
import Icon from '../../assets/Icon/icons'
import { avatars } from '../../assets/assets'


const TopBar = () => {
  return (
    <div className='topbar-container'>
      <div className='topbar-search'>
        <Icon name='search' className='topbar-search-icon'/>
        <input placeholder='Search' type='text'/>
      </div>
      <div className='topbar-profile'>
        <Icon name='notification' className='topbar-notification-icon'/>
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