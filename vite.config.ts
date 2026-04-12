/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const API_URL = process.env['VITE_API_URL'] ?? 'https://pfm-go-api.fly.dev';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },

  server: {
    proxy: {
      '/auth': { target: API_URL, changeOrigin: true },
      '/api': { target: API_URL, changeOrigin: true },
      '/health': { target: API_URL, changeOrigin: true },
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/test/**',
        'src/**/*.d.ts',
        'src/**/*.stories.{ts,tsx}',
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
