import React, { useState, useEffect, useContext } from 'react';
import Icon from '../../../assets/Icon/icons';
import { useNavigate } from 'react-router-dom';
import { clientSocketContext } from '../../Chat/usehooks/ChatContext';


const ChatFriendButton = ({profilData: ChatPartnerData, isBlockedMe, isBlockingHim}) => {
  const navigate = useNavigate();
  const { stateValue: clientSocket } = useContext(clientSocketContext);
  const isDisabled = isBlockingHim || isBlockedMe;


    const handleItemClick = () => {
        navigate(`/chat`, {state :{
            navigatedBy: 'click_on_ChatFriend_button' 
        } });
        // The Pickedusername is setted befor the Contact Section component mount so that Make a
        // problem ! because ChatList will be null .
        // here is why I maked a small Delay !
        setTimeout(()=>{
            clientSocket?.send(JSON.stringify({type: '_start_chat_', 
                messageData : ChatPartnerData
            }))
        }, 1111)

    };

    return (
        <div className={`Challangefriend-button profil-button ${isDisabled ? 'disabled' : ''}`} onClick={() => handleItemClick()}>
            <Icon name='ChatFriend' className='Chat-Friend profil-icon' />
            <p>Message</p>
        </div>
    );
};

export default ChatFriendButton;