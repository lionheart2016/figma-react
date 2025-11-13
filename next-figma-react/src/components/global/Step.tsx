import React from 'react';
import { useTranslation } from 'react-i18next';
import { StepData } from '@/types/institutional-auth';

// 组件Props接口定义
interface StepProps {
  steps: StepData[];
  currentStep: string;
}

/**
 * 步骤指示器组件
 * 用于显示多步骤流程的进度和状态
 */
const Step: React.FC<StepProps> = ({ steps, currentStep }) => {
  const { t } = useTranslation();
  
  // 检查steps是否为undefined或空数组
  if (!steps || steps.length === 0) {
    return <div className="institutional-auth-steps">No steps available</div>;
  }
  
  // 将字符串ID转换为数字用于比较
  const currentStepId = steps.findIndex(step => step.id === currentStep) + 1;
  
  return (
    <div className="institutional-auth-steps">
      <h3 className="steps-title transition-opacity duration-300 ease-in-out md:opacity-100 opacity-0">{t('institutionalAuth.process')}</h3>
      <div className="steps-container">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = step.id === currentStep;
          const isCompleted = currentStepId > stepNumber;
          
          return (
            <div 
              key={step.id} 
              className={`step-item flex transition-all duration-300 ease-in-out ${isActive ? 'active scale-105' : isCompleted ? 'completed' : ''}`}
            >
              <div className="step-number-container flex items-center">
                <div className={`step-number transition-all duration-300 ease-in-out ${isActive ? 'active bg-primary text-white' : isCompleted ? 'completed bg-success text-white' : 'bg-gray-200 text-gray-600'}`}>
                  <span className="transition-opacity duration-300 ease-in-out">
                    {isCompleted ? '✓' : stepNumber}
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
                  {step.status === 'current' ? '当前步骤' : step.status === 'completed' ? '已完成' : '待完成'}
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