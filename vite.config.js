import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    host: true
  },
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.tsx', '.json']
  },
  // 排除测试文件的监视和加载
  watchOptions: {
    ignore: [
      '**/__tests__/**',
      '**/*.test.*',
      '**/*.spec.*'
    ]
  }
})