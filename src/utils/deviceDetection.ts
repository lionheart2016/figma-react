// 设备检测工具
export const isMobile = (): boolean => {
  // 检测移动设备
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  // 检测屏幕宽度
  const isSmallScreen = window.innerWidth <= 768;
  
  return isMobileDevice || isSmallScreen;
};

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isTabletDevice = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  
  // 检测屏幕宽度范围
  const isTabletScreen = window.innerWidth > 768 && window.innerWidth <= 1024;
  
  return isTabletDevice || isTabletScreen;
};

export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  return !isMobile() && !isTablet();
};