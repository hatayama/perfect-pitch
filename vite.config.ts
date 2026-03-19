import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/perfect-pitch/',
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        'app-play': resolve(__dirname, 'app-play/index.html'),
        'piano-play': resolve(__dirname, 'piano-play/index.html'),
        settings: resolve(__dirname, 'settings/index.html'),
      },
    },
  },
})
