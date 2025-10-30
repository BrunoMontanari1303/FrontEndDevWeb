import { http } from '../../services/http'

export async function fetchVeiculos({ page=1, limit=100, sortBy='id', order='ASC' } = {}) {
  const { data } = await http.get('/veiculos', { params:{ page, limit, sortBy, order } })
  return data?.data ?? []
}
export async function fetchMotoristas({ page=1, limit=100, sortBy='id', order='ASC' } = {}) {
  const { data } = await http.get('/motoristas', { params:{ page, limit, sortBy, order } })
  return data?.data ?? []
}
export async function fetchUsuarios({ page=1, limit=100, sortBy='id', order='ASC' } = {}) {
  const { data } = await http.get('/usuarios', { params:{ page, limit, sortBy, order } })
  return data?.data ?? []
}
