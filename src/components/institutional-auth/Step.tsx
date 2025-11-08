import React from 'react';
import { useTranslation } from 'react-i18next';

// 步骤数据接口定义
export interface StepData {
  id: number;
  title: string;
  description: string;
  icon: string;
  buttonText: string;
}

// 组件Props接口定义
interface StepProps {
  steps: StepData[];
  currentStep: number;
}

/**
 * 步骤指示器组件
 * 用于显示多步骤流程的进度和状态
 */
const Step: React.FC<StepProps> = ({ steps, currentStep }) => {
  const { t } = useTranslation();
  
  return (
    <div className="institutional-auth-steps">
      <h3 className="steps-title transition-opacity duration-300 ease-in-out md:opacity-100 opacity-0">{t('institutionalAuth.process')}</h3>
      <div className="steps-container">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div 
              key={step.id} 
              className={`step-item flex transition-all duration-300 ease-in-out ${isActive ? 'active scale-105' : isCompleted ? 'completed' : ''}`}
            >
              <div className="step-number-container flex items-center">
                <div className={`step-number transition-all duration-300 ease-in-out ${isActive ? 'active bg-primary text-white' : isCompleted ? 'completed bg-success text-white' : 'bg-gray-200 text-gray-600'}`}>
                  <span className="transition-opacity duration-300 ease-in-out">
                    {isCompleted ? '✓' : step.id}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector h-1 transition-all duration-500 ease-in-out ${isCompleted ? 'completed bg-success' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="step-info transition-all duration-300 ease-in-out md:opacity-100 md:translate-x-4 opacity-0 md:block hidden">
                <span className={`step-title block transition-all duration-300 ease-in-out ${isActive ? 'active font-bold text-primary' : 'text-gray-700'}`}>
                  {step.title}
                </span>
                <span className="step-description text-gray-500 block transition-opacity duration-300 ease-in-out">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step;