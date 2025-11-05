import { AnalyticsService } from '../config/firebase';

// 预定义事件类型
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

// 分析服务类
export class AnalyticsServiceWrapper {
  // 记录页面浏览
  static trackPageView(pageName: string, pagePath: string, additionalParams?: Record<string, any>) {
    AnalyticsService.logPageView(pageName, pagePath);
    
    // 同时记录自定义事件
    AnalyticsService.logEvent(AnalyticsEvents.PAGE_VIEW, {
      page_name: pageName,
      page_path: pagePath,
      timestamp: new Date().toISOString(),
      ...additionalParams
    });
  }

  // 记录按钮点击
  static trackButtonClick(buttonName: string, page: string, additionalParams?: Record<string, any>) {
    AnalyticsService.logEvent(AnalyticsEvents.BUTTON_CLICK, {
      button_name: buttonName,
      page: page,
      ...additionalParams
    });
  }

  // 记录钱包连接
  static trackWalletConnect(walletType: string, success: boolean, errorMessage?: string) {
    AnalyticsService.logEvent(
      success ? AnalyticsEvents.WALLET_CONNECT : AnalyticsEvents.WALLET_DISCONNECT,
      {
        wallet_type: walletType,
        success: success,
        error_message: errorMessage || '',
        timestamp: new Date().toISOString()
      }
    );
  }

  // 记录交易
  static trackTransaction(
    transactionType: string,
    amount: number,
    currency: string,
    status: 'started' | 'completed' | 'failed',
    errorMessage?: string
  ) {
    const event = status === 'started' 
      ? AnalyticsEvents.TRANSACTION_START
      : status === 'completed' 
        ? AnalyticsEvents.TRANSACTION_COMPLETE
        : AnalyticsEvents.TRANSACTION_FAILED;

    AnalyticsService.logEvent(event, {
      transaction_type: transactionType,
      amount: amount,
      currency: currency,
      status: status,
      error_message: errorMessage || '',
      timestamp: new Date().toISOString()
    });
  }

  // 记录认证事件
  static trackAuthEvent(
    eventType: 'login' | 'signup',
    success: boolean,
    method: string,
    errorMessage?: string
  ) {
    const event = success 
      ? (eventType === 'login' ? AnalyticsEvents.LOGIN_SUCCESS : AnalyticsEvents.SIGNUP_SUCCESS)
      : (eventType === 'login' ? AnalyticsEvents.LOGIN_FAILED : AnalyticsEvents.SIGNUP_FAILED);

    AnalyticsService.logEvent(event, {
      auth_method: method,
      success: success,
      error_message: errorMessage || '',
      timestamp: new Date().toISOString()
    });
  }

  // 记录搜索
  static trackSearch(query: string, resultsCount?: number, filters?: Record<string, any>) {
    AnalyticsService.logEvent(AnalyticsEvents.SEARCH, {
      search_query: query,
      results_count: resultsCount || 0,
      filters: filters || {},
      timestamp: new Date().toISOString()
    });
  }

  // 记录错误
  static trackError(error: Error, context?: Record<string, any>) {
    AnalyticsService.logError(error, context);
    
    AnalyticsService.logEvent(AnalyticsEvents.ERROR, {
      error_message: error.message,
      error_stack: error.stack,
      context: context || {},
      timestamp: new Date().toISOString()
    });
  }

  // 设置用户属性
  static setUserProperties(userData: {
    userId?: string;
    userType?: string;
    walletConnected?: boolean;
    language?: string;
    country?: string;
  }) {
    if (userData.userId) {
      AnalyticsService.setUserId(userData.userId);
    }

    AnalyticsService.setUserProperties({
      user_type: userData.userType || 'anonymous',
      wallet_connected: userData.walletConnected || false,
      language: userData.language || 'en',
      country: userData.country || '',
      ...userData
    });
  }

  // 记录用户偏好设置
  static trackSettingsChange(settingType: string, oldValue: any, newValue: any) {
    AnalyticsService.logEvent(AnalyticsEvents.SETTINGS_CHANGE, {
      setting_type: settingType,
      old_value: oldValue,
      new_value: newValue,
      timestamp: new Date().toISOString()
    });
  }

  // 记录性能指标
  static trackPerformance(metricName: string, value: number, unit: string = 'ms') {
    AnalyticsService.logEvent('performance_metric', {
      metric_name: metricName,
      value: value,
      unit: unit,
      timestamp: new Date().toISOString()
    });
  }
}

// 导出默认实例
export default AnalyticsServiceWrapper;