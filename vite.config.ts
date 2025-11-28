import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Inject a specific string placeholder during build.
    // The docker-entrypoint.sh script will replace this string with the actual env var at runtime.
    'process.env.API_KEY': JSON.stringify('__GEMINI_API_KEY_PLACEHOLDER__'),
    // Polyfill process.env to avoid reference errors
    'process.env': {} 
  }
});