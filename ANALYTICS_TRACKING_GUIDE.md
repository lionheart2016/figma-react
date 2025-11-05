# 用户行为追踪使用指南

## 概述

本指南介绍如何在应用程序中实现页面浏览记录和按钮点击记录功能。系统支持自动追踪和手动追踪两种方式。

## 已实现的功能

### 1. 页面浏览记录
- **自动追踪**: 所有页面都已集成自动页面浏览追踪
- **记录信息**: 页面名称、URL路径、访问时间、用户上下文信息
- **用户属性**: 自动设置用户ID、用户类型、钱包连接状态等

### 2. 按钮点击记录
- **自动追踪**: 页面内所有按钮自动追踪点击事件
- **记录信息**: 按钮名称、所在页面、点击时间、用户上下文
- **支持元素**: 标准按钮、具有button角色的元素、CSS类为btn/button的元素

## 使用方法

### 自动追踪（推荐）

#### 页面浏览追踪
所有路由页面已自动集成页面浏览追踪，无需额外配置。

#### 按钮点击追踪
使用 `AutoButtonTracker` 组件包装需要追踪的区域：

```tsx
import { AutoButtonTracker } from './components/global/AutoButtonTracker';

function MyComponent() {
  return (
    <AutoButtonTracker componentName="我的组件">
      <button>点击我</button>
      <div role="button">可点击的div</div>
      <a className="btn">按钮样式链接</a>
    </AutoButtonTracker>
  );
}
```

### 手动追踪

#### 使用 useAnalytics Hook

```tsx
import { useAnalytics } from './hooks/useAnalytics';

function MyComponent() {
  const { 
    trackButtonClick, 
    trackPageView, 
    trackFormSubmit,
    trackNavigation 
  } = useAnalytics();

  const handleButtonClick = () => {
    trackButtonClick('特殊按钮', {
      custom_param: '自定义值',
      button_type: 'primary'
    });
  };

  return (
    <button onClick={handleButtonClick}>
      手动追踪按钮
    </button>
  );
}
```

#### 追踪表单提交

```tsx
const { trackFormSubmit } = useAnalytics();

const handleSubmit = async (formData) => {
  try {
    await submitForm(formData);
    trackFormSubmit('用户注册', true);
  } catch (error) {
    trackFormSubmit('用户注册', false, error.message);
  }
};
```

#### 追踪导航

```tsx
const { navigateWithTracking } = useAnalytics();

const handleNavigation = () => {
  navigateWithTracking('/dashboard');
};
```

## 数据记录内容

### 页面浏览记录
- `page_name`: 页面名称
- `page_path`: 页面路径
- `timestamp`: 访问时间戳
- `user_agent`: 用户浏览器信息
- `screen_resolution`: 屏幕分辨率
- `language`: 用户语言设置
- `referrer`: 来源页面

### 按钮点击记录
- `button_name`: 按钮标识
- `page`: 所在页面
- `button_text`: 按钮文本内容
- `button_id`: 按钮ID（如有）
- `button_classes`: 按钮CSS类
- `element_type`: 元素类型
- `timestamp`: 点击时间戳

## 自定义追踪

### 添加自定义追踪参数

```tsx
trackButtonClick('钱包连接', {
  wallet_type: 'metamask',
  network: 'ethereum',
  connection_time: Date.now(),
  user_tier: 'premium'
});
```

### 使用数据追踪属性

在HTML元素上使用 `data-track-id` 属性来自定义按钮标识：

```html
<button data-track-id="special-action-button">
  特殊操作
</button>
```

## 最佳实践

### 1. 按钮命名规范
- 使用有意义的按钮名称
- 避免使用通用名称如"按钮"、"点击"
- 保持名称简洁但具有描述性

### 2. 追踪粒度控制
- 重要操作使用手动追踪
- 常规交互使用自动追踪
- 避免过度追踪影响性能

### 3. 数据隐私
- 不要追踪敏感个人信息
- 遵循数据保护法规
- 提供用户选择退出机制

## 故障排除

### 常见问题

1. **追踪数据未显示**
   - 检查Firebase配置是否正确
   - 确认网络连接正常
   - 查看浏览器控制台错误信息

2. **按钮点击未记录**
   - 确认按钮在AutoButtonTracker组件内
   - 检查按钮是否被其他事件阻止
   - 验证按钮选择器是否正确

3. **页面浏览重复记录**
   - 检查路由配置是否正确
   - 确认PageTracker组件使用正确

### 调试模式

在开发环境中，追踪事件会在控制台输出日志：

```
[PageTracker] 页面浏览记录: 交易页面 (/trade)
[AutoButtonTracker] 按钮点击记录: 买入按钮
```

## 相关文件

- `src/hooks/useAnalytics.tsx` - 分析Hook
- `src/services/analyticsService.ts` - 分析服务
- `src/components/global/PageTracker.tsx` - 页面追踪组件
- `src/components/global/AutoButtonTracker.tsx` - 按钮追踪组件
- `src/config/firebase.ts` - Firebase配置

## 扩展功能

如需添加新的追踪类型，请在 `analyticsService.ts` 中添加相应方法，并在 `useAnalytics.tsx` 中导出。