import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onBlur?: () => void;
  validateOnChange?: boolean; // 是否在输入时进行校验
  validateOnBlur?: boolean; // 是否在失焦时进行校验
  onValidationChange?: (isValid: boolean) => void; // 校验状态变化回调
}

const EmailInput: React.FC<EmailInputProps> = ({ 
  value, 
  onChange, 
  error: externalError, 
  onBlur, 
  validateOnChange = false, 
  validateOnBlur = true,
  onValidationChange
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [internalError, setInternalError] = useState<string>('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // 常用邮箱后缀列表
  const commonEmailSuffixes = [
    '@gmail.com',
    '@outlook.com',
    '@hotmail.com',
    '@yahoo.com',
    '@icloud.com',
    '@163.com',
    '@126.com',
    '@qq.com',
    '@sina.com',
    '@sohu.com',
    '@aliyun.com',
    '@tencent.com',
    '@foxmail.com'
  ];

  // 邮箱格式校验函数
  const validateEmail = (email: string): string => {
    // 1. 校验邮箱是否为空
    if (!email || email.trim() === '') {
      return t('auth.login.validation.emailRequired');
    }

    // 2. 校验整个邮箱地址中是否有且仅有一个@字符
    if ((email.match(/@/g) || []).length !== 1) {
      return t('auth.login.validation.invalidEmail');
    }

    // 3. 校验整个邮箱地址是否不包含emoji符号
    if (/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1F170}-\u{1F251}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}]/gu.test(email)) {
      return t('auth.login.validation.invalidEmail');
    }

    // 4. 校验@字符是否不出现在邮箱地址的开头或结尾
    if (email.startsWith('@') || email.endsWith('@')) {
      return t('auth.login.validation.invalidEmail');
    }

    // 5. 校验邮箱地址中每个.之间是否存在内容，且不包含连续的两个.
    if (email.includes('..')) {
      return t('auth.login.validation.invalidEmail');
    }

    // 6. 校验域名部分的总长度是否不超过255个字符
    const parts = email.split('@');
    const domain = parts[1];
    if (domain.length > 255) {
      return t('auth.login.validation.invalidEmail');
    }

    // 7. 校验邮箱地址是否不以.开头或结尾
    if (email.startsWith('.') || email.endsWith('.')) {
      return t('auth.login.validation.invalidEmail');
    }

    // 检查域名部分的.之间是否有内容
    if (domain.includes('.')) {
      const domainParts = domain.split('.');
      for (const part of domainParts) {
        if (part === '') {
          return t('auth.login.validation.invalidEmail');
        }
      }
    }

    // 检查用户名部分的.之间是否有内容
    const username = parts[0];
    if (username.includes('.')) {
      const usernameParts = username.split('.');
      for (const part of usernameParts) {
        if (part === '') {
          return t('auth.login.validation.invalidEmail');
        }
      }
    }

    return ''; // 验证通过
  };

  // 处理邮箱输入变化，同时过滤后缀列表
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // 如果开启输入时校验，则执行校验
    if (validateOnChange) {
      const validationError = validateEmail(newValue);
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
        onValidationChange(true);
      }
    }
    
    // 检查是否需要显示建议列表
    if (newValue && !newValue.includes('@')) {
      // 如果没有@符号，显示所有后缀
      setFilteredSuggestions(commonEmailSuffixes);
      setShowEmailSuggestions(true);
    } else if (newValue && newValue.includes('@')) {
      // 如果有@符号，根据@后面的内容过滤
      const suffixPart = newValue.split('@')[1] || '';
      
      // 过滤包含suffixPart的后缀
      const filtered = commonEmailSuffixes.filter(suffix => 
        suffix.slice(1).includes(suffixPart)
      );
      
      if (filtered.length > 0) {
        setFilteredSuggestions(filtered);
        setShowEmailSuggestions(true);
      } else {
        setShowEmailSuggestions(false);
      }
    } else {
      setShowEmailSuggestions(false);
    }
  };

  // 处理选择邮箱后缀
  const handleSelectSuffix = (suffix: string) => {
    const prefix = value.includes('@') 
      ? value.split('@')[0]
      : value;
    const newEmail = prefix + suffix;
    
    onChange(newEmail);
    
    // 如果开启输入时校验，则执行校验
    if (validateOnChange) {
      const validationError = validateEmail(newEmail);
      setInternalError(validationError);
      // 通知父组件校验状态变化
      if (onValidationChange) {
        onValidationChange(validationError === '');
      }
    }
    
    setShowEmailSuggestions(false);
    
    // 保持输入框焦点
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  };

  // 点击外部关闭建议列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        emailInputRef.current &&
        !emailInputRef.current.contains(event.target as Node)
      ) {
        setShowEmailSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 清除邮箱输入内容
  const clearEmail = () => {
    onChange('');
    setShowEmailSuggestions(false);
    setInternalError('');
    // 通知父组件校验状态变化
    if (onValidationChange) {
      onValidationChange(false); // 邮箱为空时校验不通过
    }
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  };

  // 处理失焦事件
  const handleBlur = () => {
    // 如果开启失焦时校验，则执行校验
    if (validateOnBlur && value) {
      const validationError = validateEmail(value);
      setInternalError(validationError);
      // 通知父组件校验状态变化
      if (onValidationChange) {
        onValidationChange(validationError === '');
      }
    }
    
    // 调用外部传入的失焦处理函数
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div className="relative">
      <div className={`flex items-center border rounded-lg ${externalError ? 'border-red-500' : isDarkMode ? 'border-[#2C2C2C] bg-[#1A1A1A]' : 'border-[#EDEEF3] bg-white'}`} style={{ height: '56px' }}>
        <input
          id="email"
          name="email"
          type="email"
          value={value}
          onChange={handleEmailChange}
          onBlur={handleBlur}
          ref={emailInputRef}
          className={`flex-1 p-4 text-sm focus:outline-none rounded-lg ${isDarkMode ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1C1C1C]'}`}
          placeholder={t('auth.email')}
          autoComplete="email"
          aria-autocomplete="list"
          aria-expanded={showEmailSuggestions}
          aria-haspopup={showEmailSuggestions}
        />
        {value && (
          <button
            type="button"
            onClick={clearEmail}
            className="absolute right-0 mr-3 p-1 rounded-full transition-all duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            style={{
              opacity: 1,
              transform: 'scale(1)',
              animation: 'fadeIn 0.2s ease-in-out'
            }}
            aria-label={t('common.clear')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={externalError || internalError ? '#F56565' : (isDarkMode ? '#B9BCC5' : '#73798B')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      
      {/* 邮箱后缀建议列表 */}
      {showEmailSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className={`absolute top-full left-0 right-0 z-50 mt-0.5 border rounded-lg shadow-lg max-h-60 overflow-y-auto ${isDarkMode ? 'bg-[#1A1A1A] border-[#2C2C2C]' : 'bg-white border-[#EDEEF3]'} origin-top`}
          style={{
            width: '100%',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          role="listbox"
          aria-labelledby="email"
        >
          {filteredSuggestions.map((suffix, index) => {
            const displayText = value.includes('@')
              ? value.split('@')[0] + suffix
              : value + suffix;
            
            return (
              <div
                key={index}
                className={`px-4 py-2 cursor-pointer text-sm transition-colors ${isDarkMode ? 'hover:bg-[#2C2C2C] text-white' : 'hover:bg-[#F5F7FF] text-[#1C1C1C]'}`}
                onClick={() => handleSelectSuffix(suffix)}
                onMouseDown={(e) => e.preventDefault()} // 防止点击后输入框失去焦点
                role="option"
                id={`email-suggestion-${index}`}
                aria-selected="false"
              >
                {displayText}
              </div>
            );
          })}
        </div>
      )}
      
      {/* 优先显示外部传入的错误，其次显示内部校验错误 */}
      {(externalError || internalError) && (
        <p className="mt-1 text-sm text-red-500">{externalError || internalError}</p>
      )}
    </div>
  );
};

export default EmailInput;