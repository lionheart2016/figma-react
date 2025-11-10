import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { codeInspectorPlugin } from "code-inspector-plugin";
import path from "path";

export default defineConfig({
  plugins: [
    codeInspectorPlugin({
        bundler: "vite",
        editor: "cursor"
    }),
    react()
  ],
  server: {
    port: 4000,
    host: true,
    hmr: {
      overlay: false
    }
  },
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.tsx', '.json'],
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
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