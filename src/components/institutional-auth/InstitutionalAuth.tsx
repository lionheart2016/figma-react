import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';
import Layout from '../auth-module/Layout';
import { useTheme } from '../../contexts/ThemeContext';
import InstitutionInfoForm from './InstitutionInfoForm';
import AddressInfoForm from './AddressInfoForm';
import FileUploadForm from './FileUploadForm';
import KeyPartiesForm from './KeyPartiesForm';
import CompletionPage from './CompletionPage';

// 定义步骤接口
interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  buttonText: string;
}

const InstitutionalAuth: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const steps: Step[] = [
    {
      id: 1,
      title: t('institutionalAuth.steps.institutionInfo.title'),
      description: t('institutionalAuth.steps.institutionInfo.description'),
      icon: '/institution-icon.svg',
      buttonText: t('institutionalAuth.continue')
    },
    {
      id: 2,
      title: t('institutionalAuth.steps.addressInfo.title'),
      description: t('institutionalAuth.steps.addressInfo.description'),
      icon: '/address-icon.svg',
      buttonText: t('institutionalAuth.continue')
    },
    {
      id: 3,
      title: t('institutionalAuth.steps.fileUpload.title'),
      description: t('institutionalAuth.steps.fileUpload.description'),
      icon: '/upload-icon.svg',
      buttonText: t('institutionalAuth.continue')
    },
    {
      id: 4,
      title: t('institutionalAuth.steps.keyParty.title'),
      description: t('institutionalAuth.steps.keyParty.description'),
      icon: '/key-party-icon.svg',
      buttonText: t('institutionalAuth.continue')
    },
    {
      id: 5,
      title: t('institutionalAuth.steps.completion.title'),
      description: t('institutionalAuth.steps.completion.description'),
      icon: '/completion-icon.svg',
      buttonText: t('institutionalAuth.submit')
    }
  ];

  const currentStepData: Step | undefined = steps.find(step => step.id === currentStep);

  const handleNextStep = async (): Promise<void> => {
    if (currentStep < steps.length) {
      setIsLoading(true);
      
      // 模拟处理时间
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsLoading(false);
      }, 500);
    } else {
      // 最后一步提交
      try {
        setIsLoading(true);
        
        // 模拟提交过程
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 提交成功后导航到完成页面
        navigate(ROUTES.DASHBOARD);
      } catch (error) {
        console.error(t('institutionalAuth.submissionFailed'), error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(ROUTES.EMAIL_VERIFICATION);
    }
  };

  // 渲染当前步骤的内容
  const renderStepContent = (): JSX.Element | null => {
    switch (currentStep) {
      case 1:
        return <InstitutionInfoForm />;
      case 2:
        return <AddressInfoForm />;
      case 3:
        return <FileUploadForm />;
      case 4:
        return <KeyPartiesForm />;
      case 5:
        return <CompletionPage />;
      default:
        return null;
    }
  };

  return (
    <Layout
      showBackButton={true}
      onBack={handleBack}
      title={currentStepData?.title}
      subtitle={currentStepData?.description}
    >
      <div className="institutional-auth">
        {/* 步骤指示器 */}
        <div className="step-indicator">
          {steps.map((step, index) => (
            <div key={step.id} className="step-item">
              <div className={`step-number ${currentStep >= step.id ? 'active' : ''}`}>
                {step.id}
              </div>
              <div className="step-info">
                <span className="step-title">{step.title}</span>
                <span className="step-description">{step.description}</span>
              </div>
              {index < steps.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>

        {/* 步骤内容 */}
        <div className="step-content">
          {renderStepContent()}
        </div>

        {/* 导航按钮 */}
        <div className="step-actions">
          <button
            type="button"
            className="back-button"
            onClick={handleBack}
            disabled={isLoading}
          >
            {t('institutionalAuth.back')}
          </button>
          <button
            type="button"
            className="next-button"
            onClick={handleNextStep}
            disabled={isLoading}
          >
            {isLoading ? t('institutionalAuth.loading') : currentStepData?.buttonText}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default InstitutionalAuth;