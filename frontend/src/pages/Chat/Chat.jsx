import React, { useState, useEffect, createContext } from "react";
import style from "./Chat.module.css";
import ContactSection from "./Components/ContactSection/ContactSection.jsx";
import MessageSection from "./Components/MessageSection/MessageSection.jsx";
import UserParams from "./Components/UserParams/UserParams";
import useAuth from "../../hooks/useAuth";

export const conversationMsgContext = createContext();
export const ChatListContext = createContext();
export const PickedConvContext = createContext();

const Chat = () => {
  const [ChatList, setChatList] = useState(null);
  const [conversationMsgs, setconversationMsgs] = useState(null);
  const [PickerUsername, setPickerUsername] = useState("");
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
  }, [PickerUsername]); //dependencies will change

  const handleConversationSelect = (conversationId) => {
    setPickerUsername(conversationId);
  };

  useEffect(() => {
    const FetchMessagesSection = async () => {
      try {
        const url = `http://localhost:8000/chat/GetMessageswith/${PickerUsername}/`;
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
        setconversationMsgs(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    if (PickerUsername.length) FetchMessagesSection();
  }, [PickerUsername]);

  return (
    <>
      <h1>Clunca</h1>
      <div className={style.ChatView}>
        <conversationMsgContext.Provider value={conversationMsgs}>
          <ChatListContext.Provider value={ChatList}>
            <PickedConvContext.Provider value={PickerUsername}>
              <ContactSection
                PickerUsername={PickerUsername}
                handleConversationSelect={handleConversationSelect}
              />
              <MessageSection />
            </PickedConvContext.Provider>
          </ChatListContext.Provider>
        </conversationMsgContext.Provider>

        {conversationMsgs ? <UserParams /> : null}
      </div>
    </>
  );
};
// LIKE IF I ADDED SOMETHING TO THIS SHIIIT TO JUST IGNORE IT !
export default Chat;
