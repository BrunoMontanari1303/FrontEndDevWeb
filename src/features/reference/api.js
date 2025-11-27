import { http } from '../../services/http'

export async function fetchVeiculos() {
  const { data } = await http.get('/veiculos')
  return Array.isArray(data?.data) ? data.data : []
}

export async function createVeiculo(payload) {
  const { data } = await http.post('/veiculos', payload)
  return data?.data
}

export async function updateVeiculo(id, payload) {
  const { data } = await http.patch(`/veiculos/${id}`, payload)
  return data?.data
}

export async function deleteVeiculo(id) {
  await http.delete(`/veiculos/${id}`)
}


export async function fetchMotoristas() {
  const { data } = await http.get('/motoristas')
  return Array.isArray(data?.data) ? data.data : []
}

export async function createMotorista(payload) {
  const { data } = await http.post('/motoristas', payload)
  return data?.data
}

export async function updateMotorista(id, payload) {
  const { data } = await http.patch(`/motoristas/${id}`, payload)
  return data?.data
}

export async function deleteMotorista(id) {
  await http.delete(`/motoristas/${id}`)
}

export async function fetchUsuarios({ page=1, limit=100, sortBy='id', order='ASC' } = {}) {
  const { data } = await http.get('/usuarios', { params:{ page, limit, sortBy, order } })
  return data?.data ?? []
}
