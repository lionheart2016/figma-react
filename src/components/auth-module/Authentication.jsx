import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';
import Layout from './Layout';
import { useAuth } from '../../contexts/AuthContext';

const Authentication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();

  const steps = [
    {
      id: 1,
      title: t('auth.authentication.uploadIdDocument'),
      description: t('auth.authentication.uploadIdDescription'),
      icon: '/upload-icon.svg',
      buttonText: t('auth.authentication.uploadButton')
    },
    {
      id: 2,
      title: t('auth.authentication.personalInformation'),
      description: t('auth.authentication.personalInformationDescription'),
      icon: '/profile-icon.svg',
      buttonText: t('auth.authentication.continue')
    },
    {
      id: 3,
      title: t('auth.authentication.livenessDetection'),
      description: t('auth.authentication.livenessDetectionDescription'),
      icon: '/face-icon.svg',
      buttonText: t('auth.authentication.startDetection')
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);

  const handleNextStep = async () => {
    if (currentStep < steps.length) {
      setIsLoading(true);
      
      // 模拟处理时间
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsLoading(false);
      }, 1000);
    } else {
      // 第三步（活体检测）完成后，触发Privy登录
      try {
        setIsLoading(true);
        // 自动通过活体检测并触发登录
        await login('email');
        // 登录成功后导航到主页面
        navigate(ROUTES.HOME);
      } catch (error) {
        console.error('Login failed:', error);
        // 如果登录失败，仍然导航到主页面（用于测试）
        navigate(ROUTES.HOME);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(ROUTES.EMAIL_VERIFICATION);
    }
  };

  // 渲染当前步骤的内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* 上传区域 */}
            <div className="border-2 border-dashed border-[#EDEEF3] rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-[#4B5EF5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src={currentStepData.icon} alt="Upload" className="w-8 h-8" />
              </div>
              <p className="text-[#73798B] text-sm mb-2">{t('auth.authentication.dragAndDrop')}</p>
              <p className="text-[#B9BCC5] text-xs">or</p>
              <button className="mt-2 text-[#4B5EF5] text-sm font-medium hover:underline">
                {t('auth.authentication.browseFiles')}
              </button>
            </div>
            
            {/* 要求说明 */}
            <div className="bg-[#F8FAFF] rounded-lg p-4">
              <h4 className="text-sm font-medium text-[#1C1C1C] mb-2">{t('auth.authentication.requirements')}</h4>
              <ul className="text-xs text-[#73798B] space-y-1">
                <li>• {t('auth.authentication.requirementClear')}</li>
                <li>• {t('auth.authentication.requirementCorners')}</li>
                <li>• {t('auth.authentication.requirementNoGlare')}</li>
                <li>• {t('auth.authentication.requirementFileSize')}</li>
              </ul>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t('auth.authentication.firstName')}</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-[#EDEEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5]"
                  placeholder={t('auth.authentication.firstName')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t('auth.authentication.lastName')}</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-[#EDEEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5]"
                  placeholder={t('auth.authentication.lastName')}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t('auth.authentication.dateOfBirth')}</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-[#EDEEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-2">{t('auth.authentication.nationality')}</label>
              <select className="w-full px-3 py-2 border border-[#EDEEF3] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EF5]">
                <option value="">{t('auth.authentication.selectNationality')}</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="cn">China</option>
                <option value="jp">Japan</option>
              </select>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            {/* 活体检测预览 */}
            <div className="bg-[#F8FAFF] rounded-lg p-8 text-center">
              <div className="w-32 h-32 bg-[#4B5EF5]/10 border-2 border-dashed border-[#4B5EF5] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-[#4B5EF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1C1C1C] mb-2">{t('auth.authentication.detectionComplete')}</h3>
              <p className="text-[#73798B] text-sm">{t('auth.authentication.detectionSuccess')}</p>
            </div>
            
            {/* 检测说明 */}
            <div className="bg-[#F8FAFF] rounded-lg p-4">
              <h4 className="text-sm font-medium text-[#1C1C1C] mb-2">{t('auth.authentication.nextStep')}</h4>
              <p className="text-xs text-[#73798B]">{t('auth.authentication.loginPrompt')}</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout
      title={currentStepData.title}
      subtitle={currentStepData.description}
      showBackButton={true}
      onBack={handleBack}
    >
      {/* 进度指示器 */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.id <= currentStep
                  ? 'bg-[#4B5EF5] text-white'
                  : 'bg-[#EDEEF3] text-[#73798B]'
              }`}>
                {step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 ${
                  step.id < currentStep ? 'bg-[#4B5EF5]' : 'bg-[#EDEEF3]'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 步骤内容 */}
      {renderStepContent()}

      {/* 下一步按钮 */}
      <button
        onClick={handleNextStep}
        disabled={isLoading}
        className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${
          isLoading
            ? 'bg-[#D9D9D9] text-[#73798B] cursor-not-allowed'
            : 'bg-[#4B5EF5] text-white hover:bg-[#3A4BD4] active:bg-[#2A3AB3]'
        }`}
      >
        {isLoading ? t('auth.authentication.processing') : currentStepData.buttonText}
      </button>
    </Layout>
  );
};

export default Authentication;