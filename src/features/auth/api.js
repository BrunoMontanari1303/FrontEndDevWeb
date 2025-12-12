import api from '../../services/api'
import { useAuthStore } from './useAuthStore'

// login: envia email e senha para o backend e guarda token
export async function login(email, senha) {
  try {
    const resp = await api.post('/auth/login', { email, senha })

    // payload = objeto que veio do backend
    const payload = resp.data || resp

    // TOKEN:
    const token =
      payload?.data?.access_token ||
      payload?.data?.token ||
      payload?.token

    // USER:
    const user =
      payload?.data?.user ||
      payload?.data

    if (!token || !user) {
      throw new Error('Token ou usuário não recebidos do servidor')
    }

    useAuthStore.getState().setSession(token, user)

    return { ok: true, user, token }
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err.message ||
      'Erro ao autenticar'
    return { ok: false, message }
  }
}

export function logout() {
  useAuthStore.getState().clear()
}