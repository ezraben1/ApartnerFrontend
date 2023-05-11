// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/my-app/' : '/',
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    open: true, // default: false
    strictPort: false, // default: false
  },
  build: {
    rollupOptions: {
      input: 'src/index.html'
    }
  }
})
