import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeSwitcher.css';

// 定义ThemeSwitcher组件接口
interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-switcher ${className}`}
      onClick={toggleTheme}
      aria-label={isDarkMode ? '切换到明亮主题' : '切换到暗黑主题'}
      title={isDarkMode ? '明亮主题' : '暗黑主题'}
    >
      <span className={`theme-icon ${isDarkMode ? 'dark' : 'light'}`}>
        {isDarkMode ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeSwitcher;