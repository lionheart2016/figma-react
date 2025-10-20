# Figma React Crypto Trading Platform - Project Structure

## 📁 项目根目录

```
figma-react/
├── .env                          # 环境变量配置文件
├── .env.example                  # 环境变量示例文件
├── .gitignore                    # Git忽略文件配置
├── .trae/rules/project_rules.md  # Trae项目规则配置
├── README.md                     # 项目说明文档
├── PROJECT_STRUCTURE.md          # 项目结构文档（本文件）
├── id_name_table.md              # Figma设计稿ID与名称对照表
├── index.html                    # HTML入口文件
├── package.json                  # 项目依赖配置
├── postcss.config.js             # PostCSS配置文件
├── tailwind.config.js            # Tailwind CSS配置文件
├── vite.config.js                # Vite构建工具配置
├── yarn.lock                     # Yarn依赖锁定文件
└── yarn.lock                     # Yarn依赖锁定文件（重复项）
```

## 🏗️ 源代码目录结构

### src/ - 主要源代码目录

```
src/
├── App.jsx                       # 根应用组件（PrivyProvider配置）
├── main.jsx                      # 应用入口文件
├── index.css                     # 全局样式文件
├── components/                   # 组件目录
│   ├── AppRouter.jsx             # 应用路由组件
│   ├── Router.jsx                # 路由配置组件
│   ├── auth-module/              # 认证模块组件
│   │   └── (认证相关组件)
│   └── core/                     # 核心组件
│       ├── Header.jsx            # 页面头部组件
│       ├── Layout.jsx            # 页面布局组件
│       ├── Sidebar.jsx           # 侧边栏组件
│       ├── TradeView.jsx         # 交易页面主组件
│       └── (其他核心组件)
├── config/                       # 配置文件目录
│   ├── i18n.js                   # 国际化配置
│   ├── privy.js                  # Privy SDK配置
│   └── routes.js                 # 路由配置
├── contexts/                     # React上下文目录
│   ├── AuthContext.jsx           # 认证上下文
│   ├── LanguageContext.jsx       # 语言上下文
│   └── RouterContext.jsx         # 路由上下文
├── locales/                      # 国际化语言文件
│   ├── en.json                   # 英文翻译
│   ├── zh-CN.json                # 简体中文翻译
│   └── zh-TW.json                # 繁体中文翻译
└── services/                     # 服务层目录
    └── userState.jsx             # 用户状态管理服务
```

## 📦 公共资源目录

### public/ - 静态资源目录

```
public/
├── alpha-privy-logo.svg          # Alpha Privy Logo
├── alphatoken-combined-logo.svg  # AlphaToken组合Logo
├── alphatoken-logo.svg           # AlphaToken Logo
├── arrow-down.svg                # 向下箭头图标
├── arrow-left.svg                # 向左箭头图标
├── brand-delivery-bg.png         # 品牌交付背景图
├── chevron-down.svg              # 下拉箭头图标
├── cloudpeak-gold-token.svg      # CloudPeak黄金代币图标
├── confirm-password-icon.svg     # 确认密码图标
├── corporate-icon.svg            # 企业图标
├── dashboard-icon.svg            # 仪表盘图标
├── ellipse-1382.svg              # 椭圆装饰图形
├── email-icon.svg                # 邮箱图标
├── global-icon.svg               # 全局图标
├── investment-complete.svg       # 投资完成图标
├── next-icon.svg                 # 下一步图标
├── notification.svg              # 通知图标
├── password-icon.svg             # 密码图标
├── personal-profile.svg          # 个人资料图标
├── radio-off.svg                 # 单选按钮关闭状态
├── radio-on.svg                  # 单选按钮开启状态
├── reports-icon.svg              # 报告图标
├── setting.svg                   # 设置图标
├── settings-icon.svg             # 设置图标（重复）
├── slash.svg                     # 斜杠图标
├── step1-icon.svg                # 步骤1图标
├── step2-icon.svg                # 步骤2图标
├── step3-icon.svg                # 步骤3图标
├── trade-icon.svg                # 交易图标
└── wallets-icon.svg              # 钱包图标
```

## 🎨 设计系统参考

### Figma设计稿
- **设计稿链接**: https://www.figma.com/design/VK2PYu3kezKbD7sljThThMIJ/设计初稿?node-id=0-1&t=TlpCLC5SwQz89FmI-1
- **ID对照表**: `id_name_table.md` 文件包含所有页面和组件的ID与名称对应关系

## 🔧 技术栈与依赖

### 核心框架
- **React 18**: 前端UI框架
- **Vite**: 构建工具和开发服务器
- **Tailwind CSS**: 样式框架
- **PostCSS**: CSS处理工具

### 认证与钱包
- **Privy SDK**: 用户认证和钱包集成
- **配置位置**: `src/config/privy.js` 和 `src/App.jsx` 中的 PrivyProvider

### 国际化
- **i18next**: 国际化框架
- **react-i18next**: React国际化集成
- **语言支持**: 英文(默认)、简体中文、繁体中文
- **配置文件**: `src/config/i18n.js`

### 状态管理
- **React Context**: 使用Context API进行状态管理
- **localStorage**: 用户状态持久化存储

## 🚀 开发配置

### 运行命令
```bash
yarn dev      # 启动开发服务器（端口4000）
```

### 访问地址
- **本地开发**: http://localhost:4000/
- **交易页面**: http://localhost:4000/trade

## 📋 模块功能说明

### 认证模块 (auth-module/)
- 处理用户登录、注册流程
- 集成Privy认证服务
- 支持邮箱、Google、钱包登录方式

### 核心组件 (core/)
- **Header**: 页面头部，显示用户信息、语言切换、登出按钮
- **Layout**: 页面布局容器，管理整体页面结构
- **Sidebar**: 侧边导航栏
- **TradeView**: 交易页面主组件，展示交易功能卡片

### 服务层 (services/)
- **userState.jsx**: 管理用户状态，处理localStorage数据存取

### 上下文管理 (contexts/)
- **AuthContext**: 全局认证状态管理
- **LanguageContext**: 语言切换状态管理
- **RouterContext**: 路由状态管理

## 🔍 关键配置文件详解

### App.jsx
- 配置PrivyProvider，设置appId和认证方式
- 集成国际化和认证上下文
- 设置嵌入式钱包创建策略

### 国际化配置 (i18n.js)
- 配置三种语言支持
- 设置默认语言和回退语言
- 集成语言检测和缓存

### 路由配置 (routes.js)
- 定义应用路由结构
- 配置页面组件映射

## 📊 项目状态

### ✅ 已完成功能
- [x] 基础项目架构搭建
- [x] Privy认证集成
- [x] 国际化多语言支持
- [x] 用户状态管理
- [x] 交易页面基础布局
- [x] 响应式设计实现

### 🔄 运行状态
- **开发服务器**: ✅ 正在运行 (端口4000)
- **用户认证**: ✅ 正常工作
- **国际化**: ✅ 翻译正确显示
- **页面渲染**: ✅ 所有组件正常显示

---

*最后更新: 2024年*
*项目状态: 开发中，基础功能已完成*