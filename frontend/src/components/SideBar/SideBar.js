import React, { useState } from 'react'
import './SideBar.css'
import { assets } from '../../assets/assets'
import { Link, useLocation }  from 'react-router-dom'
import Icon from '../../assets/Icon/icons'
import { SideBarData } from './SideBarData'

const SideBar = () => {
  const location = useLocation().pathname
  
  return (
    <div className='sidebar-container'>
      <div className='sidebar-logo-container'>
        <img src={assets.logo} alt='Pongy Logo'/>
      </div>
        <nav className='nav-container'>
          <ul className='nav-menu-items'>
            {SideBarData.map((item, index) => {
              return(
                <li key={index} className={`navbar-toggle ${location === item.path ? 'active' : ''}`}>
                  <Link to={item.path} className='navbar-toggle-link' >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              )
            })}
            <li className='navbar-toggle-logout'>
              <div className='logout-sep'>
                <img src={assets.sep}/>
              </div>
              <Link to='/logout' className='logout-link'>
                <Icon name='logout' className='navbar-toggle-icon'/>
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
    </div>
  )
}

export default SideBar