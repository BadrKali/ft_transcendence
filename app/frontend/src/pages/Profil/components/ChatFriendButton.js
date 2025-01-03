import React, { useState, useEffect, useContext } from 'react';
import Icon from '../../../assets/Icon/icons';
import { useNavigate } from 'react-router-dom';
import { clientSocketContext } from '../../Chat/usehooks/ChatContext';
import { ProfileContext } from '../../../context/ProfilContext';
import { useTranslation } from 'react-i18next';



const ChatFriendButton = ({profilData: ChatPartnerData}) => {
  const navigate = useNavigate();
  const { stateValue: clientSocket } = useContext(clientSocketContext);
  const {isBlockedMe, isBlockingHim} = useContext(ProfileContext)
  const { t } = useTranslation();
  const isDisabled = isBlockingHim || isBlockedMe;


    const handleItemClick = () => {
        navigate(`/chat`, {state :{
            navigatedBy: 'click_on_ChatFriend_button',
            Targetuser : ChatPartnerData
        } });
    };

    return (
        <div className={`Challangefriend-button profil-button ${isDisabled ? 'disabled' : ''}`} onClick={() => handleItemClick()}>
            <Icon name='ChatFriend' className='Chat-Friend profil-icon' />
            <p>{t('Message')}</p>
        </div>
    );
};

export default ChatFriendButton;