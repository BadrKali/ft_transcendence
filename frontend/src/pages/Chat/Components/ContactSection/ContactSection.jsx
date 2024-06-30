import React from 'react'
import style from './ContactSection.module.css'
import SearchBar from '../SearchBar/SearchBar.jsx'
import {NotePencil} from 'phosphor-react'

const SendToNoneFriend = () =>{

  function handleGlobalMessage(){
    alert('You touched Icon to send Message to GlobalUsers')
  }

  return(
    <NotePencil onClick={handleGlobalMessage} 
    size={32} color="#ffffff" weight="light" />
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


    </div>
    )
}

export default ContactSection