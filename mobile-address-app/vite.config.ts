import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '../landing-web/public/edit',
    emptyOutDir: true,
  },
  server: {
    port: 3001,
  },
});

