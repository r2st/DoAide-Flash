import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '172.18.0.1',
    port: 3063,
  },
  preview: {
    host: '172.18.0.1',
    port: 3063,
  },
})
