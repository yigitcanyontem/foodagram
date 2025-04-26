import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.0.12:8083',
  //       rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
  define: {
    global: {}
  }
})
