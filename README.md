# alpha token Crypto Trading Platform

基于Figma设计的加密货币交易平台，使用React开发，支持国际化功能。

## 🌟 功能特性

### 🔐 用户认证
- **邮箱登录**：支持邮箱验证码登录方式
- **用户状态管理**：完整的用户认证状态管理

### 🌍 国际化支持
- **多语言支持**：英文、简体中文、繁體中文
- **语言切换器**：美观的下拉式语言切换组件
- **本地化内容**：所有页面内容完全翻译

### 📱 主要页面
- **投资类型选择**：个人投资者和企业投资者选择
- **用户认证**：邮箱验证和注册流程
- **仪表板**：交易概览和资产管理
- **交易界面**：加密货币交易功能
- **钱包管理**：多钱包支持和管理

### 🎨 设计系统
- **Figma设计稿**：基于完整的设计系统
- **响应式布局**：适配各种设备尺寸
- **现代化UI**：美观的用户界面和交互体验

## 🚀 快速开始

### 安装依赖
```bash
yarn install
```

### 环境配置
复制 `.env.example` 为 `.env` 并根据需要配置相关变量。

### 启动开发服务器
```bash
yarn dev
```

访问地址：http://localhost:4000

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── auth-module/    # 认证相关组件
│   ├── Dashboard.jsx   # 仪表板组件
│   ├── Trade.jsx       # 交易组件
│   └── ...
├── contexts/           # React上下文
│   ├── AuthContext.jsx # 认证上下文
│   └── LanguageContext.jsx # 语言上下文
├── locales/           # 国际化文件
│   ├── en.json        # 英文翻译
│   ├── zh-CN.json     # 简体中文翻译
│   └── zh-TW.json     # 繁體中文翻译
├── config/            # 配置文件
│   ├── i18n.js       # 国际化配置
│   └── auth.js       # 认证配置
└── services/         # 服务层
    └── UserStateService.tsx  # 用户状态管理

## 🔧 技术栈

- **React 18**：前端框架
- **Vite**：构建工具
- **TypeScript**：类型安全
- **React Router**：路由管理
- **React i18next**：国际化支持
- **Tailwind CSS**：样式框架
- **Yarn**：包管理器

## 📝 开发说明

### 添加新语言
1. 在 `src/locales/` 目录下创建新的语言文件
2. 在 `src/config/i18n.js` 中配置新语言
3. 更新语言切换器组件

### 用户认证
- 项目使用邮箱验证码方式进行用户认证
- 用户状态通过UserStateService进行管理

### Figma设计集成
- 设计稿链接：https://www.figma.com/design/VK2PYu3kezKbD7sljThMIJ/设计初稿
- 使用 `id_name_table.md` 文件查找组件ID和名称对应关系

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📝 许可证

此项目基于MIT许可证开源。

## 🆘 支持

如有问题，请通过以下方式联系：
- 邮箱：your-email@example.com
- GitHub Issues

---

**⭐ 如果这个项目对你有帮助，请给个Star！**