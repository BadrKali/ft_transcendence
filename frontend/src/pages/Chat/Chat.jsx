import React, { useState, useEffect, createContext, useContext } from "react";
import style from "./Chat.module.css";
import ContactSection from "./Components/ContactSection/ContactSection.jsx";
import MessageSection from "./Components/MessageSection/MessageSection.jsx";
import UserParams from "./Components/UserParams/UserParams";
import useAuth from "../../hooks/useAuth";
import { CurrentUserContext } from "./usehooks/ChatContext.js";
import { clientSocketContext } from "./usehooks/ChatContext.js";
import { blockPopUpContext } from "./usehooks/ChatContext.js";
import receivedmsgsound from "./ChatAssets/receivemsgnotif.mp3"



export const conversationMsgContext = createContext();
export const ChatListContext = createContext();
export const PickedConvContext = createContext();
export const conversationSetterContext = createContext();
export const SendMessageEventContext = createContext();
export const chatPartnerContext = createContext();
// status : false | true ,sender_id : null | value
export const TypingContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function reformeDate(datestr) {
  const datetimeObj = new Date(datestr);
  const hours = datetimeObj.getHours();
  const minutes = String(datetimeObj.getMinutes()).padStart(2, "0"); // Convert to string first
  return `${hours}:${minutes}`;
}


const Chat = () => {
  const [ChatList, setChatList] = useState(null);
  const [conversationMsgs, setconversationMsgs] = useState(null);
  const [PickedUsername, setPickerUsername] = useState("");
  const { auth } = useAuth();
  const { stateValue: clientSocket } = useContext(clientSocketContext);
  const CurrentUser = useContext(CurrentUserContext);
  const [sendMessage, setSendMessage] = useState(0);
  const [ChatPartner, setChatPartner] = useState(null);
  const [requestRefetch, setrequestRefetch] = useState(false);
  const{blockpopUp, setblockpopUp} = useContext(blockPopUpContext)
  const [typingData, setTypingData] = useState({status: false, sender_id: null})

  const  updateUnreadMsgs = (message) =>{
    if (message.receiver_id === CurrentUser?.user_id && message.receiver_id !== message.sender_id){
      setChatList(prevChatList => {
        return prevChatList.map((contact) => {
          if (contact.id === message.sender_id) {
            return {        
                ...contact,
                unreadMessages: contact.unreadMessages + 1
            };
          } else {
            return contact;
          }
        });
      });
    }
}

const alreadyHaveConversation = (id) =>{
    if (ChatList === null)
      return false;
    return ChatList.some((contact) => contact?.id === id)
}

const sortConversations = () =>{
  setChatList(prevChatList => {
    const sortedChatList = [...prevChatList].sort((a, b) => {
      return a.created_at.localeCompare(b.created_at);
    });
    return sortedChatList;
  });
}

const updateLastMessage = (data, result) =>{
  setChatList(prevChatList => {
    return prevChatList.map((contact) => {
      if (contact.id === result[0]?.id) {
        return {        
            ...contact,
            lastTime : reformeDate(data.message.created_at),
            lastMessage : data.message.content
        };
      } else {
        return contact;
      }
    });
  });
  sortConversations();
}
  if (clientSocket) {
    clientSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('data.type is : ' + data.type)
    const notif = new Audio(receivedmsgsound);

    if (data.type === 'receive_typing'){
      setTypingData({status: true,
        sender_id : data.message.sender_id
      })
    }

    if (data.type === 'deactivate_typing_event'){
      setTypingData({status: false,
        sender_id : data.message.sender_id
      })
    }

    if (data.type === 'newchat.message'){
      // You are receiver you got notif sound! not your self too talk with your self .
      if (data.message.receiver_id === CurrentUser?.user_id && data.message.sender_id !== CurrentUser?.user_id){ 
          notif.play().then(() => {}).catch((error) => {
            // Ignore the error 
          });
            if (alreadyHaveConversation(data.message.sender_id) === false){
              setrequestRefetch(true)
            }
        }
      if (ChatPartner){
        if ((data.message.sender_id === CurrentUser?.user_id && data.message.receiver_id === ChatPartner?.id) ||
          (data.message.sender_id === ChatPartner?.id && data.message.receiver_id === CurrentUser?.user_id)){
            if (data.message.receiver_id === CurrentUser.user_id){
                data.message.seen = true;
                // clientSocket.send Stored on Db as unread but being on a conv is should be setted as read !
                clientSocket.send(JSON.stringify({type : 'Update_msgStatus', messageData : {
                  content : data.message.content,
                  created_at : data.message.created_at
                }}))
              }
          setconversationMsgs(prevConversationMsgs => [...prevConversationMsgs, data.message]);
        }
        else{
          // console.log('There is ChatPartner but not required one !') // update unread ! there is a Chatpartner but not required one !
          updateUnreadMsgs(data.message)
        }
        }
        else {
          // console.log('Will Go and Update the unread messages with :=> ' + data.message.sender_id) // no Partner no conversation Selected
          updateUnreadMsgs(data.message)
      }
    }
      
    if (data.type === "last.message"){
      let result = ChatList.filter((contact) =>{
        return (contact.id === data.message.sender_id) || (contact.id === data.message.receiver_id)
      })
    if (result.length > 1){
        result= result.filter((Conversation) => Conversation.id !== CurrentUser.user_id)
    }
    updateLastMessage(data, result)
    }

    if (data.type === "msgs.areReaded"){
        console.log(` You readed all msg With `, data.message.all_readed_From)

        setChatList(prevChatList => {
          return prevChatList.map((contact) => {
            if (contact.username === data.message.all_readed_From) {
              return {        
                  ...contact,
                  unreadMessages : 0
              };
            } else {
              return contact;
            }
          });
        });
      }

    if (data.type === "Pick_existed_conv"){
        // Here is the issue the Pickedusername change 
        // but the chatlist is not yet setted because contact Section is not rendred !
          setPickerUsername(data.message.username)
      }
    
    if (data.type === 'Blocke_Warning'){
      setblockpopUp(true)
      setTimeout(()=>{
        setblockpopUp(false)
      }, 2000)
    }

    if (data.type === 'start_Firstconv'){
      setChatList(prevChatList => {
        if (prevChatList === null) {
          return [data.message];
        } else {
          return [data.message, ...prevChatList];
        }
      });
      setPickerUsername(data.message.username)
    }
  };
}

  useEffect(() => {
    const abortController = new AbortController();
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
        console.log('I refetcheeeed did you get last update or not ??')
      } catch (error) {
        console.error(error.message);
      }
    };

    FetchContactSection();
    return () => {
      abortController.abort(); 
    };
  }, [requestRefetch, auth.accessToken]); //PickedUsername -dependencies will change
  // I fogot why I added PickedUsername ???

  const handleConversationSelect = (conversationId) => {
    setPickerUsername(conversationId);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const FetchMessagesSection = async () => {
      try {
        const url = `${BACKEND_URL}/chat/GetMessageswith/${PickedUsername}/`;
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
    if (PickedUsername.length) {
      FetchMessagesSection();
      const PickedConversation = ChatList?.filter(contact => contact.username === PickedUsername)
      // if I protect for PickedConversation this will make error's msgs will not mark_as_Read !
      if (PickedConversation[0]?.unreadMessages){
          clientSocket.send(JSON.stringify({ type: "_mark_msgs_asRead_",
                                               messageData: {With: PickedUsername }}));
        } 
    }
    
    return () => {
      abortController.abort(); // Cancel pending fetch request on component unmount
    };
  }, [PickedUsername, auth.accessToken]);

  return (
    <>
      <h1>Clunca</h1>
      <div className={style.ChatView}>
        <conversationSetterContext.Provider value={setconversationMsgs}>
          <conversationMsgContext.Provider value={conversationMsgs}>
            <ChatListContext.Provider value={{ ChatList, setChatList }}>
              <PickedConvContext.Provider value={PickedUsername}>
              <chatPartnerContext.Provider value={{ChatPartner, setChatPartner}}>
                <TypingContext.Provider value={{status : typingData.status, setTypingData}}>
                  <ContactSection handleConversationSelect={handleConversationSelect} />
                  <SendMessageEventContext.Provider value ={{sendMessage, setSendMessage}}>
                    <MessageSection />
                      </SendMessageEventContext.Provider>
                    {PickedUsername ? <UserParams /> : null}
                    </TypingContext.Provider>
                </chatPartnerContext.Provider>
              </PickedConvContext.Provider>
            </ChatListContext.Provider>
          </conversationMsgContext.Provider>
        </conversationSetterContext.Provider>
      </div>
    </>
  );
};

export default Chat;
