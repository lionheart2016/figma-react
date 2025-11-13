import { NextResponse, type NextRequest } from 'next/server';
import { supportedLanguages, SupportedLanguage } from './src/config/i18n';

/**
 * 中间件用于国际化支持
 * 实现无路由前缀的国际化方案：检测浏览器语言设置并设置cookie
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查请求路径是否在白名单中
  const publicPaths = [
    '/favicon.ico',
    '/_next/',
    '/api/',
    '/images/',
    '/assets/'
  ];

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 检查是否已经有语言cookie
  const existingLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  // 如果没有设置语言cookie，检测浏览器语言并设置
  if (!existingLocale) {
    const acceptLanguage = request.headers.get('accept-language') || '';
    const detectedLanguage = detectLanguage(acceptLanguage);
    
    // 设置语言cookie
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', detectedLanguage, {
      httpOnly: false, // 允许客户端访问
      maxAge: 60 * 60 * 24 * 365, // 1年过期
      path: '/'
    });
    
    return response;
  }

  return NextResponse.next();
}

/**
 * 从 Accept-Language 头中检测语言
 */
function detectLanguage(acceptLanguage: string): SupportedLanguage {
  // 解析 Accept-Language 头
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [language, priority = '1'] = lang.trim().split(';q=');
      return {
        code: language.toLowerCase(),
        priority: parseFloat(priority) || 1
      };
    })
    .sort((a, b) => b.priority - a.priority);

  // 匹配支持的语言
  for (const { code } of languages) {
    // 处理语言代码变体
    if (supportedLanguages.includes(code as SupportedLanguage)) {
      return code as SupportedLanguage;
    }
    
    // 处理语言代码映射
    if (code.startsWith('en')) return 'en';
    if (code.startsWith('zh')) {
      // 根据地区代码确定中文变体
      if (code.includes('cn') || code.includes('ch')) return 'zh-CN';
      if (code.includes('tw') || code.includes('hk') || code.includes('mo')) return 'zh-TW';
      return 'zh-CN'; // 默认使用简体中文
    }
  }

  // 如果没有匹配到，返回默认语言
  return 'en';
}

export const config = {
  // 定义中间件应该匹配的路径
  matcher: [
    /*
     * 匹配所有请求路径，除了以下路径:
     * - api (API routes)
     * - _next/static (静态文件)
     * - _next/image (图像优化)
     * - favicon.ico (favicon 文件)
     * - 所有以 . 结尾的路径
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'
  ]
};