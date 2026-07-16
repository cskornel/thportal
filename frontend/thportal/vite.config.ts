import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Fejlesztés közben az /api kéréseket a backendhez továbbítjuk.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
