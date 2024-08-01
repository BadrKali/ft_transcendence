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
  const [PickedUserData, setPickedUserData] = useState();
  const [PickedConversation, setPickedConversation] = useState("");

  const { auth } = useAuth();

  useEffect(() => {
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
        setChatList(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    FetchContactSection();
  }, [PickedConversation]);

  const handleConversationSelect = (conversationId) => {
    setPickedConversation(conversationId);
  };

  // useEffect(()=>{

  //   const FetchMessagesSection = async () => {
  //     try {

  //       console.log(PickedConversation);

  //       const url = `http://localhost:8000/chat/GetMessageswith/${PickedConversation}/`;
  //       const response = await fetch(url, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${auth.accessToken}`,
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error(`Response status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log(data)
  //       setPickedUserData(data)
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };

  //   FetchMessagesSection();
  // }, [PickedConversation])

  return (
    <>
      <h1>Clunca</h1>
      <div className={style.ChatView}>
        <UserMsgContext.Provider value={PickedUserData}>
          <ChatListContext.Provider value={ChatList}>
            <ContactSection
              PickedConversation={PickedConversation}
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
