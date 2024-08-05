import React, { useState, useEffect } from 'react';
import './notificationPopup.css'

const NotificationPopup = ({ isOpen, onClose, notif, onAccept, onReject })=> {

  const [typeNotif, setTypeNotif] = useState('');
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
        <p>{notif.message}</p>
        <div className='buttuns'>
          <button onClick={() => onAccept(notif.sender, typeNotif)}>Accept</button>
          <button onClick={() => onReject(notif.sender, typeNotif)}>Reject</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;