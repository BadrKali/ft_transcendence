import React, { useState, useEffect, useContext } from 'react';
import Icon from '../../../assets/Icon/icons';
import { ProfileContext } from '../../../context/ProfilContext';
import { useTranslation } from 'react-i18next';

const ChallangefriendButton = () => {
    const {isBlockedMe, isBlockingHim} = useContext(ProfileContext);
    const { t } = useTranslation();

    const isDisabled = isBlockingHim || isBlockedMe;

    return (
        <div className={`Challangefriend-button profil-button ${isDisabled ? 'disabled' : ''}`}>
            <Icon name='Challangefriend' className='Challange-friend profil-icon' />
            <p>{t('Challenge')}</p>        
        </div>
    );
};

export default ChallangefriendButton;