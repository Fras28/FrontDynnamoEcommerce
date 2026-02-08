import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
// Importamos el package.json para obtener la versión
import packageJson from './package.json';

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
        name: 'Alquimystic Ecomm',
        short_name: 'Alquimystic',
        description: 'Ecommerce Alquimystic',
        background_color: '#26262D',
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
  // Inyección de variables para versionado
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
    'import.meta.env.VITE_BUILD_DATE': JSON.stringify(new Date().toISOString()),
  },
  // Mantener soporte para modelos 3D
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    rollupOptions: {
      output: {
        // Optimización de chunks para mejorar la carga inicial
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});