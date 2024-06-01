import React from 'react'
import './notificationItem.css'
function NotificationItem({notif}) {
  return (
    <div className="notifCard">
      <div className="notifImage">
          <img src={notif.image} alt="profil_pic" />
      </div>
      <div className="notifInfo">
          <p>{notif.user}<span>{notif.description}</span></p>
          <span className='notifTime'>{notif.time}</span>
      </div>
    </div>
  )
}

export default NotificationItem