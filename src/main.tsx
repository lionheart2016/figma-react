import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initI18n } from './config/i18n'
import { PrivyProvider } from './providers/PrivyProvider'
import { UserStateProvider } from './services/UserStateService'

// 初始化i18n然后渲染React应用
initI18n().then(() => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <PrivyProvider>
          <UserStateProvider>
            <App />
          </UserStateProvider>
        </PrivyProvider>
      </React.StrictMode>,
    );
  }
}).catch(error => {
  console.error('Failed to initialize i18n:', error);
  // 即使i18n初始化失败，也渲染应用
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <PrivyProvider>
          <UserStateProvider>
            <App />
          </UserStateProvider>
        </PrivyProvider>
      </React.StrictMode>,
    );
  }
});