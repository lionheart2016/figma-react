'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

// 定义语言选项接口
interface LanguageOption {
  code: string;
  name: string;
}

// 定义LanguageSwitcher组件接口
interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-TW', name: '繁體中文' }
  ];

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = async (languageCode: string): Promise<void> => {
    try {
      await i18n.changeLanguage(languageCode);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('语言切换失败:', error);
    }
  };

  const toggleDropdown = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 获取语言图标
  const getLanguageIcon = (languageCode: string): string => {
    switch (languageCode) {
      case 'en': return '🌐';
      case 'zh-CN': return '🇨🇳';
      case 'zh-TW': return '🇹🇼';
      default: return '🌐';
    }
  };

  // 获取语言名称
  const getLanguageName = (languageCode: string): string => {
    const language = languages.find(lang => lang.code === languageCode);
    return language ? language.name : 'English';
  };

  const currentLanguage = i18n.language || 'en';

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