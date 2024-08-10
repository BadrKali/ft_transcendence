import React from 'react';
import i18n from '../../i18n'

const LanguageSelector = () => {
  const changeLanguage = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('i18nextLng', newLanguage); // Save to localStorage
  };

  return (
    <select onChange={changeLanguage} defaultValue={localStorage.getItem('i18nextLng') || 'en'}>
      <option value="en">English</option>
      <option value="fr">Français</option>
      // Add more options for other languages
    </select>
  );
};

export default LanguageSelector;