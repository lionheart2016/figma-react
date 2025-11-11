import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';
import { useTheme } from '../../contexts/ThemeContext';
import { isMobile, isDesktop } from '../../utils/deviceDetection';
import { getEmailProvider } from '../../utils/emailProvider';
import VerifyHelpModal from './VerifyHelpModal';
import Layout from './Layout';

const EmailVerification: React.FC = () => {
  const { t, i18n } = useTranslation();
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
  const navigate = useNavigate();

  // 获取用户邮箱
  const userEmail = localStorage.getItem('userEmail') || t('auth.emailVerification.yourEmail');
  
  // 检查是否为桌面端
  const [isDesktopDevice, setIsDesktopDevice] = useState<boolean>(false);
  
  // 获取邮箱提供商信息
  const emailProvider = userEmail && userEmail !== t('auth.emailVerification.yourEmail') 
    ? getEmailProvider(userEmail)
    : null;

  // 设备检测
  useEffect(() => {
    setIsDesktopDevice(isDesktop());
    
    // 监听窗口大小变化
    const handleResize = () => {
      setIsDesktopDevice(isDesktop());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      navigate(ROUTES.AUTHENTICATION);
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
    navigate(ROUTES.REGISTER);
  };
  
  // 处理前往邮件
  const handleGoToMail = (): void => {
    if (emailProvider) {
      window.open(emailProvider.url, '_blank');
    }
  };

  return (
    <>
      <Layout
        title={t('auth.emailVerification.title') || 'Verify your email address'}
        subtitle={t('auth.emailVerification.enterCode', { expiry: formatTimer(verificationExpiryTimer) }) || `Please enter the email verification code, Valid for ${formatTimer(verificationExpiryTimer)}`}
        showBackButton={true}
        onBack={handleBack}
      >
        {/* 邮箱信息和前往邮件按钮区域 */}
        <div className="flex items-center justify-center mt-4 space-x-4">
          <div className="flex items-center">
            <img src="/email-icon.svg" alt="Email" className="w-5 h-5 mr-2" />
            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-[#1C1C1C]'}`}>{userEmail}</span>
          </div>
          
          <span className="text-[#B9BCC5]">|</span>
          
          <button 
            onClick={handleGoToMail}
            className="flex items-center text-sm text-[#4B5EF5] hover:underline"
          >
            <img src="/arrow-down.svg" alt={t('auth.emailVerification.goToMail')} className="w-4 h-4 mr-2" />
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
      </Layout>
      
      {/* 帮助弹窗 */}
      {showHelpModal && (
        <VerifyHelpModal
          onClose={handleCloseHelpModal}
          onContactSupport={handleContactSupport}
          onResendCode={handleResend}
          canResend={canResend}
          resendTimer={resendTimer}
          formatTimer={formatTimer}
        />
      )}
    </>
  );
};

export default EmailVerification;