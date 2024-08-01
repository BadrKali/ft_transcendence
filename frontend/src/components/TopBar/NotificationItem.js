import React from 'react'
import { useState, useEffect } from 'react';
import './notificationItem.css'
import useFetch from '../../hooks/useFetch'
import NotificationPopup from './NotificationPopup';
import { formatDistanceToNow, parseISO } from 'date-fns';



function formatTimeAgo(dateString) {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}


function NotificationItem({notif, onClick }) {
  const [profilData, setProfilData] = useState([]);
  const {data ,isLoading, error} = useFetch(`http://localhost:8000/user/stats/${notif.sender}`)

  useEffect(() => {
    if (data) {
      setProfilData(data);
    }
  }, [data]);

  
  return (
      <div className="notifCard" onClick={() => onClick(notif)}>
        <div className="notifImage">
            <img src={`http://127.0.0.1:8000${profilData.avatar}`} alt="profil_pic" />
        </div>
        <div className="notifInfo">
            <p>{profilData.username}<span>{notif.message}</span></p>
            <span className='notifTime'>{formatTimeAgo(notif.timestamp)}</span>
        </div>
      </div>

  )
}

export default NotificationItem