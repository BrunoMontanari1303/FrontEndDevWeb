import api from '../../services/api'

// Criar usuário (perfil novo)
export async function createUser(payload) {
  // payload: { nome, email, senha, papel: 'USER' | 'GESTOR' }
  const resp = await api.post('/usuarios', payload)
  return resp.data?.data
}

// Buscar usuário por ID
export async function getUserById(id) {
  const resp = await api.get(`/usuarios/${id}`)
  return resp.data?.data
}

// Atualizar usuário por ID (nome/email)
export async function updateUser(id, payload) {
  const resp = await api.patch(`/usuarios/${id}`, payload)
  return resp.data?.data
}

// Atualizar o próprio perfil
export async function updateMyProfile(payload) {
  const resp = await api.patch('/me', payload)
  return resp.data?.data
}