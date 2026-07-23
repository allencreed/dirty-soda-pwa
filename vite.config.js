import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Dirty Soda Co.',
        short_name: 'Dirty Soda',
        description: 'Fresh dirty sodas made to order',
        theme_color: '#ed8936',
        background_color: '#1a202c',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          { urlPattern: /^https:\/\/api\/.*/i, handler: 'NetworkFirst', options: { cacheName: 'api', networkTimeoutSeconds: 3 } },
          { urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/, handler: 'CacheFirst', options: { cacheName: 'images', expiration: { maxEntries: 60 } } }
        ]
      }
    })
  ],
  server: { proxy: { '/api': 'http://localhost:3001' } },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
})
