import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const { currentLanguage, switchLanguage, getAvailableLanguages, getLanguageName } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = getAvailableLanguages();

  const handleLanguageChange = async (language) => {
    const success = await switchLanguage(language.code);
    if (success) {
      setIsDropdownOpen(false);
    } else {
      console.error(t('languageSwitcher.switchFailed'));
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="language-switcher">
      <div 
        className="language-dropdown"
        onClick={toggleDropdown}
      >
        <img src="/global-icon.svg" alt="Global" className="global-icon" />
        <span className="language-text">{getLanguageName(currentLanguage)}</span>
        <img 
          src="/arrow-down.svg" 
          alt="Dropdown" 
          className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} 
        />
      </div>
      
      {isDropdownOpen && (
        <div className="language-dropdown-menu">
          {languages.map((language) => (
            <div
              key={language.code}
              className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language)}
            >
              {language.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;