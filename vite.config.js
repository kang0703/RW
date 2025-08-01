import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  css: {
    devSourcemap: true, // 개발 모드에서 CSS 소스맵 활성화
    preprocessorOptions: {
      scss: {
        sourceMap: true, // SCSS 소스맵 활성화
        sourceMapContents: true, // 소스맵에 내용 포함
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // 빌드 시에도 소스맵 생성
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          weather: ['axios']
        }
      }
    }
  },
  server: {
    historyApiFallback: true
  }
})
