import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  autoFocus?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  error,
  className = '',
  autoFocus = false
}) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 常见的邮箱后缀
  const commonEmailDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'qq.com',
    '163.com',
    '126.com',
    'sina.com'
  ];

  // 邮箱验证正则表达式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 获取邮箱后缀建议
  const getEmailSuggestions = (input: string) => {
    if (!input.includes('@')) {
      return commonEmailDomains.map(domain => `${input}@${domain}`);
    }
    
    const [localPart, domainPart] = input.split('@');
    if (!domainPart) {
      return commonEmailDomains.map(domain => `${localPart}@${domain}`);
    }
    
    return commonEmailDomains
      .filter(domain => domain.startsWith(domainPart))
      .map(domain => `${localPart}@${domain}`);
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // 显示建议的条件
    if (newValue && !newValue.includes('@')) {
      setShowSuggestions(true);
    } else if (newValue.includes('@') && !newValue.endsWith('.')) {
      const suggestions = getEmailSuggestions(newValue);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // 处理焦点事件
  const handleFocus = () => {
    setIsFocused(true);
    if (value && !value.includes('@')) {
      setShowSuggestions(true);
    }
  };

  // 处理失去焦点事件
  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowSuggestions(false), 200); // 延迟隐藏以允许点击建议
    onBlur?.();
  };

  // 选择建议
  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // 清除输入
  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  // 验证邮箱格式
  const isValidEmail = emailRegex.test(value);
  const showError = error || (value && !isValidEmail);

  // 自动聚焦
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const suggestions = getEmailSuggestions(value);

  return (
    <div className={`relative ${className}`}>
      <div className={`relative flex items-center border rounded-lg transition-all duration-200 ${
        disabled 
          ? 'bg-gray-100 border-gray-300 text-gray-500' 
          : showError
            ? 'border-red-500 bg-red-50'
            : isFocused
              ? 'border-blue-500 bg-white shadow-sm'
              : 'border-gray-300 bg-white hover:border-gray-400'
      }`}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || t('auth.enterEmail') || '请输入邮箱地址'}
          disabled={disabled}
          className="w-full px-3 py-2 bg-transparent outline-none text-sm placeholder-gray-500 disabled:cursor-not-allowed"
          autoComplete="email"
        />
        
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t('common.clear') || '清除'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 邮箱后缀建议 */}
      {showSuggestions && suggestions.length > 0 && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* 错误提示 */}
      {showError && (
        <div className="mt-1 text-xs text-red-600 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error || t('auth.invalidEmail') || '请输入有效的邮箱地址'}
        </div>
      )}

      {/* 验证成功提示 */}
      {value && isValidEmail && !error && (
        <div className="mt-1 text-xs text-green-600 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {t('auth.validEmail') || '邮箱格式正确'}
        </div>
      )}
    </div>
  );
};

export default EmailInput;