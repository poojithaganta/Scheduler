import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // When running via docker-compose, the backend is accessible by service name
      '/api': 'http://backend:8080',
    },
  },
});


