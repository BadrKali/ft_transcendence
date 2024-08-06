import React, { useState, useEffect } from 'react';
import Icon from '../../../assets/Icon/icons';

const ChallangefriendButton = () => {
    
    return (
        <div className='Challangefriend-button profil-button'>
            <Icon name='Challangefriend' className='Challange-friend profil-icon' />
            <p>Challange</p>        
        </div>
    );
};

export default ChallangefriendButton;