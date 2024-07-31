import React, { useState, useEffect, createContext } from "react";
import style from "./Chat.module.css";
import ContactSection from "./Components/ContactSection/ContactSection.jsx";
import MessageSection from "./Components/MessageSection/MessageSection.jsx";
import UserParams from "./Components/UserParams/UserParams";
import useAuth from "../../hooks/useAuth";

export const UserMsgContext = createContext();
export const ChatListContext = createContext();

const Chat = () => {
    const [ChatList, setChatList] = useState([]);
    const [PickedUserData, setPickedUserData] = useState()
    const [selectedIndex, setSelectedIndex] = useState("");

  const { auth } = useAuth();
  
  useEffect(() => {
    console.log('I\'LL GO FETCH MOTHER FUCKER !')
      const FetchContactSection = async () => {
      try {
        const url = "http://127.0.0.1:8000/chat/GetContactSection/";
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        setChatList(data)
      } catch (error) {
        console.error(error.message);
      }
    };
    
    FetchContactSection();
  
}, [selectedIndex]);
  const handleConversationSelect = (conversationId) => {
    setSelectedIndex(conversationId);
  };
  useEffect(()=>{
    console.log('infinite rerendering bro');
  })
//   console.log(selectedIndex);
//   function extractUserMessages(selectedIndex) {
//     // console.log(`Go fetch Data With ${selectedIndex}`);
//     // get the suitable records From getMessagesEndpoint
//     // return ChatList.filter((UserObj) => UserObj.username === selectedIndex); // got it from backend
//   }
//   useEffect(() => {
//     // console.log( 'Go fetch Your Mesages With ' + selectedIndex)
//   }, [selectedIndex])

  return (
    <>
      <h1>Clunca</h1>
      <div className={style.ChatView}>
        <UserMsgContext.Provider value={PickedUserData}>
          <ChatListContext.Provider value={ChatList}>
            <ContactSection
              selectedIndex={selectedIndex}
              handleConversationSelect={handleConversationSelect}
            />
            <MessageSection />
          </ChatListContext.Provider>
        </UserMsgContext.Provider>

        {PickedUserData ? <UserParams /> : null}
      </div>
    </>
  );
};

export default Chat;
