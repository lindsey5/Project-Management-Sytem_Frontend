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
        target: 'https://project-management-system-backend-m3cn.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/chathub': {
        target: 'https://project-management-system-backend-m3cn.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
