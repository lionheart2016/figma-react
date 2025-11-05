import React, { useEffect, useRef } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

interface AutoButtonTrackerProps {
  children: React.ReactNode;
  componentName?: string;
}

/**
 * 自动按钮追踪组件
 * 自动追踪容器内所有按钮的点击事件
 */
export const AutoButtonTracker: React.FC<AutoButtonTrackerProps> = ({
  children,
  componentName = 'unknown'
}) => {
  const { trackButtonClick } = useAnalytics();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 获取所有按钮元素
    const buttons = container.querySelectorAll('button, [role="button"], .btn, .button, [data-track="true"]');
    
    const handleButtonClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const buttonElement = target.closest('button, [role="button"], .btn, .button, [data-track="true"]');
      
      if (buttonElement) {
        // 获取按钮标识
        const buttonText = buttonElement.textContent?.trim() || '';
        const buttonId = buttonElement.id || '';
        const buttonClass = buttonElement.className || '';
        const dataTrackId = buttonElement.getAttribute('data-track-id') || '';
        
        // 确定按钮名称
        let buttonName = dataTrackId || buttonId || buttonText || 'unnamed_button';
        
        // 如果按钮名称过长，截断
        if (buttonName.length > 50) {
          buttonName = buttonName.substring(0, 47) + '...';
        }
        
        // 记录按钮点击
        trackButtonClick(buttonName, {
          component_name: componentName,
          button_id: buttonId,
          button_text: buttonText,
          button_classes: buttonClass,
          timestamp: new Date().toISOString(),
          element_type: buttonElement.tagName.toLowerCase()
        });
      }
    };

    // 为每个按钮添加点击监听器
    buttons.forEach(button => {
      button.addEventListener('click', handleButtonClick);
    });

    // 清理函数
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleButtonClick);
      });
    };
  }, [trackButtonClick, componentName]);

  return (
    <div ref={containerRef} data-auto-tracker={componentName}>
      {children}
    </div>
  );
};

export default AutoButtonTracker;