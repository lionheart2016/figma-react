import React, { useState } from 'react';
import { useUser, AccountUtils, ACCOUNT_TYPES } from '../../services/UserStateService';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

// 定义组件属性
interface UserInfoProps {
  className?: string;
  onLogoutSuccess?: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ className = '', onLogoutSuccess }) => {
  // 状态管理
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 使用用户上下文、翻译和主题
  const { user, isAuthenticated, logout, isLoading } = useUser();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  // 切换菜单函数
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡到document
    // console.log('Menu toggled:before', isMenuOpen);
    // const newMenuState = !isMenuOpen;
    setIsMenuOpen(!isMenuOpen);
    // console.log('Menu toggled:after', newMenuState);
  };
  
  // 阻止冒泡函数
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // 处理登录
  const handleLogin = () => {
    // 这里应该跳转到登录页面
    console.log('跳转到登录页面');
    setIsMenuOpen(false);
  };
  
  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      onLogoutSuccess?.();
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 复制钱包地址
  const copyWalletAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      // 可以添加复制成功的提示
      console.log('钱包地址已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 获取用户的钱包账户列表
  const walletAccounts = user?.linkedAccounts ? 
    AccountUtils.filterWalletAccounts(user.linkedAccounts) : [];

  // 获取非钱包账户列表
  const nonWalletAccounts = user?.linkedAccounts ? 
    AccountUtils.filterNonWalletAccounts(user.linkedAccounts) : [];
  
  // 点击外部关闭菜单
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);
  
  return (
    <div className={`relative ${className}`}>
      {/* 用户图标按钮 */}
      <button
        type="button"
        onClick={(e) => toggleMenu(e)}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
          isDarkMode 
            ? 'bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
        aria-label="用户菜单"
        aria-expanded={isMenuOpen}
      >
        {isAuthenticated && user ? (
          <span className="text-sm font-medium">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </span>
        ) : (
          <span className="text-lg">👤</span>
        )}
      </button>

      {/* 下拉菜单 */}
      {isMenuOpen && (
        <div 
          className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg border z-50 ${
            isDarkMode 
              ? 'bg-[#1C1C1C] border-[#2A2A2A]' 
              : 'bg-white border-gray-200'
          }`}
          onClick={stopPropagation}
        >
          <div className="py-2 max-h-80 overflow-y-auto">
            {/* 用户信息显示 */}
            {isAuthenticated && user && (
              <div className={`px-4 py-2 border-b ${
                isDarkMode ? 'border-[#2A2A2A]' : 'border-gray-100'
              }`}>
                <p className={`text-sm font-medium truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {user.email}
                </p>
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {t('userInfo.connected')}
                </p>
              </div>
            )}
            
            {/* 钱包信息显示 */}
            {isAuthenticated && user && (
              <div className={`px-4 py-2 border-b ${
                isDarkMode ? 'border-[#2A2A2A]' : 'border-gray-100'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('userInfo.connectedWallets')}
                  </h3>
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {walletAccounts.length}
                  </span>
                </div>
                
                {walletAccounts.length > 0 ? (
                  <div className="space-y-2">
                    {walletAccounts.map((account, index) => (
                      <div key={account.id || index} className={`rounded p-2 ${
                        isDarkMode ? 'bg-[#2A2A2A]' : 'bg-gray-50'
                      }`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-xs font-medium ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            {AccountUtils.getAccountDisplayName(account)}
                          </span>
                          <button
                            type="button"
                            onClick={() => account.address && copyWalletAddress(account.address)}
                            className={`text-xs hover:text-blue-400 ${
                              isDarkMode ? 'text-[#4B5EF5]' : 'text-blue-600'
                            }`}
                            title={t('userInfo.copyAddress')}
                          >
                            {t('userInfo.copyAddress')}
                          </button>
                        </div>
                        <div className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {AccountUtils.getAccountTypeDescription(account)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-xs italic ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {t('userInfo.noWallets')}
                  </p>
                )}
              </div>
            )}
            
            {/* 登录/登出按钮 */}
            {!isAuthenticated ? (
              <button 
                type="button" 
                onClick={handleLogin}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 ${
                  isDarkMode 
                    ? 'text-gray-200 hover:bg-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('userInfo.login')}
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleLogout}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 ${
                  isDarkMode 
                    ? 'text-gray-200 hover:bg-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('userInfo.logout')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;