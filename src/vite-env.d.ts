/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables
 * 
 * Note: Only define environment variables that are actually used in the project.
 * All Vite environment variables must be prefixed with VITE_ to be exposed to the client.
 */
interface ImportMetaEnv {
  /**
   * Backend API URL
   * @default "http://localhost:8000" (fallback in api-client-v2.ts)
   */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
