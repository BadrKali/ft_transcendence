import React, { useState } from 'react';
import sKey from '../../Game-assets/s.png';
import upKey from '../../Game-assets/up.png';
import downKey from '../../Game-assets/down.png';
import wKey from '../../Game-assets/w.png';

const Keys = ({ className }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className={className}>
            <h1>Keys</h1>
            <div className={`ws-container container ${selectedOption === 'ws' ? 'selectedOption' : ''}`} onClick={() => handleSelectOption('ws')}>
                <img src={wKey} alt="" className='key' />
                <img src={sKey} alt="" className='key' />
            </div>
            <div className={`up-down-container container ${selectedOption === 'up-down' ? 'selectedOption' : ''}`} onClick={() => handleSelectOption('up-down')}>
                <img src={upKey} alt="" className='key' />
                <img src={downKey} alt="" className='key' />
            </div>
        </div>
    );
}

export default Keys;
