// 全局类型声明文件

// 扩展Node.js的Process环境变量类型
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_URL: string;
      DATABASE_URL?: string;
      NEXTAUTH_SECRET?: string;
      NEXTAUTH_URL?: string;
      EMAIL_SERVER_HOST?: string;
      EMAIL_SERVER_PORT?: string;
      EMAIL_SERVER_USER?: string;
      EMAIL_SERVER_PASSWORD?: string;
      EMAIL_FROM?: string;
    }
  }
}

// 扩展Window对象类型
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Next.js相关类型扩展
declare module 'next/font/google' {
  export interface FontOptions {
    display?: 'swap' | 'auto' | 'block' | 'fallback';
    preload?: boolean;
    style?: {
      fontFamily?: string;
      fontStyle?: 'normal' | 'italic';
      fontWeight?: number;
      fontDisplay?: 'swap' | 'auto' | 'block' | 'fallback';
    };
    subsets?: Array<'latin' | 'latin-ext'>;
    variable?: string;
    fallback?: string[];
  }
}

// 扩展React类型
declare global {
  namespace React {
    interface FunctionComponent<P = Record<string, unknown>> {
      (props: P & { children?: React.ReactNode }): React.ReactElement<P> | null;
    }

    interface ReactNode {
      [key: string]: unknown;
    }
  }
}

// 环境变量类型
export {}

export type Locale = 'en' | 'zh-Hans' | 'zh-Hant';

export interface NextIntlMessages {
  [key: string]: string | NextIntlMessages;
}