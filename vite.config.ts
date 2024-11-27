import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'systemAdmin',
  plugins: [react()],
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"],
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001',
        // target: 'https://litt.cloud',
        changeOrigin: true
      }
    }
  }
})
