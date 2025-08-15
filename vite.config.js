import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/public-data': {
        target: 'https://apis.data.go.kr',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/public-data/, '')
      }
    }
  }
})
