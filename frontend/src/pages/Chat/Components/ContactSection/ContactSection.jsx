import React, { useState } from 'react'
import style from './ContactSection.module.css'
import SearchBar from '../SearchBar/SearchBar.jsx'
import {NotePencil} from 'phosphor-react'
import src from '../../ChatAssets/download.jpeg'
import NoOneTotalkTo from '../../ChatAssets/NoOneTotalkTo.json'
import Lottie from 'lottie-react'
import {ChatList} from '../../FakeData/GlobalFakeData.jsx'


/************************ */
import { Avatar } from '@mui/material';
import {faker} from '@faker-js/faker'
/************************* */
const SendToNoneFriend = () =>{

  function handleGlobalMessage(){
    alert('You touched Icon to send Message to GlobalUsers')
  }

  return(
    <NotePencil onClick={handleGlobalMessage} 
    size={32} color="#ffffff" weight="light" />
  )
}
// Don't Forget to check For username lenght it will be ugly if you have 
// a big name the front will be ugly


function LastMessageFormater(lastMessage){
  if (lastMessage.length > 30 ){
    return (`${lastMessage.slice(0, 25)} ...`);
  }
  return lastMessage;
}


const ChatConversation = ({ ConversationData, selectedIndex, onSelectConversation }) => {
  function HandleClick() {
    onSelectConversation(ConversationData.id); // Pass ID to parent callback
  }

  return (
    <div onClick={HandleClick}
    style={{    borderRadius: '0.5rem', 
     backgroundColor: selectedIndex === ConversationData.id ? '#11141B' : '' }}>
        <div className={style.ConversationHolder}>

       <img className={style.FriendPhoto} src={src} alt="Your-friend-photo" />
     
      <div className={style.NameAndLastMessage}>
        <p className={style.FriendName}> {faker.person.fullName()}</p>
        <p className={style.LastMessage}> {LastMessageFormater(ConversationData.lastMessage)}</p>
      </div>

    
      <div className={style.UnreadAndTime}>
        <p className={style.SendTime}> {ConversationData.Time}</p>
        {
          ConversationData.unread ?
          <div className={style.unreadedMsgHolder}>
           <p className={style.UnreadMessages}> {ConversationData.unread >= 9 ? '+9': ConversationData.unread}</p>
          </div>
        : null
        } 
      </div>

        </div>
    </div>
  )
}

const ContactSection = () => {

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const handleConversationSelect = (conversationId) => {
    setSelectedIndex(conversationId);
  };

  return (
    <div className={style.ContactSection}> 
    
    <SearchBar />

    <div className={style.MessageNotePencilHolder}>
      <p className={style.MessageString}> Messages</p>
      <SendToNoneFriend />
    </div>


{
  ChatList.length ? 
    <div className={style.ConversationContainer}>
        {ChatList.map((DataObj, index) => {
          return (<ChatConversation
            key={index}
            ConversationData={DataObj}
            selectedIndex={selectedIndex}
            onSelectConversation={handleConversationSelect} //
            />)
        })
      }
    </div> : <div className={style.ConversationContainerAnimation}>
        <div className={style.NoOneToTalkTost}> <Lottie animationData={NoOneTotalkTo} /> </div>
    </div>
}
    </div>
    )
}

export default ContactSection;