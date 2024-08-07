import React, { useState, useEffect, createContext } from "react";
import style from "./Chat.module.css";
import ContactSection from "./Components/ContactSection/ContactSection.jsx";
import MessageSection from "./Components/MessageSection/MessageSection.jsx";
import UserParams from "./Components/UserParams/UserParams";
import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch.js"
import {CurrentUserProvider} from "./usehooks/useContexts.js"

export const conversationMsgContext = createContext();
export const ChatListContext = createContext();
export const PickedConvContext = createContext();
export const conversationSetterContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WS_BACKEND_URL = process.env.REACT_APP_WS_BACKEND_URL;


const Chat = () => {

  const [ChatList, setChatList] = useState(null);
  const [conversationMsgs, setconversationMsgs] = useState(null);
  const [PickerUsername, setPickerUsername] = useState("");
  const { auth } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket(`${WS_BACKEND_URL}/ws/chat/?token=${auth.accessToken}`);

    newSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    newSocket.onmessage = (event) => {
      // Handle incoming messages

      console.log(event.data);
    };

    newSocket.onclose = () => {
      console.log('WebSocket closed');
    };

    newSocket.onerror = ()=>{
      console.log('|- ERROR -|');
    }

    return () => {
      newSocket.close();
    };
  }, []);


  useEffect(() => {
    const FetchContactSection = async () => {
      try {
        const url = `${BACKEND_URL}/chat/GetContactSection/`;
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
        const url = `${BACKEND_URL}/chat/GetMessageswith/${PickerUsername}/`;
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
      <CurrentUserProvider>
        <conversationSetterContext.Provider value={setconversationMsgs}>
          <conversationMsgContext.Provider value={conversationMsgs}>
            <ChatListContext.Provider value={ChatList}>
              <PickedConvContext.Provider value={PickerUsername}>
                <ContactSection PickerUsername={PickerUsername}
                  handleConversationSelect={handleConversationSelect} />
                <MessageSection />
                {conversationMsgs ? <UserParams /> : null}
              </PickedConvContext.Provider>
            </ChatListContext.Provider>
          </conversationMsgContext.Provider>
        </conversationSetterContext.Provider>
        </CurrentUserProvider>
      </div>
    </>
  );
};
// LIKE IF I ADDED SOMETHING TO THIS SHIIIT TO JUST IGNORE IT !
export default Chat;
