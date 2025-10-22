import React from 'react'
import LanguageSwitcher from "../global/LanguageSwitcher";
import UserInfo from "../global/UserInfo";

const Header: React.FC = () => {

  return (
    <header className="bg-white shadow-lg border-b border-[#F0F2F5] fixed top-0 right-0 z-50 left-[240px] md:left-[240px] sm:left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* 语言切换器 */}
            <LanguageSwitcher className="header-language-switcher" />

            {/* 用户信息组件 */}
            <UserInfo />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header