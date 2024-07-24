import React from 'react'
import { useState, useEffect } from 'react';
import './notificationItem.css'
import useFetch from '../../hooks/useFetch'

function NotificationItem({notif}) {
  const [profilData, setProfilData] = useState([]);
  const {data ,isLoading, error} = useFetch(`http://localhost:8000/user/stats/${notif.sender}`)
  useEffect(() => {
    if (data) {
      setProfilData(data);
    }
  }, [data]);

  return (
    <div className="notifCard">
      <div className="notifImage">
          <img src={`http://127.0.0.1:8000${profilData.avatar}`} alt="profil_pic" />
      </div>
      <div className="notifInfo">
          <p>{profilData.username}<span>{notif.message}</span></p>
          <span className='notifTime'>{notif.timestamp}</span>
      </div>
    </div>
  )
}

export default NotificationItem