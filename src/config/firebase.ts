import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserProperties, setUserId } from 'firebase/analytics';

// Firebase 配置
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// 检查是否配置了必要的 Firebase 配置
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId;

let app: any = null;
let analytics: any = null;

// 仅在客户端且有有效配置时初始化 Firebase
if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    console.log('[Firebase] Firebase Analytics 初始化成功');
  } catch (error) {
    console.warn('[Firebase] Firebase 初始化失败:', error);
    app = null;
    analytics = null;
  }
} else {
  console.warn('[Firebase] Firebase 配置不完整，跳过初始化');
}

// 分析服务类
export class AnalyticsService {
  // 检查是否启用了 Firebase Analytics
  private static isAnalyticsEnabled(): boolean {
    return !!analytics;
  }

  // 记录页面浏览
  static logPageView(pageName: string, pagePath: string) {
    if (!this.isAnalyticsEnabled()) {
      console.log('[Analytics] 页面浏览:', pageName, pagePath);
      return;
    }
    
    try {
      logEvent(analytics, 'page_view', {
        page_title: pageName,
        page_location: pagePath,
        page_path: pagePath
      });
    } catch (error) {
      console.warn('[Analytics] 页面浏览记录失败:', error);
    }
  }

  // 记录自定义事件
  static logEvent(eventName: string, parameters?: Record<string, any>) {
    if (!this.isAnalyticsEnabled()) {
      console.log('[Analytics] 事件:', eventName, parameters);
      return;
    }
    
    try {
      logEvent(analytics, eventName, parameters);
    } catch (error) {
      console.warn('[Analytics] 事件记录失败:', error);
    }
  }

  // 设置用户 ID
  static setUserId(userId: string) {
    if (!this.isAnalyticsEnabled()) {
      console.log('[Analytics] 设置用户ID:', userId);
      return;
    }
    
    try {
      setUserId(analytics, userId);
    } catch (error) {
      console.warn('[Analytics] 设置用户ID失败:', error);
    }
  }

  // 设置用户属性
  static setUserProperties(properties: Record<string, any>) {
    if (!this.isAnalyticsEnabled()) {
      console.log('[Analytics] 设置用户属性:', properties);
      return;
    }
    
    try {
      setUserProperties(analytics, properties);
    } catch (error) {
      console.warn('[Analytics] 设置用户属性失败:', error);
    }
  }

  // 记录错误
  static logError(error: Error, context?: Record<string, any>) {
    if (!this.isAnalyticsEnabled()) {
      console.error('[Analytics] 错误:', error.message, context);
      return;
    }
    
    try {
      logEvent(analytics, 'error', {
        error_message: error.message,
        error_stack: error.stack,
        ...context
      });
    } catch (firebaseError) {
      console.error('[Analytics] 错误记录失败:', firebaseError);
    }
  }

  // 记录用户交互
  static logUserInteraction(interactionType: string, element: string, value?: string) {
    if (!this.isAnalyticsEnabled()) {
      console.log('[Analytics] 用户交互:', interactionType, element, value);
      return;
    }
    
    try {
      logEvent(analytics, 'user_interaction', {
        interaction_type: interactionType,
        element: element,
        value: value || ''
      });
    } catch (error) {
      console.warn('[Analytics] 用户交互记录失败:', error);
    }
  }
}

export { analytics };
export default app;