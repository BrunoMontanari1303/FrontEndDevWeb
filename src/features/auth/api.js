import { http } from '../../services/http'
import { useAuthStore } from './useAuthStore'


//export async function login(email, password) {
//   const { data } = await http.post('/auth/login', { email, password })
//   useAuthStore.getState().setSession(data.access_token, data.user)
//}

export async function login(email, password) {
    if (import.meta.env.DEV && email) {
        useAuthStore.getState().setSession('dev-token', { id: '1', name: 'Dev', roles: ['admin'] })
        return
    }
    const { data } = await http.post('/auth/login', { email, password })
    useAuthStore.getState().setSession(data.access_token, data.user)
}