import React, { useState } from 'react';

// 确保React类型定义正确
interface UserInfoProps {}

const UserInfo: React.FC<UserInfoProps> = () => {
  // 状态管理
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 切换菜单函数
  const toggleMenu = () => {
    console.log('Menu toggled:', !isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };
  
  // 阻止冒泡函数
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
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
    <div className="relative z-50">
      {/* 用户按钮 */}
      <button 
        onClick={toggleMenu}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none"
        type="button"
      >
        <span>👤</span>
      </button>
      
      {/* 下拉菜单 - 使用条件渲染 */}
      {isMenuOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1"
          onClick={stopPropagation}
          style={{
            position: 'absolute',
            zIndex: 9999,
            display: 'block',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          {/* 菜单项 */}
          <div className="px-4 py-2 text-sm text-gray-700">
            <button 
              className="block w-full text-left py-1 hover:bg-gray-100 px-2 rounded"
            >
              登录
            </button>
            <button 
              className="block w-full text-left py-1 hover:bg-gray-100 px-2 rounded mt-1"
            >
              登出
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;