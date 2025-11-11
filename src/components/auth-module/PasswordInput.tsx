import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  validateOnChange?: boolean; // 是否在输入时进行校验
  validateOnBlur?: boolean; // 是否在失焦时进行校验
  onValidationChange?: (isValid: boolean) => void; // 校验状态变化回调
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  value, 
  onChange, 
  error: externalError, 
  placeholder,
  validateOnChange = false,
  validateOnBlur = true,
  onValidationChange
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [internalError, setInternalError] = useState<string>('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // 密码格式校验函数
  const validatePassword = (password: string): string => {
    // 1. 校验密码是否为空
    if (!password || password.trim() === '') {
      return t('auth.login.validation.passwordRequired');
    }

    // 2. 校验密码是否超过8位字符
    if (password.length < 8) {
      return t('auth.login.validation.passwordTooShort');
    }

    return ''; // 验证通过
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // 如果开启输入时校验，则执行校验
    if (validateOnChange) {
      const validationError = validatePassword(newValue);
      setInternalError(validationError);
      // 通知父组件校验状态变化
      if (onValidationChange) {
        onValidationChange(validationError === '');
      }
    } else {
      // 清除内部错误
      setInternalError('');
      // 通知父组件校验状态变化
      if (onValidationChange) {
        // 修复：只有当密码不为空时才返回true
        onValidationChange(newValue !== '');
      }
    }
  };

  const clearPassword = () => {
    onChange('');
    setInternalError('');
    // 通知父组件校验状态变化
    if (onValidationChange) {
      onValidationChange(false); // 密码为空时校验不通过
    }
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };

  // 处理失焦事件
  const handleBlur = () => {
    // 如果开启失焦时校验，则执行校验
    if (validateOnBlur) {
      const validationError = validatePassword(value);
      setInternalError(validationError);
      // 通知父组件校验状态变化
      if (onValidationChange) {
        onValidationChange(validationError === '');
      }
    }
  };

  return (
    <div className="relative">
      <div className={`flex items-center border rounded-lg ${(externalError || internalError) ? 'border-red-500' : isDarkMode ? 'border-[#2C2C2C] bg-[#1A1A1A]' : 'border-[#EDEEF3] bg-white'}`} style={{ height: '56px' }}>
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          ref={passwordInputRef}
          className={`flex-1 p-4 text-sm border-0 focus:outline-none rounded-lg`}
          placeholder={placeholder || t('auth.password')}
          autoComplete="current-password"
        />
        {value && (
          <div className="flex items-center gap-x-2 p-2">
            <button
              type="button"
              onClick={toggleShowPassword}
              className="p-1 rounded-full transition-all duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              aria-label={showPassword ? t('common.hidePassword') : t('common.showPassword')}
            >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#B9BCC5' : '#73798B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <line x1="12" y1="16" x2="12" y2="16"></line>
              </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#B9BCC5' : '#73798B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  <line x1="2" y1="2" x2="22" y2="22"></line>
                </svg>
              )}
            </button>
            <button
              type="button"
              className="p-1 rounded-full transition-all duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              style={{
                opacity: 1,
                transform: 'scale(1)',
                animation: 'fadeIn 0.2s ease-in-out'
              }}
              aria-label={t('common.clear')}
              onClick={clearPassword}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#B9BCC5' : '#73798B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}
      </div>
      {/* 优先显示外部传入的错误，其次显示内部校验错误 */}
      {(externalError || internalError) && (
        <p className="mt-1 text-sm text-red-500">{externalError || internalError}</p>
      )}
    </div>
  );
};

export default PasswordInput;