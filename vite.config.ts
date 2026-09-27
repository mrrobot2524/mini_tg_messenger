import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/green-api': {
        target: 'https://api.green-api.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/green-api/, ''),
      },
    },
  }
})
