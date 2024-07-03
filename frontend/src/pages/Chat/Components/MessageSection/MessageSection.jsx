import React, { useState } from 'react'
import styles from './MessageSection.module.css'
import EmptyChatAnimation from '../../ChatAssets/EmptyChatAnimation.json'
import online from '../../ChatAssets/online.json'
import offline from '../../ChatAssets/offline.json'
import { ChatList } from '../../FakeData/GlobalFakeData'
import { Smiley } from 'phosphor-react'
import Lottie from 'lottie-react'
import src from '../../ChatAssets/download.jpeg'

const ImportItem = ()=>{
  return(
    <svg  className={styles.ImportButton} width="30" height="30" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.1996 0C5.02861 0 0 5.1635 0 11.5C0 17.8365 5.02861 23 11.1996 23C17.3706 23 22.3992 17.8365 22.3992 11.5C22.3992 5.1635 17.3706 0 11.1996 0ZM15.6794 12.3625H12.0395V16.1C12.0395 16.5715 11.6588 16.9625 11.1996 16.9625C10.7404 16.9625 10.3596 16.5715 10.3596 16.1V12.3625H6.71975C6.26057 12.3625 5.87978 11.9715 5.87978 11.5C5.87978 11.0285 6.26057 10.6375 6.71975 10.6375H10.3596V6.9C10.3596 6.4285 10.7404 6.0375 11.1996 6.0375C11.6588 6.0375 12.0395 6.4285 12.0395 6.9V10.6375H15.6794C16.1386 10.6375 16.5194 11.0285 16.5194 11.5C16.5194 11.9715 16.1386 12.3625 15.6794 12.3625Z" fill="white" fillOpacity="0.5"/>
    </svg>
  )
}

const SendMessage = () => {
  return(
    <svg width="30" height="30" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.286 0.243835C22.1378 0.115822 21.9576 0.0342628 21.7664 0.00866295C21.5753 -0.0169369 21.3811 0.0144765 21.2065 0.0992425L0.250977 10.3275V12.3067L9.05272 15.9678L14.6984 25H16.6021L22.617 1.32233C22.6658 1.12842 22.6606 0.924095 22.602 0.733153C22.5434 0.542212 22.4338 0.372516 22.286 0.243835ZM15.4268 23.1123L10.574 15.3485L18.0416 6.84337L16.86 5.72157L9.33401 14.293L2.07695 11.2744L20.7489 2.16046L15.4268 23.1123Z" fill="white" fillOpacity="0.5"/>
    </svg>
  )
}

const Emojies = () => {
  return(
    <Smiley className ={styles.Emojie} size={40} color="#242424" weight="fill" />
  )
}

const InputField = () => {
  const [message, setMessage] = useState('');

  function handleWritedMessage(e){
    setMessage(e.target.value);


  }

  return(
    <input className={styles.inputMessage} onChange={(e) => handleWritedMessage(e)}
        type="text" value={message} placeholder='write a message ... '/>
  )
}

const ChatHeader = () => {

  const status = true;

  const [MessageBackColor, setColor] = useState('');
  function handleColor1(){
    setColor('#22420d')
  }

  function handleColor2(){
    setColor('#F62943');
  }

  function handleColor3(){
    setColor('#333497');
  }

  return (
    <div className={styles.ChatHeaderHolder}>
      <div className={styles.UserInfo}>
      
      <img className={styles.FriendPhoto} src={src} alt="Your-friend-photo" />
      
        <div className={styles.FriendNameAndStatus}>
            
            <div className={styles.FriendName}>Youlhafi_BT</div>
            
            <div className={styles.StatusHolder}>
            <div className={styles.StatusIcon}> <Lottie animationData={status ? online : offline} /> </div >
            <div className={styles.Status}> {status ? 'Online' : 'Offline'}</div>
            </div>
        </div>
      
      </div>

      <div className={styles.DiscussionColors}>
      <div onClick={handleColor1} className={styles.Color1}></div>
      <div onClick={handleColor2} className={styles.Color2}></div>
      <div onClick={handleColor3} className={styles.Color3}></div>
      {/* TO BE REMOVED */}
      <div className={styles.Color4} style={{backgroundColor: MessageBackColor}}> </div>
      </div>

    </div>
  )
}

const ChatInput = () =>{
  return(
    <div className={styles.ChatInputHolder}>
      <div className={styles.inputMainDiv}>
      < ImportItem    />
      < InputField   />
      < Emojies     />
      < SendMessage/>
      </div>
    </div>
  )
}
const MessageSection = () => {
  return (
    <>
    {
      !ChatList.length ? 
    <div className={styles.MessageSection}>

    <div className={styles.WelcomeChat}>
     <div className={styles.Animationstyles}> <Lottie animationData={EmptyChatAnimation} />
     </div>
     <blockquote className={styles.ChatQuote}> Unleash the power of connection! <br/>Start chatting and discover what <span className={styles.Clunca}>Clunca </span> has to offer you .  </blockquote>
      </div>
    </div> : <div className={styles.MessageSectionFull}>
      <ChatHeader />
      <div className={styles.ChatMainHolder}></div>
      <ChatInput/>      
      </div>
}
    </>
  )
}

export default MessageSection