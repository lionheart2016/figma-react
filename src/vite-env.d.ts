/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 环境变量可以在这里添加
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}