import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';
import Layout from './Layout';

const EmailVerification = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // 获取用户邮箱
  const userEmail = localStorage.getItem('userEmail') || t('auth.emailVerification.yourEmail');

  // 倒计时逻辑
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // 处理输入变化
  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError('');

      // 自动聚焦到下一个输入框
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }

      // 如果所有输入框都有值，自动验证
      if (newCode.every(digit => digit !== '') && index === 5) {
        handleVerify();
      }
    }
  };

  // 处理键盘事件
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // 如果当前输入框为空且按下退格键，聚焦到前一个输入框
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // 处理粘贴事件
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const numbers = pasteData.replace(/\D/g, '').slice(0, 6);
    
    if (numbers.length === 6) {
      const newCode = numbers.split('');
      setCode(newCode);
      setError('');
      
      // 聚焦到最后一个输入框
      inputRefs.current[5].focus();
      
      // 自动验证
      setTimeout(() => {
        handleVerify();
      }, 100);
    }
  };

  // 验证验证码
  const handleVerify = async () => {
    const verificationCode = code.join('');
    
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

  // 重新发送验证码
  const handleResend = () => {
    if (!canResend) return;

    setTimer(60);
    setCanResend(false);
    setError('');
    
    // 模拟重新发送逻辑
    console.log('Resending verification code to:', userEmail);
  };

  // 返回上一页
  const handleBack = () => {
    navigate(ROUTES.REGISTER);
  };

  return (
    <Layout
      title={t('auth.emailVerification.title')}
      subtitle={t('auth.emailVerification.subtitle', { email: userEmail })}
      showBackButton={true}
      onBack={handleBack}
    >
      {/* 验证码输入区域 */}
      <div className="space-y-6">
        {/* 验证码输入框 */}
        <div className="flex justify-center space-x-3">
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
              className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5EF5] focus:border-transparent ${
                error ? 'border-red-500' : 'border-[#EDEEF3]'
              }`}
            />
          ))}
        </div>

        {/* 错误信息 */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* 验证按钮 */}
        <button
          onClick={handleVerify}
          disabled={isLoading || code.some(digit => digit === '')}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${
            isLoading || code.some(digit => digit === '')
              ? 'bg-[#D9D9D9] text-[#73798B] cursor-not-allowed'
              : 'bg-[#4B5EF5] text-white hover:bg-[#3A4BD4] active:bg-[#2A3AB3]'
          }`}
        >
          {isLoading ? t('auth.emailVerification.verifying') : t('auth.emailVerification.verify')}
        </button>

        {/* 重新发送验证码 */}
        <div className="text-center">
          <p className="text-sm text-[#73798B] mb-2">
            {t('auth.emailVerification.didntReceiveCode')}{' '}
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`font-medium ${
                canResend
                  ? 'text-[#4B5EF5] hover:underline cursor-pointer'
                  : 'text-[#B9BCC5] cursor-not-allowed'
              }`}
            >
              {canResend ? t('auth.emailVerification.resendCode') : t('auth.emailVerification.resendIn', { timer })}
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default EmailVerification;