import React, { useState, useRef, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useTranslation } from 'react-i18next'
import { useLanguage } from "../../contexts/LanguageContext";

function Header({ user, onLogout }) {
  const { user: privyUser } = usePrivy()
  const { t } = useTranslation()
  const { currentLanguage, switchLanguage, getAvailableLanguages } = useLanguage()
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const dropdownRef = useRef(null)
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  const displayName = user?.email?.address || 
                     user?.email || 
                     user?.google?.name || 
                     user?.wallet?.address?.slice(0, 8) + '...' || 
                     t('common.user')

  const availableLanguages = getAvailableLanguages()

  const handleLanguageChange = async (lng) => {
    const success = await switchLanguage(lng)
    if (success) {
      setShowLanguageDropdown(false)
    }
  }

  return (
    <header className="bg-white shadow-lg border-b border-[#F0F2F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img src="/alphatoken-logo.svg" alt={t('auth.brand.altText')} className="h-6 sm:h-8" />
            </div>
            <div className="ml-2 sm:ml-3">
              <h1 className="text-lg sm:text-xl font-semibold text-[#1c1c1c]">{t('auth.brand.name')}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* 语言切换器 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-[#1c1c1c] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {currentLanguage === 'en' && '🌐'}
                  {currentLanguage === 'zh-CN' && '🇨🇳'}
                  {currentLanguage === 'zh-TW' && '🇹🇼'}
                </span>
                <span className="hidden sm:inline">
                  {currentLanguage === 'en' && t('language.english')}
                  {currentLanguage === 'zh-CN' && t('language.simplifiedChinese')}
                  {currentLanguage === 'zh-TW' && t('language.traditionalChinese')}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 flex items-center justify-center">
                            {lang.code === 'en' && '🌐'}
                            {lang.code === 'zh-CN' && '🇨🇳'}
                            {lang.code === 'zh-TW' && '🇹🇼'}
                          </span>
                          <span>{lang.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
              onClick={onLogout}
              className="btn-secondary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
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