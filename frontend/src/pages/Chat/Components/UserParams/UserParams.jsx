import React from 'react'
import style from './UserParams.module.css'
import { AlignRight, DotsThreeVertical, Phone, VideoCamera } from 'phosphor-react'
import Icon from '../../../../assets/Icon/icons.js'


const UserParams = () => {
    function handleVisiteProfil(){
        alert('Go To the User Profile');
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