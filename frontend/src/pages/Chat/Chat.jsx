import React, {useState, useEffect} from "react";
import style from './Chat.module.css'
import ContactSection from './Components/ContactSection/ContactSection.jsx'
import MessageSection from './Components/MessageSection/MessageSection.jsx'
import UserParams from "./Components/UserParams/UserParams";


const Chat = () => {

    return(
        <>
        <h1>Clunca</h1>
        <div className={style.ChatView}>
            <ContactSection />
            <MessageSection />
            {/* <UserParams /> */}
        </div>
        </>
    )
}

export default Chat;