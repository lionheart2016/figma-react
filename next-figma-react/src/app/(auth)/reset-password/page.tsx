'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';


const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(0);
  const router = useRouter();

  const handleBack = () => {
    router.back(); // 返回上一页
  };

  const handleSendVerificationCode = async () => {
    if (!canResend || !emailValid) return;
    
    // 发送验证码逻辑
    setIsLoading(true);
    try {
      // 这里实现发送验证码的API调用
      console.log('发送验证码到:', email);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 设置30秒倒计时
      setCanResend(false);
      setResendCountdown(30);
      
      // 启动倒计时
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('发送验证码失败:', error);
      setEmailError(t('auth.resetPassword.sendCodeFailed') || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 这里实现重置密码的API调用
      console.log('重置密码:', { email, verificationCode });
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 重置成功后跳转到登录页面
      router.push('/login');
    } catch (error) {
      console.error('重置密码失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 邮箱验证逻辑
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError('');
    
    if (value.trim() === '') {
      setEmailValid(false);
    } else {
      const isValid = validateEmail(value);
      setEmailValid(isValid);
      if (!isValid) {
        setEmailError(t('auth.resetPassword.invalidEmail') || 'Please enter a valid email address');
      }
    }
  };

  const handleEmailBlur = () => {
    if (email.trim() === '') {
      setEmailError(t('auth.resetPassword.emailRequired') || 'Email is required');
      setEmailValid(false);
    } else if (!validateEmail(email)) {
      setEmailError(t('auth.resetPassword.invalidEmail') || 'Please enter a valid email address');
      setEmailValid(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 邮箱输入 */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-[14px] font-normal text-white font-poppins">
            {t('auth.resetPassword.emailLabel') || 'Email Address'}
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              className={`w-full max-w-md h-[40px] px-3 rounded-[6px] border ${
                emailError 
                  ? 'border-red-500' 
                  : emailValid 
                    ? 'border-green-500' 
                    : 'border-[#EDEEF3]'
              } bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#4B5EF5]`}
              placeholder={t('auth.resetPassword.emailPlaceholder') || 'Enter your email address'}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>
        </div>

        {/* 验证码输入 */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="verificationCode" className="text-[14px] font-normal text-white font-poppins">
            {t('auth.resetPassword.verificationCodeLabel') || 'Verification Code'}
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full max-w-md h-[40px] px-3 rounded-[6px] border border-[#EDEEF3] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#4B5EF5]"
              placeholder={t('auth.resetPassword.verificationCodePlaceholder') || 'Enter verification code'}
              disabled={!emailValid}
            />
            <button
              type="button"
              onClick={handleSendVerificationCode}
              disabled={!canResend || !emailValid || isLoading}
              className={`min-w-[120px] h-[40px] px-4 rounded-[6px] text-sm font-semibold ${
                canResend && emailValid && !isLoading
                  ? 'bg-[#4B5EF5] text-white hover:bg-[#3D4FD0] cursor-pointer'
                  : 'bg-[#73798B] text-gray-300 cursor-not-allowed'
              }`}
            >
              {resendCountdown > 0 
                ? `${resendCountdown}s` 
                : (t('auth.resetPassword.sendCode') || 'Send Code')
              }
            </button>
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isLoading || !emailValid || !verificationCode}
          className={`w-full max-w-md h-[40px] text-white text-[14px] font-semibold font-poppins rounded-[6px] transition-all duration-200 flex items-center justify-center ${
            emailValid && verificationCode && !isLoading
              ? 'bg-[#4B5EF5] hover:bg-[#3D4FD0] cursor-pointer'
              : 'bg-[#73798B] cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            t('auth.resetPassword.continueButton') || 'Continue'
          )}
        </button>
      </form>

  );
};

export default ResetPassword;