import React, { useState, useEffect, useContext } from 'react';
import Icon from '../../../assets/Icon/icons';
import { ProfileContext } from '../../../context/ProfilContext';


const ChallangefriendButton = () => {
    const {isBlockedMe, isBlockingHim} = useContext(ProfileContext);
    const isDisabled = isBlockingHim || isBlockedMe;
    return (
        <div className={`Challangefriend-button profil-button ${isDisabled ? 'disabled' : ''}`}>
            <Icon name='Challangefriend' className='Challange-friend profil-icon' />
            <p>Challange</p>        
        </div>
    );
};

export default ChallangefriendButton;