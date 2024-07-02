import React from 'react'
import style from './ContactSection.module.css'
import SearchBar from '../SearchBar/SearchBar.jsx'
import {NotePencil} from 'phosphor-react'
import src from '../../ChatAssets/download.jpeg'
import NoOneTotalkTo from '../../ChatAssets/NoOneTotalkTo.json'
import Lottie from 'lottie-react'

// **************************
import {Avatar} from '@mui/material'
import {Faker} from '@faker-js/faker'
// **************************


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

const ChatList = [
{
  username : 'abdelali ait talb',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '9.32 PM',
  unread : 0,
},

{
  username : 'Alexander fo',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '9.32 PM',
  unread : 2,
},

{
  username : 'koStra_X',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '9.32 PM',
  unread : 2,
},

{
  username : 'Tolandriss 119',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '19.32 AM',
  unread : 2,
},
{
  username : 'FatnaX piW',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '10.32 AM',
  unread : 2,
},

{
  username : 'Boutalaght flanit',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '9.32 PM',
  unread : 2,
},

{
  username : 'Othman XT 119',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '9.32 PM',
  unread : 2,
},

{
  username : 'kolanssatil',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '9.32 PM',
  unread : 2,
},

{
  username : 'CHARDAN ABOLA',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '9.32 PM',
  unread : 2,
},

{
  username : 'CHARDAN ABOLA',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '9.32 PM',
  unread : 2,
},

{
  username : 'CHARDAN ABOLA',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '9.32 PM',
  unread : 49,
},

{
  username : 'CHARDAN ABOLA',
  lastMessage : 'Hello abdellai ait talb is ok',
  Time : '9.32 PM',
  unread : 100,
},


];

const ChatConversation =({ConversationData}) =>{

  return(
    <div className={style.ConversationHolder}>
      <img className={style.FriendPhoto} src={src} alt="Your-friend-photo" />
      
      <div className={style.NameAndLastMessage}>
        <p className={style.FriendName}> {ConversationData.username}</p>
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
  )
}

const ContactSection = () => {
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
        {ChatList.map((DataObj) => {
          return (<ChatConversation ConversationData={DataObj}/>)
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