import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: false,
            },
            includeAssets: ['favicon.svg', 'robots.txt'],
            manifest: {
                name: 'AKTU Prep',
                short_name: 'AKTU Prep',
                start_url: '/',
                display: 'standalone',
                background_color: '#0f172a',
                theme_color: '#6366f1',
                icons: [
                    {
                        src: '/logo.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            workbox: {
                cleanupOutdatedCaches: true,
                navigateFallbackDenylist: [/^\/api/],
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'unsplash-images',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
                            },
                        },
                    },
                    {
                        urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24, // 1 day
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-icons': ['@phosphor-icons/react'],
                    'vendor-utils': ['date-fns', 'framer-motion'],
                    'vendor-supabase': ['@supabase/supabase-js'],
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        watch: {
            ignored: ['**/server/**', '**/cache/**', '**/node_modules/**', '**/dist/**'],
        },
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
