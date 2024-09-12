import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true,  // Ensures the proxy handles different host headers
        secure: false,  // Set to false if the backend server is not using HTTPS
      },
    },
  },
});
