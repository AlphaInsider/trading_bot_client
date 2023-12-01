import { fileURLToPath } from 'url';

import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { createVuePlugin as vue2 } from 'vite-plugin-vue2';
import scriptSetup from 'unplugin-vue2-script-setup/vite';

export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      },
      '^/ws': {
        target: 'ws://127.0.0.1:3000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  plugins: [
    vue2({
      jsx: true
    }),
    scriptSetup(),
    legacy({
      targets: ['> 1%', 'last 2 versions']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
