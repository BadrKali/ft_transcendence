import React, { useState, useEffect } from 'react';
import Icon from '../../../assets/Icon/icons';

const ChallangefriendButton = ({isBlockingHim, isBlockedMe}) => {
    const isDisabled = isBlockingHim || isBlockedMe;
    return (
        <div className={`Challangefriend-button profil-button ${isDisabled ? 'disabled' : ''}`}>
            <Icon name='Challangefriend' className='Challange-friend profil-icon' />
            <p>Challange</p>        
        </div>
    );
};

export default ChallangefriendButton;