import axios from 'axios'
import { useAuthStore } from '../features/auth/useAuthStore'


export const http = axios.create({ baseURL: import.meta.env.VITE_API_URL })


http.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})


let refreshing = null


http.interceptors.response.use(
    (res) => res,
    async (err) => {
        const { response, config } = err
        if (response?.status === 401 && !config.__isRetry) {
            if (!refreshing) {
                refreshing = (async () => {
                    try {
                        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true })
                        useAuthStore.getState().setSession(data.access_token, data.user)
                        return data.access_token
                    } catch (e) {
                        useAuthStore.getState().clear()
                        return null
                    } finally {
                        setTimeout(() => { refreshing = null }, 0)
                    }
                })()
            }
            const newToken = await refreshing
            if (newToken) {
                config.__isRetry = true
                config.headers.Authorization = `Bearer ${newToken}`
                return http(config)
            }
        }
        return Promise.reject(err)
    }
)