# Firebase Analytics 用户行为数据收集指南

## 概述

本项目已集成 Firebase Analytics，可以收集和分析用户行为数据。Firebase Analytics 是 Google 提供的免费应用分析解决方案，支持实时数据追踪、用户行为分析和转化跟踪。

## 已实现的功能

### 1. 基础配置
- ✅ Firebase SDK 集成
- ✅ Analytics 服务初始化
- ✅ 环境变量配置
- ✅ TypeScript 类型支持

### 2. 预定义事件类型
项目已预定义了多种事件类型：

```typescript
export enum AnalyticsEvents {
  // 页面浏览
  PAGE_VIEW = 'page_view',
  
  // 用户交互
  BUTTON_CLICK = 'button_click',
  LINK_CLICK = 'link_click',
  FORM_SUBMIT = 'form_submit',
  
  // 钱包相关
  WALLET_CONNECT = 'wallet_connect',
  WALLET_DISCONNECT = 'wallet_disconnect',
  TRANSACTION_START = 'transaction_start',
  TRANSACTION_COMPLETE = 'transaction_complete',
  TRANSACTION_FAILED = 'transaction_failed',
  
  // 认证相关
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  SIGNUP_SUCCESS = 'signup_success',
  SIGNUP_FAILED = 'signup_failed',
  
  // 应用功能
  SEARCH = 'search',
  FILTER_APPLY = 'filter_apply',
  SETTINGS_CHANGE = 'settings_change',
  
  // 错误和异常
  ERROR = 'error',
  WARNING = 'warning'
}
```

### 3. 核心服务模块

#### AnalyticsServiceWrapper
主要方法：
- `trackPageView()` - 页面浏览追踪
- `trackButtonClick()` - 按钮点击追踪
- `trackWalletConnect()` - 钱包连接追踪
- `trackTransaction()` - 交易追踪
- `trackAuthEvent()` - 认证事件追踪
- `trackSearch()` - 搜索行为追踪
- `trackError()` - 错误追踪
- `setUserProperties()` - 用户属性设置

#### useAnalytics Hook
React Hook 提供：
- 自动页面浏览追踪
- 便捷的交互追踪方法
- 增强的导航追踪

## 使用方法

### 1. 基本使用

```typescript
import { useAnalytics } from '../hooks/useAnalytics';

function MyComponent() {
  const { trackButtonClick, trackFormSubmit } = useAnalytics();
  
  const handleButtonClick = () => {
    trackButtonClick('购买按钮', { amount: 100, currency: 'USD' });
  };
  
  const handleFormSubmit = (success: boolean) => {
    trackFormSubmit('登录表单', success);
  };
  
  return <button onClick={handleButtonClick}>购买</button>;
}
```

### 2. 钱包连接追踪

```typescript
import { AnalyticsServiceWrapper } from '../services/analyticsService';

// 连接成功
AnalyticsServiceWrapper.trackWalletConnect('MetaMask', true);

// 连接失败
AnalyticsServiceWrapper.trackWalletConnect('MetaMask', false, '用户拒绝连接');
```

### 3. 交易追踪

```typescript
// 开始交易
AnalyticsServiceWrapper.trackTransaction('buy', 100, 'ETH', 'started');

// 交易完成
AnalyticsServiceWrapper.trackTransaction('buy', 100, 'ETH', 'completed');

// 交易失败
AnalyticsServiceWrapper.trackTransaction('buy', 100, 'ETH', 'failed', 'gas费不足');
```

### 4. 用户属性设置

```typescript
AnalyticsServiceWrapper.setUserProperties({
  userId: 'user123',
  userType: 'premium',
  walletConnected: true,
  language: 'zh-CN',
  country: 'CN'
});
```

## 配置步骤

### 1. 获取 Firebase 配置

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择或创建项目
3. 进入项目设置 → 常规 → 您的应用
4. 复制配置信息到 `.env` 文件

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入实际值：

```env
# Firebase 配置
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. 启用 Analytics

在 Firebase Console 中：
1. 进入 Analytics 页面
2. 开始使用 Analytics
3. 配置数据流（Web 应用）

## 数据查看和分析

### Firebase Console 功能

1. **实时数据**：查看当前活跃用户
2. **用户分析**：用户留存、活跃度、用户属性
3. **事件分析**：自定义事件统计和转化
4. **漏斗分析**：用户转化路径分析
5. **受众群体**：创建用户细分

### 关键指标

- **日活跃用户 (DAU)**
- **用户留存率**
- **平均会话时长**
- **转化率**
- **收入指标**

## 最佳实践

### 1. 事件命名规范
- 使用蛇形命名法：`button_click`、`wallet_connect`
- 保持一致性
- 避免敏感信息

### 2. 用户隐私
- 遵循 GDPR、CCPA 等法规
- 提供隐私政策
- 允许用户选择退出

### 3. 数据质量
- 测试事件追踪
- 监控数据异常
- 定期清理无效事件

## 故障排除

### 常见问题

1. **事件未显示**：检查网络连接和 Firebase 配置
2. **数据延迟**：Firebase 数据有 24-48 小时处理延迟
3. **用户计数异常**：检查用户 ID 设置

### 调试模式

在开发环境中，可以启用调试模式：

```typescript
// 在浏览器控制台查看事件
localStorage.setItem('firebaseDebug', 'true');
```

## 扩展功能

### 1. A/B 测试
集成 Firebase A/B Testing 进行功能测试

### 2. 预测分析
使用 Firebase Predictions 预测用户行为

### 3. 远程配置
动态调整应用配置而不需要发布新版本

## 相关文件

- `src/config/firebase.ts` - Firebase 配置
- `src/services/analyticsService.ts` - 分析服务
- `src/hooks/useAnalytics.tsx` - React Hook
- `.env.example` - 环境变量模板

## 下一步

1. 配置实际的 Firebase 项目
2. 在关键组件中集成分析追踪
3. 设置数据看板和报警
4. 优化追踪策略基于数据分析结果

---

**注意**：在生产环境使用前，请确保遵守相关隐私法规并获取用户同意。