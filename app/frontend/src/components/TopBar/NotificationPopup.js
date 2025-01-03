import React, { useState, useEffect } from 'react';
import './notificationPopup.css'
import { useTranslation } from 'react-i18next'
import useFetch from '../../hooks/useFetch';
import backGround from '../../assets/backGroungHell.png'
import MainButton from '../MainButton/MainButton';
import SecondButton from '../MainButton/SecondButton';
import Icon from '../../assets/Icon/icons';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const GeneralNotificationComponent = ({ notif, typeNotif, profilData, onAccept, onReject, t , loading}) => (
    <>
      <h2>{typeNotif}</h2>

      <div className='NotifUserImageName-container' style={{
        backgroundImage: `url(${backGround})`,
      }}>
        { loading &&
          <div className='NotifUserImageName'>
            <div className='NotiddName'>
              <p>{profilData.username}</p>
              <p>{t('Rank')} : Gold</p>
            </div>
          </div>
          }
          <div className='WinRate'>
            <p>{t('Win Rate')}</p>
            <p>50%</p>
          </div>
      </div>
      <div className='buttunsAR'>

        <MainButton type="button" functionHandler={() => onAccept(notif.sender_id, typeNotif)}  content={t('Accept')} />

      
        <SecondButton type="button" functionHandler={() => onReject(notif.sender_id, typeNotif)} content={t('Reject')}/>
      </div>
    </>
);

const TournamentPopupComponent = ({ notif, typeNotif, profilData, onAccept, onReject, t }) => {
  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/api/user/tournament/invitations/`)
  
  return (
    <>
      <h2 className='typeNotif'>{typeNotif}</h2>
      <h3 className='TounoumentTitle'>{data?.tournament?.tournament_name || 'Loading tournament name...'}</h3>
      <div className='NotifUserImageName-container' style={{
            backgroundImage: `url(${backGround})`,
          }}>
          <div className='NotifUserImageName'>
            <div className='NotiddName'>
              <p>{profilData.username}</p>
              <p>{t('Rank')} : Gold</p>
            </div>
          </div>
          <div className='tournament-info-item popup-item'>
              <Icon name='chump_cup' className="tournament-info-icon"/>
              <div className='tournament-info-item-txt'>
                  {data && data.tournament ? (
                      <>
                          <p>{data.tournament.tournament_prize}</p>
                          <span>{t('Total Prize Pool')}</span>
                      </>
                  ) : (
                      <span>{t('Total Prize Pool')}</span> 
                  )}
              </div>
          </div>
          <div className='tournament-info-item popup-item'>
                <Icon name='location' className="tournament-info-icon"/>
                <div className='tournament-info-item-txt'>
                  {data && data.tournament ? (
                    <>
                      <p>{t('Map')}</p>
                      <span>{data.tournament.tournament_map}</span>
                    </> ) : (
                      <p>{t('Map')}</p>
                    )}
                </div>
            </div>
            <div className='tournament-subscribers popup-item'>
                <div className='tournament-subscribers-avatars'>
                    {data && data.tournament && data.tournament.tournament_participants ? (
                        data.tournament.tournament_participants.map((player, index) => (
                            <img 
                                key={index} 
                                className={`image${index + 1}`} 
                                src={`${BACKEND_URL}${player.avatar}`} 
                                alt={`Player ${index + 1}`} 
                            />
                        ))
                    ) : (
                        <p>{t('Loading participants...')}</p> 
                    )}
                </div>
                <span className='tournament-subscribers-counter'>
                    {data && data.tournament && data.tournament.tournament_participants ? (
                        `${data.tournament.tournament_participants.length}/4 Joined`
                    ) : (
                        '0/4 Joined' 
                    )}
                </span>
            </div>
      </div>
      <div className='buttunsAR'>
        <MainButton type="button" functionHandler={() => onAccept(notif.sender_id, typeNotif)} content={t('Accept')} />
        <SecondButton type="button" functionHandler={() => onReject(notif.sender_id, typeNotif)} content={t('Reject')} />
      </div>
    </>
  );
};

const AchievementComponent = ({notif , t}) => (

    <>
      <h2>{t('Achievement')}</h2>
      <div className='NotifUserImageNameAchievment'>
          
              <Icon name="Achiev1" className="AchievmentsIcon"/> 
      
      </div>
      <p className='NotifMessageAchievment'>{notif.message}</p>
      <div className='AchivmentTitleDes'>
        <h3 className='NotifTitleAchievment'>{notif.title}</h3>
        <h4 className='NotifDescriptionAchievment'>{notif.description} </h4>
      </div>
    </>
);

const NotificationPopup = ({ isOpen, onClose, notif, onAccept, onReject })=> {
  const [typeNotif, setTypeNotif] = useState('');
  const {data ,isLoading, error} = useFetch(`${BACKEND_URL}/api/user/stats/${notif.sender_id}`)
  const [profilData, setProfilData] = useState([]);
  const { t } = useTranslation();
  const [Loading, setLoading] = useState(true)

  
  useEffect(() => {
    if (data) {
      setProfilData(data);
    }
  }, [data]);

  useEffect(() => {

    if (notif.message === 'has challenged you to a game!') {
      setTypeNotif('Game Challenge');
    }
    else if( notif.message === 'invited you to a tournament'){
  
        setTypeNotif('Tournament');
  

    } else if (notif.message === 'You Got a new Achievment'){
      setTypeNotif('Achievement')
    } 
    else {
      setTypeNotif('FRIEND REQUEST');
    }
  }, [notif]);


  
  useEffect(()=>{
    if (profilData.length){
      setLoading(false)
    }
  }, [profilData])
  
  
  if (!isOpen) {
    return null;
  }
  return (
    <div className="modal-overlay">
      {Loading &&
      <div className="modal">
        <button className="modalCloseButton" onClick={onClose}>&times;</button>
        {typeNotif === 'Achievement' && (
        <AchievementComponent notif={notif} BACKEND_URL={BACKEND_URL} t={t} />
      )}
        {typeNotif === 'Tournament' && (
          <TournamentPopupComponent
            notif={notif}
            typeNotif={typeNotif}
            profilData={profilData}
            onAccept={onAccept}
            onReject={onReject}
            t={t}
          />
        )}
        {typeNotif !== 'Achievement' && typeNotif !== 'Tournament' && (
          <GeneralNotificationComponent
            notif={notif}
            typeNotif={typeNotif}
            profilData={profilData}
            onAccept={onAccept}
            onReject={onReject}
            t={t}
            loading={Loading}
          />
        )}
      </div>
  }
    </div>
  );
};

export default NotificationPopup; 