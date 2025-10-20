/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRIVY_APP_ID?: string;
  // 其他环境变量可以在这里添加
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}