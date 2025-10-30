import { http } from '../../services/http'

// Lista com paginação simples (back aceita page/limit/sortBy/order)
export async function fetchShipments(q) {
  const page  = q?.page ?? 1
  const limit = q?.perPage ?? 25
  let sortBy = 'id', order = 'DESC'
  if (q?.sort) {
    const [field, dir] = q.sort.split(':')
    sortBy = field || 'id'
    order  = (dir || 'DESC').toUpperCase()
  }
  const { data } = await http.get('/pedidos', { params: { page, limit, sortBy, order } })
  const rows = Array.isArray(data?.data) ? data.data : []
  return { data: rows, meta: { page, perPage: limit, total: undefined } }
}

export async function getShipment(id) {
  const { data } = await http.get(`/pedidos/${id}`)
  return data?.data
}

export async function createShipment(payload) {
  const { data } = await http.post('/pedidos', payload)
  return data?.data
}

export async function updateShipment(id, payload) {
  const { data } = await http.patch(`/pedidos/${id}`, payload)
  return data?.data
}

export async function deleteShipment(id) {
  const { data } = await http.delete(`/pedidos/${id}`)
  return data?.data
}
