import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initI18n } from './config/i18n'
import './config/i18n' // 确保i18n实例被创建

// 初始化i18n然后渲染React应用
initI18n().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}).catch(error => {
  console.error('Failed to initialize i18n:', error);
  // 即使i18n初始化失败，也渲染应用
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});