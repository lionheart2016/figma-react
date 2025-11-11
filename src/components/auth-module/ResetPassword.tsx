import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes';
import LanguageSwitcher from '../global/LanguageSwitcher';
import ThemeSwitcher from '../global/ThemeSwitcher';
import EmailInput from './EmailInput';
import VerificationCodeInput from './VerificationCodeInput';


const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleBack = () => {
    navigate(-1); // 返回上一页
  };

  const [canResend, setCanResend] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(0);

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
      setEmailError(t('auth.resetPassword.sendCodeFailed'));
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
      navigate(ROUTES.RESET_PASSWORD_COMPLETE);
    } catch (error) {
      console.error('重置密码失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* 背景装饰 - 左侧品牌图案 */}
      <div 
        className="w-[475px] h-[8
        00px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/src/assets/brand-delivery-bg-7ad6a7.png')"
        }}
      />
      
      <div className="relative z-10 w-full max-w-[1440px] h-[900px] flex items-center justify-center">
        {/* 语言和主题切换器 */}
        <div className="absolute top-10 right-40 flex items-center space-x-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        {/* 返回按钮 */}
        <div 
          className="absolute top-8 left-8 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleBack}
        >
          <div className="w-8 h-8 flex items-center justify-center bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20">
            <img src="/src/assets/back-arrow.svg" alt="back" className="w-4 h-4" />
          </div>
          <span className="ml-3 text-base font-medium text-white font-poppins">
            {t('common.back')}
          </span>
        </div>

        {/* 主内容区域 */}
        <div className="flex flex-col items-center">
          {/* 页面标题 */}
          <h1 className="text-[36px] font-semibold text-white font-poppins mb-6 text-center"
              style={{ width: '388px', height: '44px', marginTop: '230px' }}>
            {t('auth.resetPassword.title')}
          </h1>
          
          {/* 表单区域 */}
          <div className="space-y-8">
            {/* 邮箱输入 */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-[14px] font-normal text-white font-poppins">
                {t('auth.resetPassword.emailLabel')}
              </label>
              <EmailInput
                value={email}
                onChange={setEmail}
                error={emailError}
                validateOnChange={true}
                validateOnBlur={true}
                onValidationChange={setEmailValid}
              />
            </div>

            {/* 验证码输入 */}
            <VerificationCodeInput
              value={verificationCode}
              onChange={setVerificationCode}
              onResend={handleSendVerificationCode}
              disabled={!emailValid}
              placeholder={t('auth.resetPassword.verificationCodePlaceholder')}
            />

            {/* 提交按钮 */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || !emailValid || !verificationCode}
              className={`w-[390px] h-[40px] text-white text-[14px] font-semibold font-poppins rounded-[6px] transition-all duration-200 flex items-center justify-center ${
                emailValid && verificationCode && !isLoading
                  ? 'bg-[#4B5EF5] hover:bg-[#3D4FD0] cursor-pointer'
                  : 'bg-[#73798B] cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                t('auth.resetPassword.continueButton')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;