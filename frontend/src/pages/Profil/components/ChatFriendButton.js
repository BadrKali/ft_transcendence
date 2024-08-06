import React, { useState, useEffect } from 'react';
import Icon from '../../../assets/Icon/icons';
import { useNavigate } from 'react-router-dom';


const ChatFriendButton = () => {
  const navigate = useNavigate();

    const handleItemClick = () => {
        navigate(`/chat`);
    };

    return (
        <div className='ChatFriend-button profil-button' onClick={() => handleItemClick()}>
            <Icon name='ChatFriend' className='Chat-Friend profil-icon' />
            <p>Message</p>
        </div>
    );
};

export default ChatFriendButton;