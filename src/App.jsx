import React from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import AppRouter from './components/AppRouter'
import './config/i18n' // 导入国际化配置

function App() {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "google", "wallet"],
        appearance: {
          theme: "light",
          accentColor: "#4B5EF5",
          logo: "/logo.svg",
          logoStyle: "rounded",
          showWalletLoginFirst: false
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets"
        }
      }}
    >
      <LanguageProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </LanguageProvider>
    </PrivyProvider>
  )
}

export default App