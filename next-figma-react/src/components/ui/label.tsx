// Label组件 - 支持国际化
import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { useI18n } from '@/hooks/useI18n'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  // 国际化相关属性
  i18nKey?: string
  i18nParams?: Record<string, any>
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, children, i18nKey, i18nParams, ...props }, ref) => {
  const { t } = useI18n()
  
  // 如果提供了i18nKey，使用翻译后的内容
  const content = i18nKey ? t(i18nKey, i18nParams) : children
  
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    >
      {content}
    </LabelPrimitive.Root>
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }