import { describe, it, expect, beforeEach, vi } from 'vitest';

// 保存原始的document和console对象
const originalDocument = global.document;
const originalConsole = global.console;

describe('main.jsx', () => {
  let mockCreateRoot;
  let mockRender;
  let mockInitI18n;
  
  beforeEach(() => {
    // 重置所有模块缓存
    vi.resetModules();
    
    // 创建mock函数
    mockRender = vi.fn();
    mockCreateRoot = vi.fn(() => ({ render: mockRender }));
    mockInitI18n = vi.fn();
    
    // Mock document
    global.document = {
      ...originalDocument,
      getElementById: vi.fn().mockReturnValue({ id: 'root' })
    };
    
    // Mock console
    global.console = {
      ...originalConsole,
      error: vi.fn()
    };
    
    // Mock ReactDOM client
    vi.doMock('react-dom/client', () => ({
      default: {
        createRoot: mockCreateRoot
      }
    }));
    
    // Mock i18n
    vi.doMock('../config/i18n', () => ({
      initI18n: mockInitI18n
    }));
    
    // Mock App
    vi.doMock('../App.jsx', () => ({
      default: vi.fn(() => 'MockedApp')
    }));
    
    // Mock CSS
    vi.doMock('../index.css', () => ({}));
  });
  
  afterEach(() => {
    // 恢复原始对象
    global.document = originalDocument;
    global.console = originalConsole;
    vi.clearAllMocks();
  });
  
  it('should initialize i18n and render app when successful', async () => {
    // 设置i18n成功初始化
    mockInitI18n.mockResolvedValue(undefined);
    
    // 动态导入main.jsx
    await import('../main.jsx');
    
    // 验证i18n初始化被调用
    expect(mockInitI18n).toHaveBeenCalled();
    
    // 验证document.getElementById被调用
    expect(document.getElementById).toHaveBeenCalledWith('root');
    
    // 验证createRoot被调用
    expect(mockCreateRoot).toHaveBeenCalled();
  });
  
  it('should handle i18n initialization failure gracefully', async () => {
    // 设置i18n初始化失败
    const error = new Error('i18n initialization error');
    mockInitI18n.mockRejectedValue(error);
    
    // 动态导入main.jsx
    await import('../main.jsx');
    
    // 验证错误被记录
    expect(console.error).toHaveBeenCalledWith('Failed to initialize i18n:', error);
    
    // 即使失败，也应该尝试渲染应用
    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).toHaveBeenCalled();
  });
  
  it('should handle missing root element', async () => {
    // 设置document.getElementById返回null
    document.getElementById.mockReturnValue(null);
    mockInitI18n.mockResolvedValue(undefined);
    
    // 尝试导入main.jsx，应该不会抛出未捕获的错误
    await expect(import('../main.jsx')).resolves.not.toThrow();
    
    // 验证document.getElementById被调用
    expect(document.getElementById).toHaveBeenCalledWith('root');
  });
});