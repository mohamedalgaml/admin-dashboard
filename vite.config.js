import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        require('@tailwindcss/postcss7-compat'),
        require('autoprefixer')
      ]
    }
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})