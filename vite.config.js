import react from '@vitejs/plugin-react-swc'


export default {
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}