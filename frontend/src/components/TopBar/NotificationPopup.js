import React, { useState, useEffect } from 'react';
import './notificationPopup.css'
import useFetch from '../../hooks/useFetch';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const GeneralNotificationComponent = ({ notif, typeNotif, profilData, BACKEND_URL, onAccept, onReject }) => (
    <>
      <h2>{typeNotif}</h2>
      <div className='NotifUserImageName'>
        <img src={`${BACKEND_URL}${profilData.avatar}`} alt="profile_pic" />
        <div className='NotiddName'>
          <p>{profilData.username}</p>
        </div>
      </div>
      <p className='NotifMessage'>{notif.message}</p>
      <div className='buttunsAR'>
        <button onClick={() => onAccept(notif.sender, typeNotif)}>Accept</button>
        <button onClick={() => onReject(notif.sender, typeNotif)}>Reject</button>
      </div>
    </>
);

const AchievementComponent = ({notif}) => (
    <>
      <h2>Achievement</h2>
      <div className='NotifUserImageNameAchievment'>
        <p>Image</p>
      </div>
      <p className='NotifMessageAchievment'>{notif.message}</p>
      <div className='AchivmentTitleDes'>
        <p className='NotifTitleAchievment'>{notif.title}</p>
        <p className='NotifDescriptionAchievment'>{notif.description}</p>
      </div>
    </>
);

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
      setTypeNotif('Game Challenge');
    } else if (notif.message === 'You Got a new Achievment'){
      setTypeNotif('Achievement')
    } 
    else {
      setTypeNotif('Invitation');
    }
  }, [notif]);


  if (!isOpen) {
    return null;
  }
  console.log(notif);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        {typeNotif === 'Achievement' ? (
          <AchievementComponent notif={notif} BACKEND_URL={BACKEND_URL} />
        ) : (
          <GeneralNotificationComponent
            notif={notif}
            typeNotif={typeNotif}
            profilData={profilData}
            BACKEND_URL={BACKEND_URL}
            onAccept={onAccept}
            onReject={onReject}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;