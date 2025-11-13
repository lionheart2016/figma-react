'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface FormData {
  email: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  email?: string;
  agreeToTerms?: string;
  submit?: string;
}

const Register: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTermsAcceptanceModal, setShowTermsAcceptanceModal] = useState<boolean>(false);
  // 邮箱后缀建议相关状态
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  // 引用
  const emailInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    } else {
      const email = formData.email;
      
      // 规则1: 整个邮箱地址必须包含且仅包含一个@字符
      if ((email.match(/@/g) || []).length !== 1) {
        newErrors.email = "请输入有效的邮箱地址";
      }
      // 规则2: 邮箱地址中不得包含任何emoji符号
      else if (/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1F170}-\u{1F251}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}]/gu.test(email)) {
        newErrors.email = "请输入有效的邮箱地址";
      }
      // 规则3: @字符不能位于邮箱地址的开头或结尾位置
      else if (email.startsWith('@') || email.endsWith('@')) {
        newErrors.email = "请输入有效的邮箱地址";
      }
      // 规则4: 邮箱地址中不允许出现连续的两个.，且每个.之间必须存在有效内容
      else if (email.includes('..')) {
        newErrors.email = "请输入有效的邮箱地址";
      }
      // 规则5: 邮箱地址的域名部分总长度不得超过255个字符
      else {
        const domainPart = email.split('@')[1];
        if (domainPart.length > 255) {
          newErrors.email = "请输入有效的邮箱地址";
        }
        // 规则6: 邮箱地址不能以.开头或结尾
        else if (email.startsWith('.') || email.endsWith('.')) {
          newErrors.email = "请输入有效的邮箱地址";
        }
      }
    }

    // 条款同意验证
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('auth.register.validation.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [showAccountExistsModal, setShowAccountExistsModal] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 进行表单验证
    const isValid = validateForm();
    
    // 优先校验邮箱格式是否存在错误
    if (errors.email || !formData.email.trim()) {
      if (errors.email) {
        toast.error(errors.email, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      return;
    }

    // 如果用户未接受条款，显示条款接受提示弹窗
    if (!formData.agreeToTerms) {
      setShowTermsAcceptanceModal(true);
      return;
    }

    // 当用户输入内容验证无误，并且已通过主动点击条款复选框或通过TermsAcceptModal弹窗确认条款复选框后
    // 保存用户信息到localStorage并导航至EmailVerification页面
    setIsLoading(true);

    try {
      // 模拟注册API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 保存用户信息到localStorage
      localStorage.setItem('userEmail', formData.email);
      
      // 导航到邮箱验证页面
      router.push('/email-verification');
    } catch (error) {
      console.error(t('auth.register.registrationError'), error);
      setErrors({ submit: t('auth.register.registrationFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountExistsConfirm = () => {
    // 用户确认登录，导航到登录页面
    router.push('/login');
  };

  const handleAccountExistsCancel = () => {
    // 用户取消，重置弹窗状态
    setShowAccountExistsModal(false);
  };

  const handleTermsAccept = () => {
    // 用户接受条款，勾选同意复选框并关闭弹窗
    setFormData(prev => ({ ...prev, agreeToTerms: true }));
    setShowTermsAcceptanceModal(false);
  };

  const handleTermsDecline = () => {
    // 用户拒绝条款，仅关闭弹窗
    setShowTermsAcceptanceModal(false);
  };

  return (
    <>


        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
          {/* 邮箱输入 */}
          <div className="relative">
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}
            >
              {t('auth.email')}
            </label>
            <div className={`flex items-center border rounded-lg ${errors.email ? 'border-red-500' : isDarkMode ? 'border-[#2C2C2C] bg-[#1A1A1A]' : 'border-[#EDEEF3] bg-white'}`}>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => {
                  // 当用户退出编辑状态时进行邮箱验证
                  if (formData.email) {
                    validateForm();
                  }
                }}
                ref={emailInputRef}
                className={`flex-1 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] focus:border-transparent rounded-lg ${isDarkMode ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1C1C1C]'}`}
                placeholder={t('auth.register.emailPlaceholder')}
                autoComplete="email"
                aria-autocomplete="list"
                aria-expanded={showEmailSuggestions}
                aria-haspopup={showEmailSuggestions}
              />
              {formData.email && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, email: '' }));
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: '' }));
                    }
                    setShowEmailSuggestions(false);
                    if (emailInputRef.current) {
                      emailInputRef.current.focus();
                    }
                  }}
                  className="absolute right-0 mr-3 p-1 rounded-full transition-all duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4B5EF5]"
                  style={{
                    opacity: 1,
                    transform: 'scale(1)',
                    animation: 'fadeIn 0.2s ease-in-out'
                  }}
                  aria-label={t('common.clear')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#B9BCC5' : '#73798B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            
            {/* 邮箱后缀建议列表 - 移到输入框容器外部，确保正确定位 */}
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
                  const displayText = formData.email.includes('@')
                    ? formData.email.split('@')[0] + suffix
                    : formData.email + suffix;
                  
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
            
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* 条款同意 */}
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-5 h-5 mt-0.5 cursor-pointer">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${
                  formData.agreeToTerms
                    ? `border-[#4B5EF5] bg-[#4B5EF5]`
                    : `border-${isDarkMode ? '[#2C2C2C]' : '[#EDEEF3]'}`
                }`}
              >
                {formData.agreeToTerms && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="sr-only"
              />
            </div>
            <label htmlFor="agreeToTerms" className={`text-sm ${isDarkMode ? 'text-[#B9BCC5]' : 'text-[#73798B]'} cursor-pointer`}>
              {t('auth.register.agreeToTerms')}{' '}
              <a href="#" className="text-[#4B5EF5] hover:underline">{t('auth.register.termsOfService')}</a>
              {' '}{t('auth.register.and')}{' '}
              <a href="#" className="text-[#4B5EF5] hover:underline">{t('auth.register.privacyPolicy')}</a>
            </label>
          </div>
          {/* {errors.agreeToTerms && (
            <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
          )} */}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isLoading || !formData.email.trim()}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${isDarkMode ? 'text-[#EDEEF3]' : 'text-white'}
              ${isLoading || !formData.email.trim()
                ? 'bg-[#73798B] bg-opacity-70 cursor-not-allowed'
                : 'bg-[#4B5EF5] hover:bg-[#3A4BD4] active:bg-[#2A3AB3]'
              }`}
            style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('common.loading')}
              </>
            ) : (
              t('auth.register.registerButton')
            )}
          </button>

          {/* 提交错误 */}
          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          {/* 已有账户链接 */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-[#B9BCC5]' : 'text-[#73798B]'}`}>
              {t('auth.register.hasAccount')} {' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-[#4B5EF5] hover:text-[#3D4FD0] font-medium focus:outline-none focus:underline transition-colors"
              >
                {t('login')}
              </button>
            </p>
          </div>
        </form>
        
        <ToastContainer />

      
      {/* 账号已存在弹窗 */}
      {showAccountExistsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">账号已存在</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              该邮箱地址已被注册，是否要登录？
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleAccountExistsCancel}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleAccountExistsConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                登录
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 条款接受提示弹窗 */}
      {showTermsAcceptanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">接受条款</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              请接受服务条款和隐私政策以继续注册。
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleTermsDecline}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                拒绝
              </button>
              <button
                onClick={handleTermsAccept}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                接受
              </button>
            </div>
          </div>
        </div>
      )}
      </>
  );
};

export default Register;