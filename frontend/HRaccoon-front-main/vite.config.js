import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/variables/_vuetify.scss',
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },

      manifest: {
        name: 'Hraccoon',
        short_name: 'raccoon',
        background_color: '#FFFFFF',
        theme_color: '#696CFF',
        description: 'Hraccoon mobile application',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\.ico$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ico-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /\.json$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'json-cache',
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@images': fileURLToPath(new URL('./src/assets/images/', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets/', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles/', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
      '@configured-variables': fileURLToPath(new URL('./src/styles/variables/_template.scss', import.meta.url)),
    },
  },

  build: {
    commonjsOptions: {
      exclude: ['ckeditor5-custom-build'],
    },
    sourcemap: false, // 소스 맵 비활성화
    minify: 'terser', // 코드 최소화
    rollupOptions: {
      output: {
        manualChunks: {
          vuetify: ['vuetify'],
        },
      },
    },
  },

  optimizeDeps: {
    include: ['ckeditor5-custom-build'],
    extensions: ['.scss', '.sass'],
    entries: ['./src/**/*.vue'],
    exclude: ['vuetify'],
    esbuildOptions: {
      plugins: [
        (await import('esbuild-sass-plugin')).sassPlugin({
          type: 'style',
          logger: {
            warn() {},
          },
        }),
      ],
    },
  },
})
