import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';
import Layout from './Layout';
import { useTheme } from '../../contexts/ThemeContext';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  submit?: string;
}

const Register: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  // 处理邮箱输入变化，同时过滤后缀列表
  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    
    // 清除对应字段的错误
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }

    // 检查是否需要显示建议列表
    if (value && !value.includes('@')) {
      // 如果没有@符号，显示所有后缀
      setFilteredSuggestions(commonEmailSuffixes);
      setShowEmailSuggestions(true);
    } else if (value && value.includes('@')) {
      // 如果有@符号，根据@后面的内容过滤
      // const prefix = value.split('@')[0];
      const suffixPart = value.split('@')[1] || '';
      
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
    const prefix = formData.email.includes('@') 
      ? formData.email.split('@')[0]
      : formData.email;
    
    setFormData(prev => ({ ...prev, email: prefix + suffix }));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // 特殊处理邮箱输入
    if (name === 'email') {
      handleEmailChange(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      
      // 清除对应字段的错误
      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = t('auth.register.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.register.validation.emailInvalid');
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = t('auth.register.validation.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.register.validation.passwordMinLength');
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.validation.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.register.validation.passwordMismatch');
    }

    // 条款同意验证
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('auth.register.validation.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 模拟注册API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 保存用户信息到localStorage
      localStorage.setItem('userEmail', formData.email);
      
      // 导航到邮箱验证页面
      navigate(ROUTES.EMAIL_VERIFICATION);
    } catch (error) {
      console.error(t('auth.register.registrationError'), error);
      setErrors({ submit: t('auth.register.registrationFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.INVESTMENT_SELECTION);
  };

  return (
    <Layout
      title={t('auth.register.registerButton')}
      subtitle={t('auth.register.subtitle')}
      showBackButton={true}
      onBack={handleBack}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 邮箱输入 */}
        <div className="relative">
          <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
            {t('auth.register.emailLabel')}
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              ref={emailInputRef}
              className={`w-full px-4 py-3 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] focus:border-transparent ${
                errors.email 
                  ? 'border-red-500' 
                  : isDarkMode ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' : 'border-[#EDEEF3] bg-white'
              }`}
              placeholder={t('auth.register.emailPlaceholder')}
              autoComplete="email"
              aria-autocomplete="list"
              aria-expanded={showEmailSuggestions}
              aria-haspopup={showEmailSuggestions}
            />
            {/* 清除按钮 */}
            {formData.email && (
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, email: '' }));
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                  if (emailInputRef.current) {
                    emailInputRef.current.focus();
                  }
                }}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full transition-opacity duration-200 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={t('common.clear')}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M9.5 2.5L2.5 9.5M2.5 2.5L9.5 9.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
          
          {/* 邮箱后缀建议列表 */}
          {showEmailSuggestions && filteredSuggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className={`absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto ${isDarkMode ? 'bg-[#1A1A1A] border-[#2C2C2C]' : 'bg-white border-[#EDEEF3]'}`}
              role="listbox"
              aria-labelledby="email"
            >
              {filteredSuggestions.map((suffix, index) => {
                const displayText = formData.email.includes('@')
                  ? formData.email.split('@')[0] + suffix
                  : formData.email + suffix;
                
                return (
                  <div
                    key={index}
                    className={`px-4 py-2 cursor-pointer text-sm transition-colors ${isDarkMode ? 'hover:bg-[#2C2C2C] text-white' : 'hover:bg-[#F5F7FF] text-[#1C1C1C]'}`}
                    onClick={() => handleSelectSuffix(suffix)}
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
          
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* 密码输入 */}
        <div>
          <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
            {t('auth.register.passwordLabel')}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] focus:border-transparent ${
              errors.password 
                ? 'border-red-500' 
                : isDarkMode ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' : 'border-[#EDEEF3] bg-white'
            }`}
            placeholder={t('auth.register.passwordPlaceholder')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* 确认密码输入 */}
        <div>
          <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>
            {t('auth.register.confirmPasswordLabel')}
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] focus:border-transparent ${
              errors.confirmPassword 
                ? 'border-red-500' 
                : isDarkMode ? 'border-[#2C2C2C] bg-[#1A1A1A] text-white' : 'border-[#EDEEF3] bg-white'
            }`}
            placeholder={t('auth.register.confirmPasswordPlaceholder')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* 条款同意 */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className={`mt-1 w-4 h-4 text-[#4B5EF5] rounded focus:ring-[#4B5EF5] focus:ring-2 ${isDarkMode ? 'bg-[#1A1A1A] border-gray-600' : 'bg-gray-100 border-gray-300'}`}
          />
          <label htmlFor="agreeToTerms" className={`text-sm leading-5 ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#73798B]'}`}>
            {t('auth.register.agreeToTerms')}{' '}
            <a href="#" className="text-[#4B5EF5] hover:underline">{t('auth.register.termsOfService')}</a>
            {' '}{t('auth.register.and')}{' '}
            <a href="#" className="text-[#4B5EF5] hover:underline">{t('auth.register.privacyPolicy')}</a>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${
            isLoading
              ? 'bg-[#D9D9D9] text-[#73798B] cursor-not-allowed'
              : 'bg-[#4B5EF5] text-white hover:bg-[#3A4BD4] active:bg-[#2A3AB3]'
          }`}
        >
          {isLoading ? t('common.loading') : t('auth.register.registerButton')}
        </button>

        {/* 提交错误 */}
        {errors.submit && (
          <p className="text-sm text-red-500 text-center">{errors.submit}</p>
        )}

        {/* 已有账户链接 */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B6E7A]'}`}>
            {t('auth.register.hasAccount')} {' '}
            <button
              type="button"
              onClick={() => navigate(ROUTES.AUTHENTICATION)}
              className="text-[#4B5EF5] hover:text-[#3D4FD0] font-medium focus:outline-none focus:underline transition-colors"
            >
              {t('auth.register.signIn')}
            </button>
          </p>
        </div>
      </form>
    </Layout>
  );
};

export default Register;