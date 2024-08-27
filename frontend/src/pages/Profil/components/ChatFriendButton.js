import React, { useState, useEffect, useContext } from 'react';
import Icon from '../../../assets/Icon/icons';
import { useNavigate } from 'react-router-dom';
import { clientSocketContext } from '../../Chat/usehooks/ChatContext';


const ChatFriendButton = ({profilData: ChatPartnerData}) => {
  const navigate = useNavigate();
  const { stateValue: clientSocket } = useContext(clientSocketContext);

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
        <div className='ChatFriend-button profil-button' onClick={() => handleItemClick()}>
            <Icon name='ChatFriend' className='Chat-Friend profil-icon' />
            <p>Message</p>
        </div>
    );
};

export default ChatFriendButton;