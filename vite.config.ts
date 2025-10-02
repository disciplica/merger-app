import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on the mode (development, production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Expose the API key to the client-side code under process.env
      // Vite securely replaces this during the build process
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    },
  };
});
