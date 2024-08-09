import React, { useState, useEffect } from 'react';
import './notificationPopup.css'
import useFetch from '../../hooks/useFetch';
import backGround from '../../assets/backGroungHell.png'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const GeneralNotificationComponent = ({ notif, typeNotif, profilData, BACKEND_URL, onAccept, onReject }) => (
    <>
      <h2>{typeNotif}</h2>
      <div className='NotifUserImageName-container' style={{
            backgroundImage: `url(${backGround})`,
          }}>
          <div className='NotifUserImageName'>
            <img src={`${BACKEND_URL}${profilData.avatar}`} alt="profile_pic" />
            <div className='NotiddName'>
              <p>{profilData.username}</p>
              <p>Rank : Gold</p>
            </div>
          </div>
          <div className='WinRate'>
            <p>Win Rate</p>
            <p>50%</p>
          </div>
      </div>
      <div className='buttunsAR'>
        <button className='buttonA Accept' onClick={() => onAccept(notif.sender, typeNotif)}>Accept</button>
        <button  className='buttonA Reject' onClick={() => onReject(notif.sender, typeNotif)}>Reject</button>
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
      setTypeNotif('GAME CHALLANGE');
    } else if (notif.message === 'You Got a new Achievment'){
      setTypeNotif('Achievement')
    } 
    else {
      setTypeNotif('/    FRIEND REQUEST    /');
    }
  }, [notif]);


  if (!isOpen) {
    return null;
  }
  console.log(notif);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modalCloseButton" onClick={onClose}>&times;</button>
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