// Input组件 - 支持国际化
import * as React from 'react'

import { cn } from '@/lib/utils'
import { useI18n } from '@/hooks/useI18n'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // 国际化相关属性
  i18nPlaceholderKey?: string
  i18nPlaceholderParams?: Record<string, any>
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, placeholder, i18nPlaceholderKey, i18nPlaceholderParams, ...props }, ref) => {
    const { t } = useI18n()
    
    // 如果提供了i18nPlaceholderKey，使用翻译后的占位符
    const finalPlaceholder = i18nPlaceholderKey ? t(i18nPlaceholderKey, i18nPlaceholderParams) : placeholder
    
    return (
      <input
        type={type}
        placeholder={finalPlaceholder}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }