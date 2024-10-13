// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // This matches any request starting with /api
        target: 'http://localhost:5000', // Replace with your backend server's URL
        changeOrigin: true,
        secure: false,
        // Optional: Rewrite the URL path if necessary
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
