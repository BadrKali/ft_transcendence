import React, { useState, useEffect } from 'react';
import './notificationPopup.css'
import useFetch from '../../hooks/useFetch';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const NotificationPopup = ({ isOpen, onClose, notif, onAccept, onReject })=> {
  const [typeNotif, setTypeNotif] = useState('');
  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/user/stats/${notif.sender}`)
  const [profilData, setProfilData] = useState([]);

  useEffect(() => {
    if (data) {
    setProfilData(data);
    }
  }, [data]);

  useEffect(() => {
    console.log(notif.message)
    if (notif.message === 'has challenged you to a game!') {
      setTypeNotif('game');
    } else {
      setTypeNotif('invite');
    }
  }, [notif]);


  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>Notification</h2>
        <div className='NotifUserImageName'>
                <img src={`${BACKEND_URL}${profilData.avatar}`} alt="profil_pic" />
                <div className='NotiddName'>
                    <p>{profilData.username}</p>
                </div>
        </div>
        <p className='NotifMessage'>{notif.message}</p>
        <div className='buttunsAR'>
          <button onClick={() => onAccept(notif.sender, typeNotif)}>Accept</button>
          <button onClick={() => onReject(notif.sender, typeNotif)}>Reject</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;