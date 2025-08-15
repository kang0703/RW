import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/events': {
        target: 'https://apis.data.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/events/, '/B551011/KorService2/searchFestival2'),
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('프록시 요청:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('프록시 응답 상태:', proxyRes.statusCode);
          });
        }
      }
    }
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        sourceMap: true,
        sourceMapContents: true
      }
    }
  },
  build: {
    sourcemap: true
  }
})
