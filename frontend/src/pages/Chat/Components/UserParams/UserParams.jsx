import React, { useContext, useState } from 'react'
import style from './UserParams.module.css'
import {Phone, VideoCamera } from 'phosphor-react'
import Icon from '../../../../assets/Icon/icons.js'
import { useNavigate } from 'react-router-dom';
import { chatPartnerContext } from '../../Chat.jsx';
import { SuccessToast } from '../../../../components/ReactToastify/SuccessToast.js';
import { ErrorToast } from '../../../../components/ReactToastify/ErrorToast.js';
import useAuth from '../../../../hooks/useAuth.js';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const UserParams = () => {
  const { auth } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const {ChatPartner} = useContext(chatPartnerContext);
  const navigate = useNavigate();

    function handleVisiteProfil(){
      if (ChatPartner)
        navigate(`/user/${ChatPartner?.username}`, {
          state: { userData: ChatPartner },
        });
    }

    function handleInviteToGame(){
      alert('Hi InviteToGame Clicked');
    }

    const  handleBlocking =  async() =>{
      const url = `${BACKEND_URL}/user/${ChatPartner.id}/block-unblock/`;
      try {
          const response = await fetch(url, {
              method: isBlocked ? 'DELETE' : 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${auth.accessToken}`,
              },
          });

          if (response.ok) {
              setIsBlocked(!isBlocked);
              SuccessToast(`User has been ${isBlocked ? 'unblocked' : 'blocked'} successfully.`);
              // alert(`User has been ${isBlocked ? 'unblocked' : 'blocked'} successfully.`);
          } else {
              const data = await response.json();
              ErrorToast(data.error || 'An error occurred.');
              // alert(data.error || 'An error occurred.');
          }
      } catch (error) {
          console.error(`Error ${isBlocked ? 'unblocking' : 'blocking'} user:`, error);
          ErrorToast('An error occurred.');
          // alert('An error occurred.');
      }
    // console.log(ChatPartner)
    }

    function handlePhoneCall(){
      alert('Hi ! HandlePhoneCall Clicked');
    }

    function handleVideoCall(){
      alert('Hi ! HnadleVideoCall Clicked');
    }

  return (
    <div className={style.UserParams}>
            <div className={style.visiteProfilBack} onClick={handleVisiteProfil}>
            <Icon name='VisiteProfil' className={style.visiteProfil} />
            </div>

            <div className={style.InviteToGameBack} onClick={handleInviteToGame}>
            <Icon name='InviteToGame' className={style.InviteToGame} />
            </div>

            <div className={style.BlockBack} onClick={handleBlocking}>
            <Icon name='Block' className={style.Block} />
            </div>

            <div className={style.PhoneBack} onClick={handlePhoneCall}>
              <Phone className={style.Phone} size={35} />
            </div>

            <div className={style.VideoCallBack} onClick={handleVideoCall}>
              <VideoCamera className={style.VideoCall} size={35}  />
            </div>
    </div>
  )
}

export default UserParams