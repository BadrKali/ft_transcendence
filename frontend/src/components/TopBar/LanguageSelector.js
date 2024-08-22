import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../assets/Icon/icons';
import './languageSelector.css'
import i18n from '../../i18n'

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isLanguageActive, setIsLanguageActive] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: localStorage.getItem('i18nextLng') || 'en',
    label: localStorage.getItem('i18nextLnge') || 'en',
  });


  const toggleDropdown = () => {
    setIsLanguageActive(prevState => !prevState);
  };


  const changeLanguage = (code, label) => {

      i18n.changeLanguage(code);
      localStorage.setItem('i18nextLng', code);
      localStorage.setItem('i18nextLnge', label);
      setSelectedLanguage({ code, label});
      setIsLanguageActive(false);
  };

  return (
    <div>
      <button onClick={toggleDropdown} className="languageButton">
        <Icon name='English' className='flagIcon'/> 
        {selectedLanguage.label}
      </button>
      <div className={isLanguageActive ? "dropDwonLanguage LanguageActive" : "dropDwonLanguage"}>
        <div className='dropList'>
          <p className='list' onClick={() => changeLanguage('en', 'EN')}>
            <Icon name='English' className='flagIcon'/> English 
          </p>
          <p className='list' onClick={() => changeLanguage('fr', 'FR')}>
            <Icon name='English' className='flagIcon'/>  Français
          </p>
          <p className='list' onClick={() => changeLanguage('ar', 'AR')}>
            <Icon name='English' className='flagIcon'/>  العربية
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;