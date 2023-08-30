import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'system',
  plugins: [react()],
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"],
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/systemApi': {
        target: 'http://127.0.0.1:8010',
        // target: 'http://127.0.0.1:7001',
        changeOrigin: true
      }
    }
  }
})
