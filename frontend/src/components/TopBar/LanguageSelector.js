import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './languageSelector.css'
import i18n from '../../i18n'

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem('i18nextLng') || 'en');

  const changeLanguage = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('i18nextLng', newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <div className="select-container">
      <select onChange={changeLanguage} value={language}>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>

      </select>
  </div>
  );
};

export default LanguageSelector;