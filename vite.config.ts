import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Logic: 
      // 1. If API_KEY exists at build time (e.g. Vercel dashboard), use it.
      // 2. Otherwise, use the placeholder string (for Docker runtime replacement).
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '__GEMINI_API_KEY_PLACEHOLDER__'),
      // Polyfill process.env to avoid reference errors in some libraries
      'process.env': {} 
    }
  };
});