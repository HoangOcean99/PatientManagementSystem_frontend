import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/doctor/': 'http://localhost:3000', // Thêm dấu / để tránh nhầm với route /doctors của frontend
      '/auth': 'http://localhost:3000',
    }
  }
})
