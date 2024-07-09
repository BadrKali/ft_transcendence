import React, {useState, useEffect, createContext} from "react";
import style from './Chat.module.css'
import ContactSection from './Components/ContactSection/ContactSection.jsx'
import MessageSection from './Components/MessageSection/MessageSection.jsx'
import UserParams from "./Components/UserParams/UserParams";
import { ChatList } from "./FakeData/GlobalFakeData.jsx";

export const UserMsgContext = createContext();

const Chat = () => {

    const [selectedIndex, setSelectedIndex] = useState(-1);
  
    const handleConversationSelect = (conversationId) => {
      setSelectedIndex(conversationId);
    };

    function extractUserMessages(selectedIndex){
        return ChatList.filter((UserObj) => UserObj.id === selectedIndex);
    }
    const UserMessageData = extractUserMessages(selectedIndex)[0];

    return(
        <>
        <h1>Clunca</h1>
        <div className={style.ChatView}>
            <UserMsgContext.Provider value={UserMessageData}>
            <ContactSection selectedIndex={selectedIndex} handleConversationSelect={handleConversationSelect} />
                <MessageSection />
            </UserMsgContext.Provider>
            {
                UserMessageData ? 
                <UserParams /> : null
            }
            </div>
        </>
    )
}

export default Chat;