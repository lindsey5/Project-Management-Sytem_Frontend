import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], 
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5046',
        changeOrigin: true,
        secure: false,
      },
      '/chathub': {
        target: 'http://localhost:5046',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
