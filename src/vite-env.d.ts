// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_BUILD_DATE: string;
}

// Esto fuerza a TypeScript a reconocer que ImportMeta tiene env
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}