'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const UserInfo: React.FC = () => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // 处理登出逻辑
    console.log('用户登出');
    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    // 处理个人资料逻辑
    console.log('打开个人资料');
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">U</span>
        </div>
        <span className="text-sm font-medium text-gray-700">
          {t('user.name', '用户')}
        </span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            <button
              onClick={handleProfile}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              {t('user.profile', '个人资料')}
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              {t('user.logout', '登出')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;