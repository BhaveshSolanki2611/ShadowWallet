/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_PROJECT_ID: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_ENABLE_TESTNETS: string
  readonly VITE_ANALYTICS_ID: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  var mongoose: {
    conn: any
    promise: any
  }
}

export {}
