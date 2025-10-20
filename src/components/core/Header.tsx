import React from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from "../global/LanguageSwitcher";

// 定义本地用户接口
interface User {
  email?: { address: string } | string;
  google?: { name: string };
  wallet?: { address: string };
}

// 定义Header组件接口
interface HeaderProps {
  user?: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { t } = useTranslation()
  
  // 模拟退出登录功能
  const logout = () => {
    console.log('模拟退出登录');
    // 在实际应用中，这里应该调用实际的退出登录逻辑
  }
  
  // 安全地处理用户显示名称
  const displayName: string = user?.email?.address || 
                     user?.email || 
                     (user?.google && 'name' in user.google ? user.google.name : undefined) || 
                     (user?.wallet && 'address' in user.wallet ? 
                      (typeof user.wallet.address === 'string' ? 
                       user.wallet.address.slice(0, 8) + '...' : undefined) : 
                      undefined) || 
                     t('common.user')

  return (
    <header className="bg-white shadow-lg border-b border-[#F0F2F5] fixed top-0 left-0 right-0 z-50 ml-[240px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* 语言切换器 */}
            <LanguageSwitcher className="header-language-switcher" />

            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="icon-container icon-container-primary w-8 h-8 sm:w-10 sm:h-10">
                <span className="font-medium text-xs sm:text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#1c1c1c] hidden sm:inline">
                {displayName}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="btn-secondary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
              type="button"
            >
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header