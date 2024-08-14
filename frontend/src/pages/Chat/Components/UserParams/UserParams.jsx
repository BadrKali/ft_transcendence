import React, { useContext } from 'react'
import style from './UserParams.module.css'
import {Phone, VideoCamera } from 'phosphor-react'
import Icon from '../../../../assets/Icon/icons.js'
import { useNavigate } from 'react-router-dom';
import { chatPartnerContext } from '../../Chat.jsx'; 

const UserParams = () => {

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

    function handleBlocking(){
      alert('Hi ! HandleBlocking Clicked');
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