import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';
import InstitutionInfoForm, { InstitutionInfoFormData } from './InstitutionInfoForm';
import AddressInfoForm from './AddressInfoForm';
import Layout from './layout';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserState, AUTH_STATUS } from '../../services/UserStateService';
import './institutional-auth.css';

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<InstitutionInfoFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 添加表单提交状态
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const userState = useUserState();

  // 根据URL路径确定当前步骤
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/step1')) {
      setCurrentStep(1);
    } else if (path.includes('/step2')) {
      setCurrentStep(2);
    } else if (path.includes('/step3')) {
      setCurrentStep(3);
    } else if (path.includes('/step4')) {
      setCurrentStep(4);
    } else if (path.includes('/step5')) {
      setCurrentStep(5);
    } else if (path === ROUTES.INSTITUTIONAL_AUTH) {
      // 默认显示第一步
      setCurrentStep(1);
    }
  }, [location.pathname]);

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

  const handleInstitutionInfoSubmit = async (data: InstitutionInfoFormData) => {
      console.log('表单提交成功，数据:', data);
      
      // Save the form data
      setFormData(data);
      
      setIsSubmitting(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Move to the next step
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        
        // Update URL without refreshing page
        let nextRoute: string;
        switch (nextStep) {
          case 2:
            nextRoute = ROUTES.INSTITUTIONAL_AUTH_STEP2;
            break;
          default:
            nextRoute = ROUTES.INSTITUTIONAL_AUTH;
        }
        
        navigate(nextRoute, { replace: true });
      } catch (error) {
        setSubmitError(t('common.errorSubmitting'));
        console.error('Error submitting institution info:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

  const handleNextStep = async (): Promise<void> => {
      if (currentStep < steps.length) {
      setIsLoading(true);
      
      // 模拟处理时间
      setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        
        // 更新URL而不刷新页面
        let nextRoute: string;
        switch (nextStep) {
          case 1:
            nextRoute = ROUTES.INSTITUTIONAL_AUTH_STEP1;
            break;
          case 2:
            nextRoute = ROUTES.INSTITUTIONAL_AUTH_STEP2;
            break;
          case 3:
            nextRoute = ROUTES.INSTITUTIONAL_AUTH_STEP3;
            break;
          case 4:
            nextRoute = ROUTES.INSTITUTIONAL_AUTH_STEP4;
            break;
          case 5:
            nextRoute = ROUTES.INSTITUTIONAL_AUTH_STEP5;
            break;
          default:
            nextRoute = ROUTES.INSTITUTIONAL_AUTH;
        }
        
        navigate(nextRoute, { replace: true });
        setIsLoading(false);
      }, 500);
    } else {
      // 最后一步，调用handleComplete处理完成认证流程
      handleComplete();
    }
  };

  const handleBack = (): void => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // 更新URL而不刷新页面
      let prevRoute: string;
      switch (prevStep) {
        case 1:
          prevRoute = ROUTES.INSTITUTIONAL_AUTH_STEP1;
          break;
        case 2:
          prevRoute = ROUTES.INSTITUTIONAL_AUTH_STEP2;
          break;
        case 3:
          prevRoute = ROUTES.INSTITUTIONAL_AUTH_STEP3;
          break;
        case 4:
          prevRoute = ROUTES.INSTITUTIONAL_AUTH_STEP4;
          break;
        default:
          prevRoute = ROUTES.INSTITUTIONAL_AUTH;
      }
      
      navigate(prevRoute, { replace: true });
    } else {
      navigate(ROUTES.EMAIL_VERIFICATION);
    }
  };

  // 处理完成认证
  const handleComplete = async (): Promise<void> => {
    setIsLoading(true);
    setSubmitError(null);
    
    try {
      // 记录认证完成事件
      console.log('[机构认证] 开始处理认证完成流程');
      
      // 更新认证状态为已认证
      await userState.updateAuthStatus(AUTH_STATUS.AUTHENTICATED);
      
      // 在实际项目中，这里应该调用API提交所有表单数据
      console.log('[机构认证] 提交所有认证数据');
      
      // 模拟提交过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('[机构认证] 认证流程完成，准备跳转到仪表盘');
      
      // 提交成功后导航到仪表盘
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `认证失败: ${error.message}` 
        : '认证失败，请稍后重试';
      
      console.error('[机构认证] 认证过程中发生错误:', error);
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 渲染当前步骤的内容
  const renderStepContent = (): JSX.Element | null => {
    switch (currentStep) {
      case 1:
        return <InstitutionInfoForm onSubmit={handleInstitutionInfoSubmit} />;
      case 2:
        return <AddressInfoForm />;
      case 3:
        return <FileUploadForm />;
      case 4:
        return <KeyPartiesForm />;
      case 5:
        return <CompletionPage onComplete={handleComplete} />;
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
      steps={steps}
      currentStep={currentStep}
    >
      <div className="institutional-auth">
        {/* 步骤内容 */}
        <div className="step-content">
          {renderStepContent()}
        </div>

        {/* 导航按钮 */}
        <div className="step-actions">
          {submitError && (
            <div className="error-message">
              {submitError}
            </div>
          )}
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
            onClick={() => {
              if (currentStep === 1) {
                // 查找并触发表单提交
                const formElement = document.querySelector('form');
                if (formElement) {
                  formElement.dispatchEvent(new Event('submit', { 
                    bubbles: true, 
                    cancelable: true 
                  }));
                }
              } else {
                handleNextStep();
              }
            }}
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