import React from 'react';
import './notificationPopup.css'
const NotificationPopup = ({ isOpen, onClose, notif, onAccept, onReject })=> {
  console.log("hahaha " + isOpen )
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
          <button onClick={() => onAccept(notif.id)}>Accept</button>
          <button onClick={() => onReject(notif.id)}>Reject</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;