import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-routes-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ? req.url.split('?')[0].split('#')[0] : '';
          if (url === '/how-it-works' || url === '/how-it-works/') {
            req.url = '/how-it-works/index.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
          } else if (url === '/kako-funkcionise' || url === '/kako-funkcionise/') {
            req.url = '/kako-funkcionise/index.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 3000
  }
});

