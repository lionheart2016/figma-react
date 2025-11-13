import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  autoFocus?: boolean;
  showStrengthIndicator?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  error,
  className = '',
  autoFocus = false,
  showStrengthIndicator = false
}) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 密码强度评估
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    
    // 长度检查
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // 字符类型检查
    if (/[a-z]/.test(password)) score += 1; // 小写字母
    if (/[A-Z]/.test(password)) score += 1; // 大写字母
    if (/[0-9]/.test(password)) score += 1; // 数字
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // 特殊字符
    
    // 根据分数返回强度信息
    if (score <= 2) return { score, label: t('auth.weak') || '弱', color: 'bg-red-500' };
    if (score <= 4) return { score, label: t('auth.medium') || '中等', color: 'bg-yellow-500' };
    return { score, label: t('auth.strong') || '强', color: 'bg-green-500' };
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // 处理焦点事件
  const handleFocus = () => {
    setIsFocused(true);
  };

  // 处理失去焦点事件
  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  // 切换密码显示状态
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    inputRef.current?.focus();
  };

  // 清除输入
  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const strength = getPasswordStrength(value);
  const showError = error || (value && value.length < 8);

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
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || t('auth.enterPassword') || '请输入密码'}
          disabled={disabled}
          className="w-full px-3 py-2 bg-transparent outline-none text-sm placeholder-gray-500 disabled:cursor-not-allowed pr-20"
          autoComplete="current-password"
          autoFocus={autoFocus}
        />
        
        {/* 操作按钮区域 */}
        <div className="flex items-center space-x-1 pr-2">
          {/* 清除按钮 */}
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
          
          {/* 显示/隐藏密码按钮 */}
          {!disabled && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? (t('auth.hidePassword') || '隐藏密码') : (t('auth.showPassword') || '显示密码')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPassword ? (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </>
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 密码强度指示器 */}
      {showStrengthIndicator && value && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>{t('auth.passwordStrength') || '密码强度'}:</span>
            <span className={`font-medium ${
              strength.score <= 2 ? 'text-red-600' : 
              strength.score <= 4 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {strength.label}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${strength.color}`}
              style={{ width: `${(strength.score / 6) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {showError && (
        <div className="mt-1 text-xs text-red-600 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error || t('auth.passwordTooShort') || '密码至少需要8个字符'}
        </div>
      )}

      {/* 密码要求提示 */}
      {!value && !error && (
        <div className="mt-1 text-xs text-gray-500">
          {t('auth.passwordRequirements') || '密码至少8个字符，包含字母和数字'}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;