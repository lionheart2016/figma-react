import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    globals: true,
    alias: {
      '@': resolve(__dirname, './src')
    },
    css: {
      modules: {
        classNameStrategy: 'camelCaseOnly'
      }
    },
    mockReset: true,
    // 允许运行所有测试文件，命令行可以通过参数指定特定文件
    include: ['**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // 排除node_modules和whitelabel-starter目录中的测试文件
    exclude: ['node_modules/**', '**/whitelabel-starter/**']
  },
  // 配置Vite
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // 直接将语言文件映射到mock文件
      '@/locales/en.json': resolve(__dirname, './src/__mocks__/jsonMock.js'),
      '@/locales/zh-CN.json': resolve(__dirname, './src/__mocks__/jsonMock.js'),
      '@/locales/zh-TW.json': resolve(__dirname, './src/__mocks__/jsonMock.js')
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
  },
  // 基本的esbuild配置
  esbuild: {
    // 移除固定的loader配置，让Vite自动根据文件扩展名选择合适的loader
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  }
})