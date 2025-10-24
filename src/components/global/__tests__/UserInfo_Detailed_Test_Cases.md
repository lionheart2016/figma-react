# UserInfo组件详细测试用例

## 测试用例文档

### 测试用例1：用户按钮点击交互测试

**测试目的**：验证点击用户按钮能够正确切换下拉菜单的显示/隐藏状态

**前置条件**：
- UserInfo组件已正确渲染
- 用户处于未登录状态
- 菜单初始状态为隐藏

**测试步骤**：
1. 渲染UserInfo组件
2. 验证初始状态下菜单为隐藏状态
3. 点击用户按钮
4. 验证菜单显示状态
5. 再次点击用户按钮
6. 验证菜单隐藏状态

**预期结果**：
- 步骤2：菜单容器元素应具有隐藏样式（如display: none或opacity: 0）
- 步骤4：菜单容器元素应显示（如display: block或opacity: 1）
- 步骤4：菜单内容应包含"Login"按钮
- 步骤6：菜单容器元素应恢复隐藏状态

**实际结果**：
- [ ] 通过
- [ ] 失败

**测试代码**：
```typescript
it('should toggle dropdown menu visibility on button click', () => {
  const { container } = render(
    <ThemeProvider>
      <UserProvider>
        <UserInfo />
      </UserProvider>
    </ThemeProvider>
  );

  // 初始状态验证
  const menuContainer = container.querySelector('[data-testid="user-menu"]');
  expect(menuContainer).toHaveStyle('display: none');

  // 第一次点击 - 打开菜单
  const userButton = screen.getByRole('button');
  fireEvent.click(userButton);
  
  // 菜单显示验证
  expect(menuContainer).toHaveStyle('display: block');
  expect(screen.getByText('Login')).toBeInTheDocument();

  // 第二次点击 - 关闭菜单
  fireEvent.click(userButton);
  
  // 菜单隐藏验证
  expect(menuContainer).toHaveStyle('display: none');
  expect(screen.queryByText('Login')).not.toBeInTheDocument();
});
```

---

### 测试用例2：菜单内容显示测试

**测试目的**：验证不同用户状态下菜单内容的正确显示

**前置条件**：
- UserInfo组件已正确渲染
- 支持未登录和已登录两种状态

**测试步骤**：
1. 模拟未登录状态渲染组件
2. 点击用户按钮显示菜单
3. 验证未登录状态下的菜单内容
4. 模拟已登录状态渲染组件
5. 点击用户按钮显示菜单
6. 验证已登录状态下的菜单内容

**预期结果**：
- 步骤3：菜单应显示"Login"按钮和用户邮箱首字母
- 步骤6：菜单应显示"Logout"按钮和完整用户邮箱

**实际结果**：
- [ ] 通过
- [ ] 失败

**测试代码**：
```typescript
describe('Menu Content Display', () => {
  it('should show login button when user is not authenticated', () => {
    // 模拟未登录状态
    vi.mocked(useUser).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn()
    });

    render(
      <ThemeProvider>
        <UserProvider>
          <UserInfo />
        </UserProvider>
      </ThemeProvider>
    );

    // 打开菜单
    fireEvent.click(screen.getByRole('button'));
    
    // 验证未登录状态内容
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('should show logout button and user info when user is authenticated', () => {
    // 模拟已登录状态
    vi.mocked(useUser).mockReturnValue({
      user: { email: 'test@example.com' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn()
    });

    render(
      <ThemeProvider>
        <UserProvider>
          <UserInfo />
        </UserProvider>
      </ThemeProvider>
    );

    // 打开菜单
    fireEvent.click(screen.getByRole('button'));
    
    // 验证已登录状态内容
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});
```

---

### 测试用例3：菜单事件冒泡处理测试

**测试目的**：验证菜单内部点击事件不会触发外部文档的点击处理

**前置条件**：
- UserInfo组件已正确渲染
- 菜单处于显示状态

**测试步骤**：
1. 渲染组件并打开菜单
2. 模拟点击菜单内部元素
3. 验证菜单保持显示状态
4. 模拟点击菜单外部区域
5. 验证菜单关闭

**预期结果**：
- 步骤3：点击菜单内部时，菜单应保持显示
- 步骤5：点击菜单外部时，菜单应关闭

**实际结果**：
- [ ] 通过
- [ ] 失败

**测试代码**：
```typescript
it('should handle event propagation correctly', () => {
  const { container } = render(
    <ThemeProvider>
      <UserProvider>
        <UserInfo />
        <div data-testid="outside-area">Outside Area</div>
      </UserProvider>
    </ThemeProvider>
  );

  // 打开菜单
  fireEvent.click(screen.getByRole('button'));
  
  // 点击菜单内部 - 应保持显示
  const loginButton = screen.getByText('Login');
  fireEvent.click(loginButton);
  
  expect(screen.getByText('Login')).toBeInTheDocument(); // 菜单保持显示
  
  // 点击菜单外部 - 应关闭菜单
  const outsideArea = screen.getByTestId('outside-area');
  fireEvent.mouseDown(outsideArea);
  
  expect(screen.queryByText('Login')).not.toBeInTheDocument(); // 菜单关闭
});
```

---

### 测试用例4：国际化支持测试

**测试目的**：验证菜单内容在不同语言环境下的正确显示

**前置条件**：
- UserInfo组件支持国际化
- 配置了英文、简体中文、繁体中文三种语言

**测试步骤**：
1. 设置英文语言环境
2. 验证英文菜单内容
3. 设置简体中文语言环境
4. 验证简体中文菜单内容
5. 设置繁体中文语言环境
6. 验证繁体中文菜单内容

**预期结果**：
- 步骤2：菜单应显示"Login"和"Logout"
- 步骤4：菜单应显示"登录"和"退出登录"
- 步骤6：菜单应显示"登入"和"登出"

**实际结果**：
- [ ] 通过
- [ ] 失败

**测试代码**：
```typescript
describe('Internationalization Support', () => {
  it('should display English text when language is English', () => {
    // 模拟英文环境
    vi.mocked(useTranslation).mockReturnValue({
      t: (key: string) => {
        const enTranslations = {
          'userInfo.login': 'Login',
          'userInfo.logout': 'Logout'
        };
        return enTranslations[key];
      }
    });

    render(
      <ThemeProvider>
        <UserProvider>
          <UserInfo />
        </UserProvider>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should display Simplified Chinese text when language is zh-CN', () => {
    // 模拟简体中文环境
    vi.mocked(useTranslation).mockReturnValue({
      t: (key: string) => {
        const zhCNTranslations = {
          'userInfo.login': '登录',
          'userInfo.logout': '退出登录'
        };
        return zhCNTranslations[key];
      }
    });

    render(
      <ThemeProvider>
        <UserProvider>
          <UserInfo />
        </UserProvider>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('登录')).toBeInTheDocument();
  });
});
```

---

### 测试用例5：菜单动画和样式测试

**测试目的**：验证菜单显示/隐藏时的动画效果和样式表现

**前置条件**：
- UserInfo组件已正确渲染
- CSS样式和动画已正确配置

**测试步骤**：
1. 验证菜单初始样式
2. 打开菜单并验证显示动画
3. 关闭菜单并验证隐藏动画
4. 验证菜单定位和布局

**预期结果**：
- 菜单应有平滑的显示/隐藏过渡效果
- 菜单应正确定位在用户按钮下方
- 菜单应有适当的阴影和边框样式

**实际结果**：
- [ ] 通过
- [ ] 失败

**测试代码**：
```typescript
it('should have correct styling and animation', () => {
  const { container } = render(
    <ThemeProvider>
      <UserProvider>
        <UserInfo />
      </UserProvider>
    </ThemeProvider>
  );

  const menuContainer = container.querySelector('[data-testid="user-menu"]');
  
  // 初始样式验证
  expect(menuContainer).toHaveClass('opacity-0');
  expect(menuContainer).toHaveClass('scale-95');
  
  // 打开菜单
  fireEvent.click(screen.getByRole('button'));
  
  // 显示样式验证
  expect(menuContainer).toHaveClass('opacity-100');
  expect(menuContainer).toHaveClass('scale-100');
  
  // 布局验证
  expect(menuContainer).toHaveStyle('position: absolute');
  expect(menuContainer).toHaveStyle('top: 100%');
  expect(menuContainer).toHaveStyle('right: 0');
});
```

---

## 测试执行说明

### 测试环境要求
- Node.js 16+
- Vitest测试框架
- @testing-library/react
- 项目依赖正确安装

### 执行命令
```bash
# 运行所有UserInfo组件测试
npm test src/components/global/__tests__/UserInfo.test.tsx

# 运行特定测试用例
npm test -- -t "should toggle dropdown menu visibility"
```

### 测试覆盖率目标
- 功能测试覆盖率：100%
- 边界条件覆盖率：100%
- 用户交互覆盖率：100%

### 问题排查指南
1. 如果菜单无法显示，检查toggleMenu函数逻辑
2. 如果菜单无法关闭，检查setIsMenuOpen调用
3. 如果样式异常，检查CSS类名和样式定义
4. 如果国际化失败，检查i18n配置和翻译文件