// 路由配置常量
export const ROUTES = {
  // 认证相关路由
  AUTHENTICATION: '/authentication',
  INVESTMENT_SELECTION: '/investment-selection',
  REGISTER: '/register',
  REGISTER_NEW: '/register-new',
  EMAIL_VERIFICATION: '/email-verification',
  LOGIN: '/login',
  
  // 主应用路由
  DASHBOARD: '/dashboard',
  TRADE: '/trade',
  WALLETS: '/wallets',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  
  // 默认路由
  HOME: '/',
  NOT_FOUND: '/404'
} as const;

// 定义路由类型
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

// 定义路由元信息类型
export interface RouteMetaInfo {
  title: string;
  requiresAuth: boolean;
  [key: string]: any;
}

// 路由守卫配置
export const routeGuards = {
  // 需要认证的路由
  requiresAuth: [
    ROUTES.DASHBOARD,
    ROUTES.TRADE,
    ROUTES.WALLETS,
    ROUTES.REPORTS,
    ROUTES.SETTINGS
  ] as RoutePath[],
  
  // 公开路由（无需认证）
  publicRoutes: [
    ROUTES.AUTHENTICATION,
    ROUTES.INVESTMENT_SELECTION,
    ROUTES.REGISTER,
    ROUTES.EMAIL_VERIFICATION,
    ROUTES.HOME,
    ROUTES.LOGIN
  ] as RoutePath[]
};

// 路由元信息配置
export const routeMeta: Record<string, RouteMetaInfo> = {
  [ROUTES.AUTHENTICATION]: {
    title: 'Authentication - Alphatoken',
    requiresAuth: false
  },
  [ROUTES.INVESTMENT_SELECTION]: {
    title: 'Select Investment Type - Alphatoken',
    requiresAuth: false
  },
  [ROUTES.REGISTER]: {
    title: 'Register - Alphatoken',
    requiresAuth: false
  },
  [ROUTES.EMAIL_VERIFICATION]: {
    title: 'Email Verification - Alphatoken',
    requiresAuth: false
  },
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard - Alphatoken',
    requiresAuth: true
  },
  [ROUTES.TRADE]: {
    title: 'Trade - Alphatoken',
    requiresAuth: true
  },
  [ROUTES.WALLETS]: {
    title: 'Wallets - Alphatoken',
    requiresAuth: true
  },
  [ROUTES.REPORTS]: {
    title: 'Reports - Alphatoken',
    requiresAuth: true
  },
  [ROUTES.SETTINGS]: {
    title: 'Settings - Alphatoken',
    requiresAuth: true
  },
  [ROUTES.HOME]: {
    title: 'Alphatoken - Cryptocurrency Trading Platform',
    requiresAuth: false
  }
};