import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../services/UserStateService';
import { ROUTES } from '../../config/routes';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loginWithEmail, verifyEmail, isLoading, error } = useUser();
  const [email, setEmail] = useState('test-1143@example.com');
  const [verificationCode, setVerificationCode] = useState('894575');
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [, setEmailSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      await loginWithEmail(email);
      setEmailSubmitted(true);
      setStep('verification');
    } catch (err) {
      // 错误已在context中处理
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || !email) return;
    
    try {
      await verifyEmail(email, verificationCode);
      
      // 检查是否为机构用户，如果是则自动触发机构认证流程
      const isInstitutionalUser = localStorage.getItem('institutionalAuthTriggered');
      if (isInstitutionalUser === 'true') {
        const userId = localStorage.getItem('institutionalAuthUserId') || 'unknown';
        const timestamp = localStorage.getItem('institutionalAuthTimestamp') || new Date().toISOString();
        
        console.log(`🔍 [登录流程] ${timestamp} - 检测到机构用户 ${userId}，自动导航至机构认证页面`);
        navigate(ROUTES.INSTITUTIONAL_AUTH);
      } else {
        console.log('🔍 [登录流程] - 普通用户登录成功，导航至交易页面');
        navigate(ROUTES.TRADE);
      }
    } catch (err) {
      // 错误已在context中处理
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">{t('login.title')}</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                {t('login.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? t('sending') : t('sendCode')}
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>{t('testAccount')}: test-1143@example.com</p>
              <p>{t('testCode')}: 894575</p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerificationSubmit}>
            <div className="mb-4">
              <label htmlFor="verification-code" className="block text-sm font-medium mb-1">
                {t('login.verificationCode')}
              </label>
              <input
                type="text"
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-2 border rounded"
                required
                maxLength={6}
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? t('loggingIn') : t('login.login')}
            </button>
            
            <button 
              type="button" 
              onClick={() => {
                setStep('email');
                setVerificationCode('');
                setEmailSubmitted(false);
              }}
              className="w-full mt-2 text-blue-500"
            >
              {t('changeEmail')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;