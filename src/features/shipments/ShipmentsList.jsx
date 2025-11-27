import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Button } from 'react-bootstrap'
import { fetchShipments, deleteShipment, acceptShipment } from './api'
import { useAuthStore } from '../auth/useAuthStore'
import { fetchVeiculos, fetchMotoristas } from '../reference/api'

export default function ShipmentsList({ search = '', filterStatus }) {
  const [shipments, setShipments] = useState([])
  const [veiculos, setVeiculos] = useState([])
  const [motoristas, setMotoristas] = useState([])
  const [loadingRefs, setLoadingRefs] = useState(false)
  const [assignments, setAssignments] = useState({})

  const { user } = useAuthStore()
  const role = user?.papel ?? null

  const isAdmin = role === 1 || role === 'ADMIN'
  const isGestor = role === 3 || role === 'GESTOR'

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        setLoadingRefs(true)

        const [shipmentsRes, veiculosRes, motoristasRes] = await Promise.all([
          fetchShipments(),   // { data, meta }
          fetchVeiculos(),    // array
          fetchMotoristas(),  // array
        ])

        if (cancelled) return

        setShipments(shipmentsRes?.data ?? [])
        setVeiculos(Array.isArray(veiculosRes) ? veiculosRes : [])
        setMotoristas(Array.isArray(motoristasRes) ? motoristasRes : [])
      } catch (error) {
        console.error('Erro ao carregar pedidos / referências:', error)
      } finally {
        if (!cancelled) setLoadingRefs(false)
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [])

  const getVeiculoLabel = (veiculoId) => {
    const id = veiculoId ?? null
    if (!id) return '-'
    const v = veiculos.find((v) => v.id === id)
    if (!v) return id
    return `${v.placa} (${v.modelo})`
  }

  const getMotoristaLabel = (motoristaId) => {
    const id = motoristaId ?? null
    if (!id) return '-'
    const m = motoristas.find((m) => m.id === id)
    if (!m) return id
    return m.nome
  }

  const handleDelete = async (id) => {
    if (!isAdmin) return

    try {
      if (!window.confirm('Tem certeza que deseja excluir?')) return

      await deleteShipment(id)

      setShipments((prev) => prev.filter((s) => s.id !== id))
      alert('Pedido excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir pedido:', error)
    }
  }

  const handleAccept = async (shipment) => {
    if (!isGestor) return

    if (shipment.status !== 'Pendente' && shipment.status !== 'PENDENTE') {
      alert('Esse pedido já foi processado.')
      return
    }

    const sel = assignments[shipment.id] || {}
    const veiculoId = Number(sel.veiculoId)
    const motoristaId = Number(sel.motoristaId)

    if (!Number.isInteger(veiculoId) || veiculoId <= 0) {
      alert('Selecione um veículo válido.')
      return
    }

    if (!Number.isInteger(motoristaId) || motoristaId <= 0) {
      alert('Selecione um motorista válido.')
      return
    }

    try {
      console.log('Enviando para aceitar:', {
        id: shipment.id,
        veiculoId,
        motoristaId,
      })

      await acceptShipment(shipment.id, veiculoId, motoristaId)

      setShipments((prev) =>
        prev.map((s) =>
          s.id === shipment.id
            ? {
              ...s,
              status: 'Aceito',
              veiculoId,
              veiculoid: veiculoId,
              motoristaId,
              motoristaid: motoristaId,
            }
            : s
        )
      )

      // opcional: limpar seleção do pedido aceito
      setAssignments((prev) => {
        const clone = { ...prev }
        delete clone[shipment.id]
        return clone
      })

      alert(`Pedido #${shipment.id} aceito com sucesso!`)
    } catch (error) {
      console.error('Erro ao aceitar pedido:', error)
      alert('Erro ao aceitar pedido. Veja o console para mais detalhes.')
    }
  }

  const q = search.trim().toLowerCase()

  const matchesSearch = (shipment) => {
    if (!q) return true

    return (
      String(shipment.id).includes(q) ||
      shipment.origem?.toLowerCase().includes(q) ||
      shipment.destino?.toLowerCase().includes(q) ||
      shipment.tipoCarga?.toLowerCase().includes(q)
    )
  }

  const filteredShipments = shipments.filter((shipment) => {
    const bySearch = matchesSearch(shipment)
    const byStatus = filterStatus ? shipment.status === filterStatus : true
    return bySearch && byStatus
  })

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Origem</th>
          <th>Destino</th>
          <th>Status</th>
          <th>Veículo</th>
          <th>Motorista</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {filteredShipments.map((shipment) => {
          const selecao = assignments[shipment.id] || {}
          const veiculoSelecionado =
            selecao.veiculoId ??
            shipment.veiculoId ??
            shipment.veiculoid ??
            ''
          const motoristaSelecionado =
            selecao.motoristaId ??
            shipment.motoristaId ??
            shipment.motoristaid ??
            ''

          const isPending =
            shipment.status === 'Pendente' || shipment.status === 'PENDENTE'

          const canAccept =
            isGestor &&
            isPending &&
            veiculoSelecionado &&
            motoristaSelecionado &&
            !loadingRefs

          return (
            <tr key={shipment.id}>
              <td>{shipment.id}</td>
              <td>{shipment.origem}</td>
              <td>{shipment.destino}</td>
              <td>{shipment.status}</td>

              {/* Coluna Veículo */}
              <td>
                {isPending ? (
                  <select
                    className="form-select form-select-sm"
                    disabled={!isGestor || loadingRefs}
                    value={veiculoSelecionado}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : ''
                      setAssignments((prev) => ({
                        ...prev,
                        [shipment.id]: {
                          ...(prev[shipment.id] || {}),
                          veiculoId: value,
                        },
                      }))
                    }}
                  >
                    <option value="">
                      {loadingRefs ? 'Carregando...' : 'Selecione um veículo'}
                    </option>
                    {veiculos.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.placa} ({v.modelo})
                      </option>
                    ))}
                  </select>
                ) : (
                  getVeiculoLabel(shipment.veiculoId ?? shipment.veiculoid)
                )}
              </td>

              {/* Coluna Motorista */}
              <td>
                {isPending ? (
                  <select
                    className="form-select form-select-sm"
                    disabled={!isGestor || loadingRefs}
                    value={motoristaSelecionado}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : ''
                      setAssignments((prev) => ({
                        ...prev,
                        [shipment.id]: {
                          ...(prev[shipment.id] || {}),
                          motoristaId: value,
                        },
                      }))
                    }}
                  >
                    <option value="">
                      {loadingRefs ? 'Carregando...' : 'Selecione um motorista'}
                    </option>
                    {motoristas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                ) : (
                  getMotoristaLabel(
                    shipment.motoristaId ?? shipment.motoristaid
                  )
                )}
              </td>

              {/* Coluna Ações */}
              <td>
                <Link to={`/shipments/${shipment.id}`}>
                  <Button variant="info" size="sm">
                    Detalhes
                  </Button>
                </Link>

                {isGestor && isPending && (
                  <Button
                    variant="success"
                    size="sm"
                    className="ms-2"
                    disabled={!canAccept}
                    onClick={() => handleAccept(shipment)}
                  >
                    Aceitar
                  </Button>
                )}

                {isAdmin && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleDelete(shipment.id)}
                  >
                    Excluir
                  </Button>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}