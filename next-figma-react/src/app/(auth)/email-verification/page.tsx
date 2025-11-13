'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';


const EmailVerification: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(59); // 重发倒计时59秒
  const [verificationExpiryTimer, setVerificationExpiryTimer] = useState<number>(600); // 10分钟有效期，单位秒
  const [canResend, setCanResend] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [currentVerificationId, setCurrentVerificationId] = useState<string>(''); // 当前验证码ID
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // 获取用户邮箱
  const userEmail = localStorage.getItem('userEmail') || t('auth.emailVerification.yourEmail');
  
  // 重发倒计时逻辑
  useEffect(() => {
    if (resendTimer > 0) {
      const countdown = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);
  
  // 验证码过期倒计时逻辑
  useEffect(() => {
    if (verificationExpiryTimer > 0) {
      const countdown = setTimeout(() => {
        setVerificationExpiryTimer(verificationExpiryTimer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else {
      // 验证码过期，可以提示用户重新发送
      setError(t('auth.emailVerification.codeExpired'));
    }
  }, [verificationExpiryTimer]);
  
  // 格式化倒计时显示（分:秒）
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 处理输入变化
  const handleInputChange = (index: number, value: string): void => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError('');

      // 自动聚焦到下一个输入框
      if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }

      // 如果所有输入框都有值，自动验证
      if (newCode.every(digit => digit !== '') && index === 5) {
        // 使用最新的newCode进行验证，避免状态更新异步性问题
        handleVerifyWithCode(newCode);
      }
    }
  };

  // 处理键盘事件
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !code[index] && index > 0 && inputRefs.current[index - 1]) {
      // 如果当前输入框为空且按下退格键，聚焦到前一个输入框
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 处理粘贴事件
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const numbers = pasteData.replace(/\D/g, '').slice(0, 6);
    
    if (numbers.length === 6) {
      const newCode = numbers.split('');
      setCode(newCode);
      setError('');
      
      // 聚焦到最后一个输入框
      if (inputRefs.current[5]) {
        inputRefs.current[5]?.focus();
      }
      
      // 自动验证（使用最新的newCode，避免状态更新异步性问题）
      setTimeout(() => {
        handleVerifyWithCode(newCode);
      }, 100);
    }
  };

  // 验证验证码（使用传入的验证码数组）
  const handleVerifyWithCode = async (codeArray: string[]): Promise<void> => {
    const verificationCode = codeArray.join('');
    if (verificationCode.length !== 6) {
      setError(t('auth.emailVerification.incompleteCode'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 验证成功，导航到认证页面
      router.push('/authentication');
    } catch (err) {
      setError(t('auth.emailVerification.verificationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // 验证验证码（使用当前状态）
  const handleVerify = async (): Promise<void> => {
    return handleVerifyWithCode(code);
  };

  // 重新发送验证码
  const handleResend = async (): Promise<void> => {
    if (!canResend) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // 模拟API调用 - 作废前一个验证码
      if (currentVerificationId) {
        console.log('Cancelling previous verification code:', currentVerificationId);
        // 实际项目中这里应该调用API作废前一个验证码
      }
      
      // 生成新的验证码ID
      const newVerificationId = `verification_${Date.now()}`;
      setCurrentVerificationId(newVerificationId);
      
      // 模拟发送新验证码的API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Resending verification code to:', userEmail);
      
      // 重置重发倒计时
      setResendTimer(59);
      setCanResend(false);
      
      // 重置验证码输入框
      setCode(['', '', '', '', '', '']);
      
      // 重置验证码过期时间
      setVerificationExpiryTimer(600);
    } catch (err) {
      setError(t('auth.emailVerification.resendFailed') || 'Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理显示帮助弹窗
  const handleShowHelpModal = (): void => {
    setShowHelpModal(true);
  };
  
  // 处理关闭帮助弹窗
  const handleCloseHelpModal = (): void => {
    setShowHelpModal(false);
  };
  
  // 处理联系客服
  const handleContactSupport = (): void => {
    // 这里可以实现跳转到客服页面或打开客服聊天窗口
    console.log('Contacting customer support');
    setShowHelpModal(false);
    // 实际项目中这里应该导航到客服页面或打开客服聊天窗口
  };

  // 返回上一页
  const handleBack = (): void => {
    router.push('/register');
  };
  
  // 处理前往邮件
  const handleGoToMail = (): void => {
    // 简单的邮件链接处理
    if (userEmail && userEmail.includes('@')) {
      const domain = userEmail.split('@')[1];
      let mailUrl = '';
      
      switch (domain) {
        case 'gmail.com':
          mailUrl = 'https://mail.google.com';
          break;
        case 'outlook.com':
        case 'hotmail.com':
          mailUrl = 'https://outlook.live.com';
          break;
        case 'yahoo.com':
          mailUrl = 'https://mail.yahoo.com';
          break;
        case 'icloud.com':
          mailUrl = 'https://www.icloud.com/mail';
          break;
        default:
          mailUrl = `https://${domain}`;
      }
      
      window.open(mailUrl, '_blank');
    }
  };

  return (
    <>
        {/* 邮箱信息和前往邮件按钮区域 */}
        <div className="flex items-center justify-center mt-4 space-x-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>{userEmail}</span>
          </div>
          
          <span className="text-[#B9BCC5]">|</span>
          
          <button 
            onClick={handleGoToMail}
            className="flex items-center text-sm text-[#4B5EF5] hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            {t('auth.emailVerification.goToMail') || 'Go to Mail'}
          </button>
        </div>
        
        {/* 验证码输入区域 */}
        <div className="flex space-x-6 mt-8 justify-center">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-[60px] h-[60px] text-center text-lg font-semibold border-2 rounded-[10px] focus:outline-none ${error ? 'border-red-500' : index === 0 ? 'border-[#4B5EF5] shadow-[0px_0px_0px_4px_rgba(31,50,214,0.15)] bg-white' : 'border-[#EDEEF3] bg-white'} ${isDarkMode ? 'text-white' : 'text-black'}`}
              style={{ 
                fontSize: '24px',
                lineHeight: '1.2'
              }}
            />
          ))}
        </div>

        {/* 错误信息 */}
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}
        
        {/* 分隔线 */}
        <div className="w-full max-w-md border-t border-[#575757] my-6"></div>
        
        {/* 帮助链接区域 */}
        <div className="text-center">
          <p className="text-sm font-semibold text-[#4B5EF5]">
            <button
              onClick={handleShowHelpModal}
              className="underline mr-4"
            >
              {t('auth.emailVerification.notReceivingCode')}
            </button>
            {t('common.or') || 'or'}{' '}
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={canResend ? 'underline' : ''}
            >
              {canResend ? (t('auth.emailVerification.resendCode') || 'Resend') : `${t('auth.emailVerification.resendIn') || 'Resend in'} ${formatTimer(resendTimer)}`}
            </button>
          </p>
        </div>

        {/* 继续按钮 */}
        <button
          onClick={handleVerify}
          disabled={isLoading || code.some(digit => digit === '')}
          className={`w-full max-w-md h-[40px] rounded-[6px] font-semibold text-sm mt-8 ${isLoading || code.some(digit => digit === '') ? 'bg-[#545965] text-[#B9BCC5] cursor-not-allowed' : 'bg-[#4B5EF5] text-white hover:bg-[#3A4BD4] active:bg-[#2A3AB3]'}`}
        >
          {isLoading ? (t('auth.emailVerification.verifying') || 'Verifying...') : (t('auth.emailVerification.continue') || 'Continue')}
        </button>

      
      {/* 帮助弹窗 */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {t('auth.emailVerification.notReceivingCode') || 'Not receiving code?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('auth.emailVerification.helpDescription') || 'If you are not receiving the verification code, you can try the following:'}
            </p>
            <div className="space-y-3 mb-6">
              <p className="text-sm">• {t('auth.emailVerification.checkSpam') || 'Check your spam folder'}</p>
              <p className="text-sm">• {t('auth.emailVerification.verifyEmail') || 'Make sure you entered the correct email address'}</p>
              <p className="text-sm">• {t('auth.emailVerification.waitFewMinutes') || 'Wait a few minutes and try again'}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCloseHelpModal}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                {t('common.close') || 'Close'}
              </button>
              <button
                onClick={handleContactSupport}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t('auth.emailVerification.contactSupport') || 'Contact Support'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailVerification;