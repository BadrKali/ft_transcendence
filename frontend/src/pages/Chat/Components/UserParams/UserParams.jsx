import React from 'react'
import style from './UserParams.module.css'
import { DotsThreeVertical, Phone, VideoCamera } from 'phosphor-react'


const UserParams = () => {
    function handleVisiteProfil(){
        console.log('Go To the User Profile');
    }
  return (
    <div className={style.UserParams}>
            <div className={style.visiteProfilBack}>
            <svg onClick={handleVisiteProfil} className={style.visiteProfil} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 20C22.7614 20 25 17.7614 25 15C25 12.2386 22.7614 10 20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20Z" stroke="#8D93AC" strokeWidth="2"/>
            <path d="M19.9997 36.6666C29.2044 36.6666 36.6663 29.2047 36.6663 20C36.6663 10.7952 29.2044 3.3333 19.9997 3.3333C10.7949 3.3333 3.33301 10.7952 3.33301 20C3.33301 29.2047 10.7949 36.6666 19.9997 36.6666Z" stroke="#8D93AC" strokeWidth="2"/>
            <path d="M29.9485 33.3333C29.6833 28.5142 28.2078 25 19.9998 25C11.792 25 10.3165 28.5142 10.0513 33.3333" stroke="#8D93AC" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            </div>
            <div className={style.InviteToGameBack}>

            <svg  className={style.InviteToGame}  width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3125 15.8199L9.46351 12.523C6.92496 10.3393 6.91646 7.17032 6.64551 5.03377C9.42276 5.16557 11.574 5.41702 13.4474 6.99952L15.4072 9.22603L17.528 11.6072M32.4303 30.6982L27.4892 25.6983M23.3708 30.6982C23.4085 30.2443 23.7055 29.068 25.0697 27.8077C26.2935 26.677 28.9477 23.9668 30.1403 22.7918C30.8158 22.1262 31.9235 21.659 32.4303 21.66M25.9488 21.348L28.1765 23.8128M22.7953 24.0618L25.2858 26.251M34.1042 29.9683C35.4882 29.971 36.6702 30.9932 36.6675 32.3763C36.6648 33.7595 35.4882 34.9722 34.1042 34.9695C32.7202 34.9668 31.653 33.7498 31.6555 32.3668C31.745 30.9905 32.763 30.1535 34.1042 29.9683Z" stroke="#8D93AC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.6607 30.6553L12.5907 25.8348M7.60344 21.6455C8.05752 21.6823 9.32342 21.9855 10.4575 23.4022C11.4987 24.7028 14.307 27.218 15.4852 28.4077C16.1525 29.0815 16.6192 30.1488 16.6192 30.6553M12.1083 23.7168L25.84 7.77393C28.0745 5.2804 31.1972 5.22593 33.3402 4.99715C33.1538 7.76943 32.86 9.91391 31.24 11.7546L14.2501 26.5443M8.34445 32.4983C8.34445 33.8815 7.2225 35.0027 5.83849 35.0027C4.45449 35.0027 3.33252 33.8815 3.33252 32.4983C3.33252 31.1153 4.45449 29.994 5.83849 29.994C7.2225 29.994 8.34445 31.1153 8.34445 32.4983Z" stroke="#8D93AC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg> 
            </div>

            <div className={style.BlockBack}>
            <svg className={style.Block} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.0003 26.6667L33.3337 35M33.3337 26.6667L25.0003 35M18.3337 23.3333C11.8903 23.3333 6.66699 28.5567 6.66699 35H18.3337M25.0003 11.6667C25.0003 15.3486 22.0155 18.3333 18.3337 18.3333C14.6518 18.3333 11.667 15.3486 11.667 11.6667C11.667 7.98477 14.6518 5 18.3337 5C22.0155 5 25.0003 7.98477 25.0003 11.6667Z" stroke="#8D93AC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            </div>
            <div className={style.PhoneBack}>
              <Phone className={style.Phone} size={35} />
            </div>
            <div className={style.VideoCallBack}>
              <VideoCamera className={style.VideoCall} size={35}  />
            </div>
    </div>
  )
}

export default UserParams