import React from 'react'
import LanguageSwitcher from "../global/LanguageSwitcher";
import ThemeSwitcher from "../global/ThemeSwitcher";
import UserInfo from "../global/UserInfo";
import { useTheme } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <header className={`fixed top-0 right-0 z-50 h-16 transition-all duration-300 ${isDarkMode ? 'bg-[#1A1A1A] border-[#2A2A2A]' : 'bg-white border-[#F0F2F5]'} border-b shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-full">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* 语言切换器 */}
            <LanguageSwitcher className="header-language-switcher" />
            
            {/* 主题切换器 */}
            <ThemeSwitcher className="header-theme-switcher" />

            {/* 用户信息组件 */}
            <UserInfo />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header