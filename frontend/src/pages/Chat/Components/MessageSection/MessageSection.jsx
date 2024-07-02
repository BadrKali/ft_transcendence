import React from 'react'
import style from './MessageSection.module.css'
import EmptyChatAnimation from '../../ChatAssets/EmptyChatAnimation.json'
import Lottie from 'lottie-react'


const MessageSection = () => {
  return (
    <div className={style.MessageSection}>

    <div className={style.WelcomeChat}>
     <div className={style.Animationstyle}> <Lottie animationData={EmptyChatAnimation} />
     </div>
     <blockquote className={style.ChatQuote}> Unleash the power of connection! <br/>Start chatting and discover what <span className={style.Clunca}>Clunca </span> has to offer you .  </blockquote>
      </div>

</div>
  )
}

export default MessageSection