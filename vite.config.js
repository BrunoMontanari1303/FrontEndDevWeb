import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'  // Substitua pelo seu back-end
    }
  }
}