import axios from 'axios'
import { useAuthStore } from '../features/auth/useAuthStore'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const http = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    try {
      const { token } = useAuthStore.getState()
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      console.warn('[HTTP] Erro ao ler token do store', e)
    }
    return config
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const cfg = error?.config || {}

    try {
      console.group?.('[API ERROR]')
      console.log?.('URL:', `${cfg.baseURL || baseURL || ''}${cfg.url || ''}`)
      console.log?.('Method:', cfg.method)
      console.log?.('Status:', error?.response?.status)
      console.log?.('Response data:', error?.response?.data)
      console.log?.('Message:', error?.message)
      console.groupEnd?.()
    } catch {
    }

    const status = error?.response?.status

    if (status === 401) {
      try {
        useAuthStore.getState().clear()
      } catch (e) {
        console.warn('[HTTP] Erro ao limpar store após 401', e)
      }

      const isOnLogin = window.location.pathname === '/login'
      const isLoginRequest = cfg.url?.includes('/auth/login')

      if (!isOnLogin && !isLoginRequest) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default http
export { http }