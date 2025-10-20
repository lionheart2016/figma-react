import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ className = '' }) => {
  const { t, i18n } = useTranslation();
  const { currentLanguage, switchLanguage, getAvailableLanguages, getLanguageName } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = getAvailableLanguages();

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = async (languageCode) => {
    const success = await switchLanguage(languageCode);
    if (success) {
      setIsDropdownOpen(false);
    } else {
      console.error(t('languageSwitcher.switchFailed'));
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 获取语言图标
  const getLanguageIcon = (languageCode) => {
    switch (languageCode) {
      case 'en': return '🌐';
      case 'zh-CN': return '🇨🇳';
      case 'zh-TW': return '🇹🇼';
      default: return '🌐';
    }
  };

  return (
    <div className={`language-switcher ${className}`} ref={dropdownRef}>
      <button 
        className="language-switcher-button"
        onClick={toggleDropdown}
        aria-label="切换语言"
      >
        <span className="language-icon">
          {getLanguageIcon(currentLanguage)}
        </span>
        <span className="language-text">
          {getLanguageName(currentLanguage)}
        </span>
        <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
          ▼
        </span>
      </button>
      
      {isDropdownOpen && (
        <div className="language-dropdown-menu">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="option-icon">
                {getLanguageIcon(language.code)}
              </span>
              <span className="option-text">
                {language.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;