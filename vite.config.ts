import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'Dynnamo Demo',
        short_name: 'Dynnamo',
        description: 'Test Ecommerce',
        background_color: '#0fe778',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: './public/tecnogen.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './public/tecnogen.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: './public/tecnogen.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
});