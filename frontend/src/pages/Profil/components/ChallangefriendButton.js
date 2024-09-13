import React, { useState, useEffect, useContext } from 'react';
import Icon from '../../../assets/Icon/icons';
import { ProfileContext } from '../../../context/ProfilContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ChallangefriendButton = () => {
    const {auth} = useAuth()
    const navigate = useNavigate()
    const {isBlockedMe, isBlockingHim, profilData} = useContext(ProfileContext);
    const { t } = useTranslation();
    console.log({profilData})
    const isDisabled = isBlockingHim || isBlockedMe;

    const handleChallenge = async () => {
        const notification = {
          player_receiver_id: profilData.user_id,
        };
        try {
          const response = await axios.post(`${BACKEND_URL}/api/game/send-challenge/`, notification, {
                headers : {
                  'Content-Type' : 'application/json',
                  'Authorization': `Bearer ${auth.accessToken}`,
              }
          });
          console.log("Game Settings saved", response.data);
        } catch (error) {
          console.log("Failed to save game settings");
        }
        navigate('/invite-game', { replace : true });
      };
    
    return (
        <div onClick={handleChallenge}  className={`Challangefriend-button profil-button ${isDisabled ? 'disabled' : ''}`}>
            <Icon name='Challangefriend' className='Challange-friend profil-icon' />
            <p>{t('Challenge')}</p>        
        </div>
    );
};

export default ChallangefriendButton;