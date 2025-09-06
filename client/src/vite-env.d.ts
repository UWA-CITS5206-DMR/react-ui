/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_LOGGING: string;
  readonly VITE_MOCK_API: string;
  readonly VITE_MOCK_DELAY_MIN: string;
  readonly VITE_MOCK_DELAY_MAX: string;
  readonly VITE_MOCK_ERROR_RATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
