# Firebase 部署指南

## 前置要求

1. 安装 Firebase CLI
```bash
# 如果使用 npm
npm install -g firebase-tools

# 如果使用 yarn (注意 Node.js 版本兼容性)
yarn global add firebase-tools
```

2. 登录 Firebase
```bash
firebase login
```

3. 初始化 Firebase 项目
```bash
firebase init hosting
```

## 部署命令

### 构建并部署
```bash
yarn deploy
```

### 仅部署托管
```bash
yarn deploy:hosting
```

### 本地预览
```bash
yarn serve
```

## 项目配置

- **构建输出目录**: `dist/`
- **默认项目名称**: `figma-react-app` (可在 `.firebaserc` 中修改)
- **SPA 路由**: 已配置所有路由重定向到 index.html

## 注意事项

1. 确保在部署前运行 `yarn build` 生成生产版本
2. 检查 `.env` 文件中的环境变量是否适合生产环境
3. 如果更改项目名称，请更新 `.firebaserc` 文件

## 故障排除

### Node.js 版本兼容性
如果遇到 Node.js 版本兼容性问题，可以尝试：

1. 使用 Node Version Manager (nvm) 切换到兼容版本
2. 或使用 npm 替代 yarn 安装 Firebase CLI

### 部署错误
如果部署失败，检查：
- Firebase 项目是否存在
- 是否已正确登录 Firebase
- 构建过程是否成功完成